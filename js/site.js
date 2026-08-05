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

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function normalizePath(pathname) {
    var path = (pathname || '/').replace(/\\/g, '/');
    try {
      path = decodeURIComponent(path);
    } catch (e) {}
    if (!path || path.charAt(path.length - 1) === '/') path += 'index.html';
    path = path.replace(/\/index\.html$/i, '/');
    if (path.length > 1 && path.charAt(path.length - 1) === '/') {
      path = path.slice(0, -1);
    }
    return path.toLowerCase();
  }

  function markActiveNav() {
    var current = normalizePath(window.location.pathname);
    var isHome = current === '/' || /\/index\.html$/i.test(window.location.pathname);
    var isServicesSection =
      /\/guides\//i.test(window.location.pathname) &&
      !/how-it-works\.html$/i.test(window.location.pathname);

    document
      .querySelectorAll('.nav-desktop a, .mobile-nav a')
      .forEach(function (a) {
        var href = a.getAttribute('href');
        if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(href)) {
          return;
        }
        var linkPath;
        var label = (a.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
        try {
          linkPath = normalizePath(new URL(a.href, window.location.href).pathname);
        } catch (e) {
          return;
        }

        var active = false;
        if (label === 'home') {
          active = isHome;
        } else if (label === 'services') {
          active = current === linkPath || isServicesSection;
        } else {
          active = current === linkPath;
        }

        if (active) {
          a.classList.add('is-active');
          a.setAttribute('aria-current', 'page');
        } else {
          a.classList.remove('is-active');
          a.removeAttribute('aria-current');
        }
      });
  }

  function bindPressFeedback() {
    var selector =
      '.nav-desktop a, .mobile-nav a, .btn, a.btn, .service-card, .province-card, .category-card, .district-card, .side-panel a, .district-portal-link';
    document.addEventListener(
      'pointerdown',
      function (e) {
        var el = e.target && e.target.closest ? e.target.closest(selector) : null;
        if (!el) return;
        el.classList.add('is-pressing');
      },
      { passive: true }
    );
    function clearPress(e) {
      var el = e.target && e.target.closest ? e.target.closest(selector) : null;
      if (el) el.classList.remove('is-pressing');
      document.querySelectorAll('.is-pressing').forEach(function (node) {
        node.classList.remove('is-pressing');
      });
    }
    document.addEventListener('pointerup', clearPress, { passive: true });
    document.addEventListener('pointercancel', clearPress, { passive: true });
    document.addEventListener('pointerleave', clearPress, { passive: true });
  }

  function isInternalNavLink(a) {
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return false;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#') return false;
    if (/^(mailto:|tel:|javascript:)/i.test(href)) return false;
    try {
      var url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return false;
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash
      ) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function bindPageTransitions() {
    if (prefersReducedMotion()) {
      document.body.classList.add('page-ready');
      return;
    }
    requestAnimationFrame(function () {
      document.body.classList.add('page-ready');
    });

    document.addEventListener('click', function (e) {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest ? e.target.closest('a') : null;
      if (!isInternalNavLink(a)) return;

      e.preventDefault();
      var href = a.href;
      document.body.classList.add('page-leaving');
      document.body.classList.remove('page-ready');

      var toggle = document.getElementById('nav-toggle');
      var mobile = document.getElementById('mobile-nav');
      if (mobile && mobile.classList.contains('open')) {
        mobile.classList.remove('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }

      window.setTimeout(function () {
        window.location.href = href;
      }, 220);
    });
  }

  var toggle = document.getElementById('nav-toggle');
  var mobile = document.getElementById('mobile-nav');
  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      var open = mobile.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        // Keep menu open briefly so leave animation can play; page transition closes it.
        if (prefersReducedMotion()) {
          mobile.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  markActiveNav();
  bindPressFeedback();
  bindPageTransitions();

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
