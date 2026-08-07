(function () {
  var cfg = (window.SITE_CONFIG && window.SITE_CONFIG.analytics) || {};
  var cfToken = (cfg.cloudflareToken || '').trim();
  var ga4Id = (cfg.ga4Id || '').trim();

  if (cfToken) {
    var cf = document.createElement('script');
    cf.defer = true;
    cf.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    cf.setAttribute('data-cf-beacon', JSON.stringify({ token: cfToken }));
    document.head.appendChild(cf);
  }

  if (ga4Id) {
    var gtagJs = document.createElement('script');
    gtagJs.async = true;
    gtagJs.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga4Id);
    document.head.appendChild(gtagJs);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', ga4Id, { anonymize_ip: true });
  }

  window.VHPK = window.VHPK || {};
  window.VHPK.track = function (name, params) {
    try {
      if (typeof window.gtag === 'function' && ga4Id) {
        window.gtag('event', name, params || {});
      }
    } catch (e) {}
  };
})();
