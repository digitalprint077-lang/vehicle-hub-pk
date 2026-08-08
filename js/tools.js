(function () {
  function num(el) {
    if (!el) return NaN;
    var v = parseFloat(String(el.value).replace(/,/g, '').trim());
    return v;
  }

  function money(n) {
    if (!isFinite(n)) return '—';
    return 'Rs ' + Math.round(n).toLocaleString('en-PK');
  }

  function fixed(n, d) {
    if (!isFinite(n)) return '—';
    return n.toFixed(d == null ? 1 : d);
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function showResult(id, show) {
    var el = document.getElementById(id);
    if (!el) return;
    el.hidden = !show;
  }

  function bindFuelCost() {
    var form = document.getElementById('fuel-cost-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var distance = num(form.elements.distance);
      var efficiency = num(form.elements.efficiency);
      var price = num(form.elements.price);
      if (!(distance > 0) || !(efficiency > 0) || !(price > 0)) {
        showResult('fuel-cost-result', false);
        setText('fuel-cost-error', 'Enter distance, fuel efficiency, and price greater than zero.');
        showResult('fuel-cost-error', true);
        return;
      }
      showResult('fuel-cost-error', false);
      var litres = distance / efficiency;
      var cost = litres * price;
      setText('fuel-litres', fixed(litres, 2) + ' L');
      setText('fuel-cost', money(cost));
      setText('fuel-per-km', money(cost / distance) + ' / km');
      showResult('fuel-cost-result', true);
    });
  }

  function bindMileage() {
    var form = document.getElementById('mileage-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var start = num(form.elements.startOdo);
      var end = num(form.elements.endOdo);
      var fuel = num(form.elements.fuelFilled);
      if (!(end > start) || !(fuel > 0)) {
        showResult('mileage-result', false);
        setText('mileage-error', 'End odometer must be greater than start, and fuel filled must be above zero.');
        showResult('mileage-error', true);
        return;
      }
      showResult('mileage-error', false);
      var km = end - start;
      var kml = km / fuel;
      setText('mileage-distance', fixed(km, 1) + ' km');
      setText('mileage-kml', fixed(kml, 2) + ' km/L');
      setText('mileage-l100', fixed(100 / kml, 2) + ' L/100km');
      showResult('mileage-result', true);
    });
  }

  function bindTripCost() {
    var form = document.getElementById('trip-cost-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var distance = num(form.elements.distance);
      var efficiency = num(form.elements.efficiency);
      var price = num(form.elements.price);
      var tolls = num(form.elements.tolls);
      var other = num(form.elements.other);
      if (!(distance > 0) || !(efficiency > 0) || !(price > 0)) {
        showResult('trip-cost-result', false);
        setText('trip-cost-error', 'Enter trip distance, efficiency, and fuel price greater than zero.');
        showResult('trip-cost-error', true);
        return;
      }
      if (!isFinite(tolls) || tolls < 0) tolls = 0;
      if (!isFinite(other) || other < 0) other = 0;
      showResult('trip-cost-error', false);
      var fuelCost = (distance / efficiency) * price;
      var total = fuelCost + tolls + other;
      var people = num(form.elements.people);
      if (!(people >= 1)) people = 1;
      setText('trip-fuel', money(fuelCost));
      setText('trip-extras', money(tolls + other));
      setText('trip-total', money(total));
      setText('trip-per-person', money(total / people));
      showResult('trip-cost-result', true);
    });
  }

  var REMINDER_KEY = 'vhpk-maintenance-reminders';

  function loadReminders() {
    try {
      var raw = localStorage.getItem(REMINDER_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function saveReminders(list) {
    try {
      localStorage.setItem(REMINDER_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function addMonths(date, months) {
    var d = new Date(date.getTime());
    var day = d.getDate();
    d.setMonth(d.getMonth() + months);
    if (d.getDate() < day) d.setDate(0);
    return d;
  }

  function formatDate(iso) {
    var d = new Date(iso + 'T12:00:00');
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function daysUntil(iso) {
    var target = new Date(iso + 'T12:00:00');
    var today = new Date();
    today.setHours(12, 0, 0, 0);
    return Math.round((target - today) / 86400000);
  }

  function renderReminders() {
    var listEl = document.getElementById('reminder-list');
    if (!listEl) return;
    var items = loadReminders();
    if (!items.length) {
      listEl.innerHTML = '<p class="tool-empty">No reminders yet. Add your next service below.</p>';
      return;
    }
    listEl.innerHTML = items
      .map(function (item, index) {
        var due = daysUntil(item.nextDate);
        var status =
          due < 0
            ? '<span class="tool-badge overdue">Overdue by ' + Math.abs(due) + ' days</span>'
            : due === 0
              ? '<span class="tool-badge due-soon">Due today</span>'
              : due <= 14
                ? '<span class="tool-badge due-soon">Due in ' + due + ' days</span>'
                : '<span class="tool-badge ok">Due in ' + due + ' days</span>';
        return (
          '<div class="reminder-item" data-index="' +
          index +
          '">' +
          '<div class="reminder-main">' +
          '<strong>' +
          escapeHtml(item.vehicle || 'Vehicle') +
          '</strong>' +
          '<p>' +
          escapeHtml(item.service || 'Service') +
          ' · next due ' +
          formatDate(item.nextDate) +
          (item.intervalKm ? ' or every ' + item.intervalKm + ' km' : '') +
          '</p>' +
          status +
          '</div>' +
          '<button type="button" class="btn ghost reminder-delete" data-index="' +
          index +
          '">Remove</button>' +
          '</div>'
        );
      })
      .join('');
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function bindMaintenance() {
    var form = document.getElementById('maintenance-form');
    var listEl = document.getElementById('reminder-list');
    if (!form || !listEl) return;

    renderReminders();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var vehicle = (form.elements.vehicle.value || '').trim();
      var service = (form.elements.service.value || '').trim();
      var lastDate = form.elements.lastDate.value;
      var months = num(form.elements.months);
      var intervalKm = num(form.elements.intervalKm);
      if (!vehicle || !service || !lastDate || !(months >= 1)) {
        setText('maintenance-error', 'Add vehicle name, service type, last service date, and interval in months.');
        showResult('maintenance-error', true);
        return;
      }
      showResult('maintenance-error', false);
      var next = addMonths(new Date(lastDate + 'T12:00:00'), Math.round(months));
      var nextIso = next.toISOString().slice(0, 10);
      var items = loadReminders();
      items.unshift({
        vehicle: vehicle,
        service: service,
        lastDate: lastDate,
        nextDate: nextIso,
        months: Math.round(months),
        intervalKm: intervalKm > 0 ? Math.round(intervalKm) : null,
        createdAt: Date.now()
      });
      saveReminders(items.slice(0, 20));
      form.reset();
      renderReminders();
    });

    listEl.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('.reminder-delete') : null;
      if (!btn) return;
      var index = parseInt(btn.getAttribute('data-index'), 10);
      if (isNaN(index)) return;
      var items = loadReminders();
      items.splice(index, 1);
      saveReminders(items);
      renderReminders();
    });
  }

  function bindPlateGuide() {
    var form = document.getElementById('plate-lookup-form');
    if (!form) return;
    var codes = {
      LEA: 'Lahore (Punjab)',
      LEB: 'Lahore (Punjab)',
      LEC: 'Lahore (Punjab)',
      LED: 'Lahore (Punjab)',
      LEE: 'Lahore (Punjab)',
      RIA: 'Rawalpindi (Punjab)',
      RIB: 'Rawalpindi (Punjab)',
      RIC: 'Rawalpindi (Punjab)',
      FDA: 'Faisalabad (Punjab)',
      FDB: 'Faisalabad (Punjab)',
      FDC: 'Faisalabad (Punjab)',
      GAA: 'Gujranwala (Punjab)',
      GAB: 'Gujranwala (Punjab)',
      MNA: 'Multan (Punjab)',
      MNB: 'Multan (Punjab)',
      BAA: 'Bahawalpur (Punjab)',
      SAA: 'Sahiwal (Punjab)',
      SGA: 'Sargodha (Punjab)',
      KAA: 'Karachi (Sindh)',
      KAB: 'Karachi (Sindh)',
      KAC: 'Karachi (Sindh)',
      KAD: 'Karachi (Sindh)',
      HYA: 'Hyderabad (Sindh)',
      SKA: 'Sukkur (Sindh)',
      PSA: 'Peshawar (KPK)',
      PSB: 'Peshawar (KPK)',
      ABA: 'Abbottabad (KPK)',
      MAA: 'Mardan (KPK)',
      ISA: 'Islamabad (ICT)',
      ISB: 'Islamabad (ICT)',
      ISC: 'Islamabad (ICT)',
      QAA: 'Quetta (Balochistan)',
      GLA: 'Gilgit (GB)'
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var raw = (form.elements.plate.value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (raw.length < 3) {
        showResult('plate-result', false);
        setText('plate-error', 'Enter at least the letter code from the plate (for example LEA or KAA).');
        showResult('plate-error', true);
        return;
      }
      showResult('plate-error', false);
      var letters = (raw.match(/^[A-Z]+/) || [''])[0];
      var prefix3 = letters.slice(0, 3);
      var prefix2 = letters.slice(0, 2);
      var match = codes[prefix3] || codes[prefix2] || null;
      var formatHint =
        raw.length >= 6
          ? 'Looks like a modern letter + number plate. Confirm the full record on the official Excise portal for that province.'
          : 'Letter codes usually point to the issuing city/region. Full ownership still requires an official verification check.';
      setText('plate-code', prefix3 || letters);
      setText(
        'plate-region',
        match ||
          'Code not in this quick list — check the province guide tables below, then verify on the official portal.'
      );
      setText('plate-hint', formatHint);
      showResult('plate-result', true);
    });
  }

  function bindEngineTax() {
    var form = document.getElementById('engine-tax-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var cc = num(form.elements.cc);
      var type = (form.elements.vehicleType.value || 'car').toLowerCase();
      if (!(cc > 0)) {
        showResult('engine-tax-result', false);
        setText('engine-tax-error', 'Enter engine size in cc (for example 1300).');
        showResult('engine-tax-error', true);
        return;
      }
      showResult('engine-tax-error', false);

      var band;
      var note;
      if (type === 'bike') {
        if (cc <= 70) band = 'Up to 70cc motorcycle';
        else if (cc <= 125) band = '71–125cc motorcycle';
        else if (cc <= 150) band = '126–150cc motorcycle';
        else band = 'Above 150cc motorcycle';
        note =
          'Many motorcycles have lifetime token treatment at first registration in some provinces, but other fees and dues can still apply. Always confirm on the official Excise / e-Pay portal.';
      } else {
        if (cc <= 1000) band = 'Up to 1000cc car / jeep';
        else if (cc <= 1300) band = '1001–1300cc';
        else if (cc <= 1500) band = '1301–1500cc';
        else if (cc <= 2000) band = '1501–2000cc';
        else if (cc <= 2500) band = '2001–2500cc';
        else band = 'Above 2500cc';
        note =
          'Token / motor vehicle tax usually rises with engine capacity and vehicle type. Rates and rebates change by province and year — use this only as a band finder, then check the official schedule.';
      }

      setText('engine-band', band);
      setText('engine-note', note);
      showResult('engine-tax-result', true);
    });
  }

  var EXPENSE_KEY = 'vhpk-vehicle-expenses';
  var DOCUMENT_KEY = 'vhpk-document-reminders';

  var CATEGORY_LABELS = {
    fuel: 'Fuel',
    oil: 'Oil change',
    tyres: 'Tyre replacement',
    service: 'Service / repair',
    other: 'Other'
  };

  var DOC_LABELS = {
    registration: 'Registration expiry',
    token: 'Token tax due',
    licence: 'Driving licence expiry',
    insurance: 'Insurance expiry',
    other: 'Other document'
  };

  function loadJson(key) {
    try {
      var raw = localStorage.getItem(key);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function saveJson(key, list) {
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {}
  }

  function startOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  function startOfYear(d) {
    return new Date(d.getFullYear(), 0, 1);
  }

  function parseDay(iso) {
    return new Date(iso + 'T12:00:00');
  }

  function bindExpenses() {
    var form = document.getElementById('expense-form');
    var listEl = document.getElementById('expense-list');
    if (!form || !listEl) return;

    var filterVehicle = document.getElementById('filterVehicle');
    var filterCategory = document.getElementById('filterCategory');
    var dateInput = form.elements.date;
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().slice(0, 10);
    }

    function vehicles() {
      var set = {};
      loadJson(EXPENSE_KEY).forEach(function (item) {
        if (item.vehicle) set[item.vehicle] = true;
      });
      return Object.keys(set).sort();
    }

    function fillVehicleOptions() {
      var names = vehicles();
      var datalist = document.getElementById('expense-vehicles');
      if (datalist) {
        datalist.innerHTML = names
          .map(function (n) {
            return '<option value="' + escapeHtml(n) + '"></option>';
          })
          .join('');
      }
      if (filterVehicle) {
        var current = filterVehicle.value;
        filterVehicle.innerHTML =
          '<option value="">All vehicles</option>' +
          names
            .map(function (n) {
              return (
                '<option value="' +
                escapeHtml(n) +
                '"' +
                (n === current ? ' selected' : '') +
                '>' +
                escapeHtml(n) +
                '</option>'
              );
            })
            .join('');
      }
    }

    function filtered() {
      var items = loadJson(EXPENSE_KEY);
      var v = filterVehicle ? filterVehicle.value : '';
      var c = filterCategory ? filterCategory.value : '';
      return items.filter(function (item) {
        if (v && item.vehicle !== v) return false;
        if (c && item.category !== c) return false;
        return true;
      });
    }

    function renderSummary(items) {
      var now = new Date();
      var monthStart = startOfMonth(now);
      var yearStart = startOfYear(now);
      var monthTotal = 0;
      var yearTotal = 0;
      var odoReads = [];
      items.forEach(function (item) {
        var day = parseDay(item.date);
        if (isNaN(day.getTime())) return;
        if (day >= monthStart) monthTotal += item.amount;
        if (day >= yearStart) yearTotal += item.amount;
        if (item.odometer != null && isFinite(item.odometer)) {
          odoReads.push({ odo: item.odometer, amount: item.amount, date: item.date });
        }
      });
      setText('expense-month', money(monthTotal));
      setText('expense-year', money(yearTotal));

      var perKm = '—';
      if (odoReads.length >= 2) {
        odoReads.sort(function (a, b) {
          return a.odo - b.odo;
        });
        var minO = odoReads[0].odo;
        var maxO = odoReads[odoReads.length - 1].odo;
        var km = maxO - minO;
        if (km > 0) {
          var firstDate = odoReads[0].date;
          var lastDate = odoReads[odoReads.length - 1].date;
          if (firstDate > lastDate) {
            var tmp = firstDate;
            firstDate = lastDate;
            lastDate = tmp;
          }
          var rangedTotal = 0;
          items.forEach(function (item) {
            if (item.date >= firstDate && item.date <= lastDate) rangedTotal += item.amount;
          });
          perKm = money(rangedTotal / km) + ' / km';
        }
      }
      setText('expense-per-km', perKm);

      var label = 'Showing all vehicles';
      if (filterVehicle && filterVehicle.value) label = 'Showing ' + filterVehicle.value;
      if (filterCategory && filterCategory.value) {
        label +=
          ' · ' + (CATEGORY_LABELS[filterCategory.value] || filterCategory.value);
      }
      setText('expense-filter-label', label);
    }

    function renderList() {
      fillVehicleOptions();
      var items = filtered().slice().sort(function (a, b) {
        return (b.date || '').localeCompare(a.date || '');
      });
      renderSummary(filtered());

      if (!items.length) {
        listEl.innerHTML =
          '<p class="tool-empty">No expenses yet. Add fuel or service costs above.</p>';
        return;
      }
      listEl.innerHTML = items
        .slice(0, 40)
        .map(function (item) {
          // find real index in full store for delete
          var all = loadJson(EXPENSE_KEY);
          var realIndex = all.findIndex(function (row) {
            return (
              row.createdAt === item.createdAt &&
              row.date === item.date &&
              row.amount === item.amount &&
              row.vehicle === item.vehicle
            );
          });
          return (
            '<div class="reminder-item">' +
            '<div class="reminder-main">' +
            '<strong>' +
            escapeHtml(item.vehicle) +
            ' · ' +
            escapeHtml(CATEGORY_LABELS[item.category] || item.category) +
            '</strong>' +
            '<p>' +
            money(item.amount) +
            ' · ' +
            formatDate(item.date) +
            (item.odometer != null ? ' · ' + item.odometer + ' km' : '') +
            (item.note ? ' · ' + escapeHtml(item.note) : '') +
            '</p>' +
            '</div>' +
            '<button type="button" class="btn ghost expense-delete" data-index="' +
            realIndex +
            '">Remove</button>' +
            '</div>'
          );
        })
        .join('');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var vehicle = (form.elements.vehicle.value || '').trim();
      var category = form.elements.category.value;
      var amount = num(form.elements.amount);
      var date = form.elements.date.value;
      var odometer = num(form.elements.odometer);
      var note = (form.elements.note.value || '').trim();
      if (!vehicle || !(amount > 0) || !date) {
        setText('expense-error', 'Add vehicle, amount, and date.');
        showResult('expense-error', true);
        return;
      }
      showResult('expense-error', false);
      var items = loadJson(EXPENSE_KEY);
      items.unshift({
        vehicle: vehicle,
        category: category,
        amount: Math.round(amount),
        date: date,
        odometer: odometer > 0 ? Math.round(odometer) : null,
        note: note,
        createdAt: Date.now()
      });
      saveJson(EXPENSE_KEY, items.slice(0, 300));
      form.reset();
      if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
      form.elements.category.value = 'fuel';
      renderList();
    });

    listEl.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('.expense-delete') : null;
      if (!btn) return;
      var index = parseInt(btn.getAttribute('data-index'), 10);
      if (isNaN(index) || index < 0) return;
      var items = loadJson(EXPENSE_KEY);
      items.splice(index, 1);
      saveJson(EXPENSE_KEY, items);
      renderList();
    });

    if (filterVehicle) filterVehicle.addEventListener('change', renderList);
    if (filterCategory) filterCategory.addEventListener('change', renderList);
    renderList();
  }

  function bindDocuments() {
    var form = document.getElementById('document-form');
    var listEl = document.getElementById('document-list');
    if (!form || !listEl) return;

    function renderDocs() {
      var items = loadJson(DOCUMENT_KEY)
        .slice()
        .sort(function (a, b) {
          return (a.dueDate || '').localeCompare(b.dueDate || '');
        });
      if (!items.length) {
        listEl.innerHTML =
          '<p class="tool-empty">No document dates yet. Add registration, token tax, or licence expiry below.</p>';
        return;
      }
      listEl.innerHTML = items
        .map(function (item, index) {
          var due = daysUntil(item.dueDate);
          var remind = item.remindDays || 30;
          var status;
          if (due < 0) {
            status =
              '<span class="tool-badge overdue">Expired ' +
              Math.abs(due) +
              ' days ago</span>';
          } else if (due === 0) {
            status = '<span class="tool-badge overdue">Due today</span>';
          } else if (due <= remind) {
            status =
              '<span class="tool-badge due-soon">Due in ' + due + ' days</span>';
          } else {
            status =
              '<span class="tool-badge ok">Due in ' + due + ' days</span>';
          }
          return (
            '<div class="reminder-item">' +
            '<div class="reminder-main">' +
            '<strong>' +
            escapeHtml(item.vehicle) +
            ' · ' +
            escapeHtml(DOC_LABELS[item.docType] || item.docType) +
            '</strong>' +
            '<p>Due ' +
            formatDate(item.dueDate) +
            ' · remind ' +
            remind +
            ' days before' +
            (item.note ? ' · ' + escapeHtml(item.note) : '') +
            '</p>' +
            status +
            '</div>' +
            '<button type="button" class="btn ghost document-delete" data-index="' +
            index +
            '">Remove</button>' +
            '</div>'
          );
        })
        .join('');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var vehicle = (form.elements.vehicle.value || '').trim();
      var docType = form.elements.docType.value;
      var dueDate = form.elements.dueDate.value;
      var remindDays = num(form.elements.remindDays);
      var note = (form.elements.note.value || '').trim();
      if (!vehicle || !dueDate || !(remindDays >= 1)) {
        setText('document-error', 'Add a name, document type, due date, and remind-days value.');
        showResult('document-error', true);
        return;
      }
      showResult('document-error', false);
      var items = loadJson(DOCUMENT_KEY);
      items.push({
        vehicle: vehicle,
        docType: docType,
        dueDate: dueDate,
        remindDays: Math.round(remindDays),
        note: note,
        createdAt: Date.now()
      });
      items.sort(function (a, b) {
        return (a.dueDate || '').localeCompare(b.dueDate || '');
      });
      saveJson(DOCUMENT_KEY, items.slice(0, 80));
      form.reset();
      form.elements.remindDays.value = '30';
      form.elements.docType.value = 'registration';
      renderDocs();
    });

    listEl.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('.document-delete') : null;
      if (!btn) return;
      var index = parseInt(btn.getAttribute('data-index'), 10);
      if (isNaN(index)) return;
      var items = loadJson(DOCUMENT_KEY)
        .slice()
        .sort(function (a, b) {
          return (a.dueDate || '').localeCompare(b.dueDate || '');
        });
      items.splice(index, 1);
      saveJson(DOCUMENT_KEY, items);
      renderDocs();
    });

    renderDocs();
  }

  function bindFinance() {
    var form = document.getElementById('finance-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var price = num(form.elements.price);
      var down = num(form.elements.down);
      var years = num(form.elements.years);
      var rate = num(form.elements.rate);
      if (!(price > 0) || !(years > 0) || !(rate >= 0)) {
        showResult('finance-result', false);
        setText('finance-error', 'Enter vehicle price, tenure, and interest rate.');
        showResult('finance-error', true);
        return;
      }
      if (!isFinite(down) || down < 0) down = 0;
      if (down >= price) {
        showResult('finance-result', false);
        setText('finance-error', 'Down payment must be less than vehicle price.');
        showResult('finance-error', true);
        return;
      }
      showResult('finance-error', false);
      var principal = price - down;
      var months = Math.round(years * 12);
      var r = rate / 100 / 12;
      var emi;
      if (r === 0) emi = principal / months;
      else {
        var pow = Math.pow(1 + r, months);
        emi = (principal * r * pow) / (pow - 1);
      }
      var total = emi * months;
      var interest = total - principal;
      setText('finance-principal', money(principal));
      setText('finance-emi', money(emi));
      setText('finance-interest', money(interest));
      setText('finance-total', money(total));
      showResult('finance-result', true);
    });
  }

  function bindToll() {
    var form = document.getElementById('toll-form');
    if (!form) return;
    // Approximate one-way class-1 car tolls (PKR) — educational estimates.
    var routes = {
      'm1-isb-psh': { name: 'M-1 Islamabad ↔ Peshawar', toll: 650 },
      'm2-lhr-isb': { name: 'M-2 Lahore ↔ Islamabad', toll: 1450 },
      'm3-lhr-abd': { name: 'M-3 Lahore ↔ Abdul Hakeem', toll: 700 },
      'm4-pnv-mtn': { name: 'M-4 Pindi Bhattian ↔ Multan', toll: 950 },
      'm5-mtn-suk': { name: 'M-5 Multan ↔ Sukkur', toll: 1800 },
      'm9-khi-hdr': { name: 'M-9 Karachi ↔ Hyderabad', toll: 350 },
      'sialkot-lhr': { name: 'Sialkot–Lahore Motorway', toll: 450 }
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var route = form.elements.route.value;
      var trips = num(form.elements.trips);
      var vehicle = form.elements.vehicleClass.value;
      if (!routes[route] || !(trips >= 1)) {
        showResult('toll-result', false);
        setText('toll-error', 'Choose a route and number of one-way trips.');
        showResult('toll-error', true);
        return;
      }
      showResult('toll-error', false);
      var base = routes[route].toll;
      var mult = vehicle === 'car' ? 1 : vehicle === 'wagon' ? 1.4 : 2.2;
      var oneWay = Math.round(base * mult);
      var total = oneWay * trips;
      setText('toll-route', routes[route].name);
      setText('toll-oneway', money(oneWay));
      setText('toll-total', money(total));
      setText(
        'toll-note',
        'Estimate only — live M-Tag / NHA rates change. Confirm on the official motorway app or plaza boards before travel.'
      );
      showResult('toll-result', true);
    });
  }

  function bindUsedCar() {
    var form = document.getElementById('used-car-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var newPrice = num(form.elements.newPrice);
      var year = num(form.elements.year);
      var km = num(form.elements.km);
      var condition = form.elements.condition.value;
      var nowYear = new Date().getFullYear();
      if (!(newPrice > 0) || !(year >= 1990) || year > nowYear || !(km >= 0)) {
        showResult('used-car-result', false);
        setText('used-car-error', 'Enter a valid new-price reference, model year, and odometer km.');
        showResult('used-car-error', true);
        return;
      }
      showResult('used-car-error', false);
      var age = Math.max(0, nowYear - year);
      // Rough Pakistan used-market curve: steeper early drop, then slower.
      var ageFactor = Math.pow(0.88, Math.min(age, 12)) * Math.pow(0.95, Math.max(0, age - 12));
      var kmPenalty = Math.min(0.35, (km / 20000) * 0.02);
      var cond =
        condition === 'excellent' ? 1.05 : condition === 'good' ? 1 : condition === 'average' ? 0.92 : 0.8;
      var estimate = newPrice * ageFactor * (1 - kmPenalty) * cond;
      var low = estimate * 0.92;
      var high = estimate * 1.08;
      setText('used-car-mid', money(estimate));
      setText('used-car-range', money(low) + ' – ' + money(high));
      setText(
        'used-car-note',
        'Ballpark only for planning. Local demand, accident history, import vs local, and city premiums matter — verify on Excise and inspect in person.'
      );
      showResult('used-car-result', true);
    });
  }

  function bindChecklist() {
    var root = document.getElementById('buyer-checklist');
    if (!root) return;
    var KEY = 'vhpk-buyer-checklist';
    var boxes = root.querySelectorAll('input[type="checkbox"][data-check]');
    function save() {
      var state = {};
      boxes.forEach(function (box) {
        state[box.getAttribute('data-check')] = !!box.checked;
      });
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch (e) {}
      var done = 0;
      boxes.forEach(function (b) {
        if (b.checked) done++;
      });
      setText('checklist-progress', done + ' / ' + boxes.length + ' checks complete');
      var bar = document.getElementById('checklist-bar');
      if (bar) bar.style.width = Math.round((done / boxes.length) * 100) + '%';
    }
    try {
      var saved = JSON.parse(localStorage.getItem(KEY) || '{}');
      boxes.forEach(function (box) {
        var id = box.getAttribute('data-check');
        if (saved[id]) box.checked = true;
        box.addEventListener('change', save);
      });
    } catch (e) {
      boxes.forEach(function (box) {
        box.addEventListener('change', save);
      });
    }
    var reset = document.getElementById('checklist-reset');
    if (reset) {
      reset.addEventListener('click', function () {
        boxes.forEach(function (b) {
          b.checked = false;
        });
        save();
      });
    }
    save();
  }

  function boot() {
    bindFuelCost();
    bindMileage();
    bindTripCost();
    bindMaintenance();
    bindPlateGuide();
    bindEngineTax();
    bindExpenses();
    bindDocuments();
    bindFinance();
    bindToll();
    bindUsedCar();
    bindChecklist();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
