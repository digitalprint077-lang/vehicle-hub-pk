(function () {
  var THEME_KEY = 'pei-theme';
  var revealObserver = null;

  function assetRoot() {
    try {
      var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].src || '';
        if (src.indexOf('/js/site.js') !== -1 || /js\/site\.js(\?|$)/.test(src)) {
          return src.replace(/js\/site\.js.*$/, '');
        }
      }
    } catch (e) {}
    var path = (window.location.pathname || '').replace(/\\/g, '/');
    if (path.indexOf('/guides/') !== -1) return '../';
    return '';
  }

  function bootLoader() {
    if (!document.body) return;
    var reduce =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var existing = document.getElementById('pei-preloader');
    if (!existing) {
      var root = assetRoot();
      var d = document.createElement('div');
      d.id = 'pei-preloader';
      d.setAttribute('role', 'status');
      d.setAttribute('aria-live', 'polite');
      d.setAttribute('aria-label', 'Loading');
      d.innerHTML =
        '<div class="pei-preloader-doors" aria-hidden="true">' +
          '<div class="door left"></div>' +
          '<div class="door right"></div>' +
        '</div>' +
        '<div class="pei-preloader-core">' +
          '<div class="pei-knocker">' +
            '<div class="ripple"></div>' +
            '<div class="ripple r2"></div>' +
            '<div class="ripple r3"></div>' +
            '<div class="pei-logo-circle">' +
              '<img src="' + root + 'assets/logo.svg" width="52" height="52" alt="">' +
            '</div>' +
          '</div>' +
          '<p class="pei-knock-text">Loading<span>.</span><span>.</span><span>.</span></p>' +
        '</div>';
      document.body.insertBefore(d, document.body.firstChild);
      existing = d;
    }
    function hide() {
      if (!existing || existing.classList.contains('is-done')) return;
      existing.classList.add('is-done');
      setTimeout(function () {
        if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      }, reduce ? 0 : 800);
    }
    var wait = reduce ? 0 : 650;
    if (document.readyState === 'complete') {
      setTimeout(hide, wait);
    } else {
      window.addEventListener('load', function () {
        setTimeout(hide, wait);
      });
    }
    setTimeout(hide, 3500);
  }

  if (document.body) bootLoader();
  else document.addEventListener('DOMContentLoaded', bootLoader);

  function preferredTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark') return 'dark';
    } catch (e) {}
    return 'light';
  }

  function applyTheme(theme) {
    var next = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'dark' ? '#0f1612' : '#038b45');
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
      btn.setAttribute(
        'aria-label',
        next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
      btn.title = next === 'dark' ? 'Light mode' : 'Dark mode';
    });
  }

  function setTheme(theme) {
    applyTheme(theme);
    try {
      localStorage.setItem(THEME_KEY, theme === 'dark' ? 'dark' : 'light');
    } catch (e) {}
  }

  applyTheme(preferredTheme());

  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  });

  var toggle = document.getElementById('nav-toggle');
  var mobile = document.getElementById('mobile-nav');
  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      var open = mobile.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobile.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function revealSelector() {
    return [
      '.province-card',
      '.category-card',
      '.service-card',
      '.district-card',
      '.cta-box',
      '.side-panel',
      '.article > h2',
      '.article > .lead',
      '.category-hero',
      '.district-province'
    ].join(',');
  }

  function prepareReveal(el, index) {
    if (el.classList.contains('reveal')) return;
    el.style.setProperty('--reveal-delay', Math.min(index, 8) * 55 + 'ms');
    el.classList.add('reveal');
  }

  function initReveal(root) {
    var scope = root || document;
    var reduce =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var nodes = scope.querySelectorAll(revealSelector());
    if (!nodes.length) return;

    if (reduce || !('IntersectionObserver' in window)) {
      nodes.forEach(function (el) {
        el.classList.add('reveal', 'is-in');
      });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-in');
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
      );
    }

    var groups = new WeakMap();
    nodes.forEach(function (el) {
      var parent = el.parentElement;
      var index = groups.get(parent) || 0;
      groups.set(parent, index + 1);
      prepareReveal(el, index);
      if (!el.classList.contains('is-in')) {
        revealObserver.observe(el);
      }
    });
  }

  window.PEI = window.PEI || {};
  window.PEI.refreshReveal = function (root) {
    initReveal(root || document);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initReveal(document);
    });
  } else {
    initReveal(document);
  }
})();
