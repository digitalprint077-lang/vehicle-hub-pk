(function () {
  var data = window.PAK_DISTRICTS || [];
  var order = [
    'Punjab',
    'Sindh',
    'Khyber Pakhtunkhwa',
    'Islamabad',
    'Balochistan',
    'Azad Kashmir',
    'Gilgit Baltistan'
  ];
  var portalLabel = {
    'Punjab': 'Punjab Excise',
    'Sindh': 'Sindh Excise',
    'Khyber Pakhtunkhwa': 'KPK Excise',
    'Islamabad': 'Islamabad Excise',
    'Balochistan': 'Balochistan Excise'
  };

  var sectionsEl = document.getElementById('district-sections');
  var searchEl = document.getElementById('district-search');
  var countEl = document.getElementById('district-count');
  if (!sectionsEl) return;

  function byProvince(list) {
    var map = {};
    list.forEach(function (d) {
      (map[d.province] || (map[d.province] = [])).push(d);
    });
    return map;
  }

  function render(filter) {
    var q = (filter || '').trim().toLowerCase();
    var filtered = !q
      ? data
      : data.filter(function (d) {
          return (
            d.name.toLowerCase().indexOf(q) !== -1 ||
            d.code.toLowerCase().indexOf(q) !== -1 ||
            d.province.toLowerCase().indexOf(q) !== -1
          );
        });

    var grouped = byProvince(filtered);
    var html = '';
    var shown = 0;

    order.forEach(function (province) {
      var items = grouped[province] || [];
      if (!items.length) return;
      shown += items.length;
      items.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });

      html += '<section class="district-province" id="districts-' + items[0].provinceSlug + '">';
      html += '<div class="district-province-head">';
      html += '<h2>' + province + '</h2>';
      html += '<span class="district-province-count">' + items.length + ' districts</span>';
      if (items[0].portal) {
        html +=
          '<a class="btn ghost district-portal-link" href="' +
          items[0].portal +
          '">' +
          (portalLabel[province] || 'Open category') +
          '</a>';
      }
      html += '</div>';
      html += '<div class="district-grid">';
      items.forEach(function (d) {
        html += '<article class="district-card">';
        html +=
          '<img class="district-logo" src="' +
          d.logo +
          '" width="56" height="56" alt="' +
          d.name +
          ' district logo" loading="lazy">';
        html += '<div class="district-meta">';
        html += '<strong>' + d.name + '</strong>';
        html += '<span>' + d.code + ' · ' + d.province + '</span>';
        html += '</div></article>';
      });
      html += '</div></section>';
    });

    sectionsEl.innerHTML =
      html ||
      '<p class="district-empty">No districts matched that search.</p>';

    if (countEl) {
      countEl.textContent =
        shown + ' of ' + data.length + ' districts shown';
    }

    if (window.PEI && typeof window.PEI.refreshReveal === 'function') {
      window.PEI.refreshReveal(sectionsEl);
    }
  }

  render('');
  if (searchEl) {
    searchEl.addEventListener('input', function () {
      render(searchEl.value);
    });
  }
})();
