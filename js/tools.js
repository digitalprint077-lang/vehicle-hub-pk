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

  function boot() {
    bindFuelCost();
    bindMileage();
    bindTripCost();
    bindMaintenance();
    bindPlateGuide();
    bindEngineTax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
