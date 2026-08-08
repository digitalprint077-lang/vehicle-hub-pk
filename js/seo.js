(function () {
  var cfg = window.SITE_CONFIG || {};
  var origin = (cfg.origin || window.location.origin || '').replace(/\/$/, '');
  var siteName = cfg.siteName || 'Vehicle Hub PK';
  if (!origin) return;

  function absUrl(path) {
    if (!path) path = '/';
    if (/^https?:\/\//i.test(path)) return path;
    if (path.charAt(0) !== '/') path = '/' + path;
    return origin + path;
  }

  function ensureMeta(attr, key, content) {
    if (!content) return;
    var sel = attr === 'property' ? 'meta[property="' + key + '"]' : 'meta[name="' + key + '"]';
    var el = document.head.querySelector(sel);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    if (!el.getAttribute('content')) el.setAttribute('content', content);
  }

  function ensureLink(rel, href) {
    if (!href) return;
    var el = document.head.querySelector('link[rel="' + rel + '"]');
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  }

  function injectJsonLd(data) {
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  var path = window.location.pathname || '/';
  if (path.length > 1 && path.slice(-1) === '/') {
    // keep directory URLs as-is
  } else if (path === '') {
    path = '/';
  }
  var pageUrl = absUrl(path === '/' ? '/' : path);
  var title = (document.title || siteName).trim();
  var descEl = document.head.querySelector('meta[name="description"]');
  var description = descEl ? (descEl.getAttribute('content') || '').trim() : '';
  var image = absUrl('/assets/logo-192.png');

  ensureLink('canonical', pageUrl);
  ensureMeta('property', 'og:type', path === '/' ? 'website' : 'article');
  ensureMeta('property', 'og:site_name', siteName);
  ensureMeta('property', 'og:title', title);
  ensureMeta('property', 'og:description', description);
  ensureMeta('property', 'og:url', pageUrl);
  ensureMeta('property', 'og:image', image);
  ensureMeta('name', 'twitter:card', 'summary');
  ensureMeta('name', 'twitter:title', title);
  ensureMeta('name', 'twitter:description', description);
  ensureMeta('name', 'twitter:image', image);

  var org = {
    '@type': 'Organization',
    name: siteName,
    url: absUrl('/'),
    logo: absUrl('/assets/logo-192.png'),
    description:
      "Pakistan's vehicle services hub — Excise guides, licence portals, and free vehicle tools."
  };

  if (path === '/' || path === '/index.html') {
    injectJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        org,
        {
          '@type': 'WebSite',
          name: siteName,
          url: absUrl('/'),
          description: description || org.description,
          publisher: org,
          inLanguage: ['en', 'ur']
        },
        {
          '@type': 'ItemList',
          name: 'Free vehicle tools',
          itemListElement: [
            'fuel-cost',
            'mileage',
            'trip-cost',
            'car-finance',
            'motorway-toll',
            'used-car-value',
            'buyer-checklist',
            'document-reminder',
            'expenses',
            'number-plate-guide',
            'engine-tax-guide',
            'maintenance-reminder'
          ].map(function (slug, i) {
            return {
              '@type': 'ListItem',
              position: i + 1,
              url: absUrl('/tools/' + slug + '.html')
            };
          })
        }
      ]
    });
  } else if (path.indexOf('/tools/') !== -1 && !/\/tools\/?$/.test(path) && path.indexOf('index.html') === -1) {
    injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: title.replace(/\s*\|\s*Vehicle Hub PK\s*$/, ''),
      url: pageUrl,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'PKR' },
      description: description,
      publisher: org
    });
  } else {
    injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      url: pageUrl,
      description: description,
      isPartOf: { '@type': 'WebSite', name: siteName, url: absUrl('/') },
      publisher: org
    });
  }
})();
