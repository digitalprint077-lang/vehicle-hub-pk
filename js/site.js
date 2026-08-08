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

  function hidePreloader(el, reduce) {
    if (!el || el.classList.contains('is-done')) return;
    el.classList.add('is-done');
    setTimeout(function () {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, reduce ? 0 : 800);
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
      hidePreloader(existing, reduce);
    }
    // Don't wait on remote fonts/images — hide after DOM is ready.
    var wait = reduce ? 0 : 400;
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(hide, wait);
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        setTimeout(hide, wait);
      });
    }
    setTimeout(hide, reduce ? 200 : 1600);
  }

  if (document.body) bootLoader();
  else document.addEventListener('DOMContentLoaded', bootLoader);

  function preferredTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark') return 'dark';
      if (saved === 'light') return 'light';
    } catch (e) {}
    // First visit: day/light mode.
    return 'light';
  }

  function applyTheme(theme) {
    var next = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'dark' ? '#0f1612' : '#038b45');
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.hidden = false;
      btn.removeAttribute('aria-hidden');
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
    btn.hidden = false;
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
    var isLicence =
      /driving-licence\.html$/i.test(window.location.pathname);
    var isTools = /\/tools(\/|$)/i.test(window.location.pathname);
    var isExcise =
      /\/guides\//i.test(window.location.pathname) && !isLicence;

    document
      .querySelectorAll('.nav-desktop a, .mobile-nav a')
      .forEach(function (a) {
        var href = a.getAttribute('href');
        if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(href)) {
          return;
        }
        var linkPath;
        var linkUrl;
        var label = (a.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
        try {
          linkUrl = new URL(a.href, window.location.href);
          linkPath = normalizePath(linkUrl.pathname);
        } catch (e) {
          return;
        }

        var active = false;
        var hrefAttr = (href || '').trim();
        var isHomeLink =
          !!a.querySelector('[data-i18n="home"]') ||
          hrefAttr === './' ||
          hrefAttr === '../' ||
          hrefAttr === '/' ||
          /^(?:\.\.\/)?index\.html$/i.test(hrefAttr);
        // External verify portals can be "/", which must never match Home.
        if (linkUrl.origin !== window.location.origin) {
          active = false;
        } else if (isHomeLink) {
          active = isHome;
        } else if (linkUrl.hash) {
          active =
            current === linkPath &&
            decodeURIComponent(linkUrl.hash) ===
              decodeURIComponent(window.location.hash || '');
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

    document.querySelectorAll('.nav-dropdown').forEach(function (drop) {
      var hasActive = !!drop.querySelector('a.is-active, a[aria-current="page"]');
      var kind = (drop.getAttribute('data-menu') || '').toLowerCase();
      if (!hasActive) {
        if (kind === 'excise' && isExcise) hasActive = true;
        if (kind === 'licence' && isLicence) hasActive = true;
        if (kind === 'tools' && isTools) hasActive = true;
      }
      drop.classList.toggle('has-active', hasActive);
    });
  }

  function bindNavDropdowns() {
    var dropdowns = document.querySelectorAll('.nav-dropdown');
    if (!dropdowns.length) return;

    function closeAll(except) {
      dropdowns.forEach(function (drop) {
        if (except && drop === except) return;
        drop.classList.remove('is-open');
        var btn = drop.querySelector('.nav-drop-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }

    dropdowns.forEach(function (drop) {
      var btn = drop.querySelector('.nav-drop-btn');
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var open = !drop.classList.contains('is-open');
        closeAll(open ? drop : null);
        drop.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    document.addEventListener('click', function (e) {
      if (e.target && e.target.closest && e.target.closest('.nav-dropdown')) return;
      closeAll();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });
  }

  function bindPressFeedback() {
    var selector =
      '.nav-desktop > a, .nav-drop-btn, .nav-drop-menu a, .mobile-nav > a, .mobile-nav .nav-drop-btn, .mobile-nav .nav-drop-menu a, .btn, a.btn, .service-card, .province-card, .category-card, .district-card, .tool-card, .side-panel a, .district-portal-link';
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

  var leaveFailSafeTimer = null;

  function restorePageVisibility() {
    if (!document.body) return;
    document.body.classList.remove('page-leaving');
    document.body.classList.add('page-ready');
    if (leaveFailSafeTimer) {
      clearTimeout(leaveFailSafeTimer);
      leaveFailSafeTimer = null;
    }
  }

  function bindPageTransitions() {
    // Back/forward bfcache can restore a page stuck with blank content under the header.
    window.addEventListener('pageshow', function () {
      restorePageVisibility();
      var stuck = document.getElementById('pei-preloader');
      if (stuck) hidePreloader(stuck, prefersReducedMotion());
    });

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

      var toggle = document.getElementById('nav-toggle');
      var mobile = document.getElementById('mobile-nav');
      if (mobile && mobile.classList.contains('open')) {
        mobile.classList.remove('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }

      document.body.classList.add('page-leaving');
      document.body.classList.remove('page-ready');

      if (leaveFailSafeTimer) clearTimeout(leaveFailSafeTimer);
      leaveFailSafeTimer = setTimeout(function () {
        restorePageVisibility();
      }, 2500);

      window.setTimeout(function () {
        window.location.href = href;
      }, 140);
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
  bindNavDropdowns();
  bindPressFeedback();
  bindPageTransitions();
  decorateNavIcons();

  function decorateNavIcons() {
    var icons = {
      home:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3.2 3 11h2.5v8.5A1.5 1.5 0 0 0 7 21h3.2v-5.2h3.6V21H17a1.5 1.5 0 0 0 1.5-1.5V11H21L12 3.2z"/></svg>',
      excise:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2 3 6v2h18V6L12 2zm-7 8v8H4v2h16v-2h-1v-8h-2v8h-3v-8h-2v8H9v-8H5z"/></svg>',
      licence:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm2 3v2h6V8H5zm0 4v2h4v-2H5zm10-3.5a2.5 2.5 0 1 0 .001 5.001A2.5 2.5 0 0 0 15 8.5z"/></svg>',
      tools:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14.7 4.3a5 5 0 0 0-6.8 6.1L3 15.3 4.4 20l4.8-1.3 4.9-4.9a5 5 0 0 0 5.9-6.7l-3.5 3.5-2.8-2.8 3-3z"/></svg>',
      how:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 4h13v2H7V4zm0 7h13v2H7v-2zm0 7h13v2H7v-2zM3.5 4.5h2v2h-2v-2zm0 7h2v2h-2v-2zm0 7h2v2h-2v-2z"/></svg>',
      about:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm-1 5h2v2h-2V7zm0 4h2v6h-2v-6z"/></svg>',
      contact:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm0 2.4 8.2 5.5a1.5 1.5 0 0 0 1.6 0L21 7.4V7H3v.4z"/></svg>'
    };

    function wrapIcon(el, key) {
      if (!el || el.querySelector('.nav-tab-icon')) return;
      var span = document.createElement('span');
      span.className = 'nav-tab-icon';
      span.setAttribute('aria-hidden', 'true');
      span.innerHTML = icons[key];
      el.insertBefore(span, el.firstChild);
    }

    document.querySelectorAll('.nav-desktop > a, .mobile-nav > a').forEach(function (a) {
      var label = (a.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
      var key = a.getAttribute('data-i18n');
      // data-i18n is on child span often
      var childKey = a.querySelector('[data-i18n]');
      if (childKey) key = childKey.getAttribute('data-i18n');
      if (key === 'home' || label === 'home' || label.indexOf('ہوم') !== -1 || label.indexOf('کور') !== -1) {
        wrapIcon(a, 'home');
      } else if (key === 'how' || label.indexOf('how it works') !== -1) {
        wrapIcon(a, 'how');
      } else if (key === 'about' || label.indexOf('about') !== -1) {
        wrapIcon(a, 'about');
      } else if (key === 'contact' || label.indexOf('contact') !== -1) {
        wrapIcon(a, 'contact');
      }
    });

    document.querySelectorAll('.nav-drop-btn').forEach(function (btn) {
      var menu = (btn.closest('.nav-dropdown') || {}).getAttribute
        ? btn.closest('.nav-dropdown').getAttribute('data-menu')
        : '';
      if (menu === 'excise') wrapIcon(btn, 'excise');
      else if (menu === 'licence') wrapIcon(btn, 'licence');
      else if (menu === 'tools') wrapIcon(btn, 'tools');
    });
  }

  function revealSelector() {
    return [
      '.province-card',
      '.category-card',
      '.service-card',
      '.district-card',
      '.tool-card',
      '.licence-row',
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

  function contactPath() {
    var root = assetRoot();
    return root + 'contact.html#feedback';
  }

  function mountFeedbackFab() {
    if (document.getElementById('vhpk-feedback-fab')) return;
    if (/\/contact\.html$/i.test(window.location.pathname || '')) return;
    var a = document.createElement('a');
    a.id = 'vhpk-feedback-fab';
    a.className = 'feedback-fab';
    a.href = contactPath() + '?from=' + encodeURIComponent(window.location.href);
    a.setAttribute('aria-label', 'Send feedback');
    a.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm2 4v2h12V8H6zm0 4v2h8v-2H6z"/></svg>' +
      '<span>Feedback</span>';
    a.addEventListener('click', function () {
      if (window.VHPK && typeof window.VHPK.track === 'function') {
        window.VHPK.track('feedback_click', { page: window.location.pathname });
      }
    });
    document.body.appendChild(a);
  }

  function bindFeedbackForm() {
    var form = document.getElementById('feedback-form');
    if (!form) return;
    var status = document.getElementById('feedback-status');
    var pageInput = document.getElementById('feedback-page');
    var params;
    try {
      params = new URLSearchParams(window.location.search || '');
    } catch (e) {
      params = null;
    }
    if (pageInput && !pageInput.value) {
      var from = params && params.get('from');
      pageInput.value = from || document.referrer || window.location.href;
    }
    if (params && params.get('type')) {
      var typeEl = document.getElementById('feedback-type');
      if (typeEl) typeEl.value = params.get('type');
    }

    function setStatus(msg, ok) {
      if (!status) return;
      status.hidden = false;
      status.textContent = msg;
      status.classList.toggle('is-ok', !!ok);
      status.classList.toggle('is-err', !ok);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var type = (form.elements.type && form.elements.type.value) || 'other';
      var name = ((form.elements.name && form.elements.name.value) || '').trim();
      var email = ((form.elements.email && form.elements.email.value) || '').trim();
      var page = ((form.elements.page && form.elements.page.value) || '').trim();
      var message = ((form.elements.message && form.elements.message.value) || '').trim();
      if (!message) {
        setStatus('Please write a short message.', false);
        return;
      }

      var subject = '[Vehicle Hub PK] ' + type + (page ? ' — ' + page : '');
      var body =
        'Type: ' +
        type +
        '\nName: ' +
        (name || '—') +
        '\nEmail: ' +
        (email || '—') +
        '\nPage: ' +
        (page || '—') +
        '\n\n' +
        message;

      var to = (
        (form.getAttribute('data-feedback-to') || '') ||
        ((window.SITE_CONFIG && window.SITE_CONFIG.feedbackEmail) || '') ||
        'tigerpaw716@gmail.com'
      ).trim();
      if (window.VHPK && typeof window.VHPK.track === 'function') {
        window.VHPK.track('feedback_submit', { type: type });
      }

      // FormSubmit — no backend required; confirm email once in inbox.
      var endpoint = 'https://formsubmit.co/ajax/' + encodeURIComponent(to);
      setStatus('Sending…', true);
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          _subject: subject,
          name: name || 'Anonymous',
          email: email || 'noreply@vehiclehubpk.com',
          page: page,
          type: type,
          message: message
        })
      })
        .then(function (res) {
          if (!res.ok) throw new Error('send failed');
          setStatus('Thanks — your feedback was sent.', true);
          form.reset();
          if (pageInput) pageInput.value = window.location.href;
        })
        .catch(function () {
          setStatus('Opening your email app to send to ' + to + '…', true);
          window.location.href =
            'mailto:' +
            encodeURIComponent(to) +
            '?subject=' +
            encodeURIComponent(subject) +
            '&body=' +
            encodeURIComponent(body);
        });
    });
  }

  function bootUi() {
    initReveal(document);
    mountFeedbackFab();
    bindFeedbackForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootUi);
  } else {
    bootUi();
  }
})();
