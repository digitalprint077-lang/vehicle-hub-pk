(function () {
  var cfg = window.SITE_ADS || window.PDTG_ADS || { enabled: false };
  if (!cfg.enabled || !cfg.client) return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(cfg.client);
  s.crossOrigin = 'anonymous';
  document.head.appendChild(s);

  function fill(el, slotId) {
    if (!el || !slotId) return;
    el.classList.add('ad-live');
    el.innerHTML =
      '<ins class="adsbygoogle" style="display:block" data-ad-client="' +
      cfg.client +
      '" data-ad-slot="' +
      slotId +
      '" data-ad-format="auto" data-full-width-responsive="true"></ins>';
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  }

  document.querySelectorAll('[data-ad]').forEach(function (el) {
    var key = el.getAttribute('data-ad');
    fill(el, cfg.slots && cfg.slots[key]);
  });
})();
