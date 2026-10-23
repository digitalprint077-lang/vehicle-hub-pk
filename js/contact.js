(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var status = document.getElementById('contact-status');
  var preview = document.getElementById('contact-preview');
  var how = document.getElementById('contact-how');
  var cfg = window.SITE_CONTACT || {};
  var email = String(cfg.email || '').trim();
  var pageInput = form.querySelector('[name="page"]');
  var params = new URLSearchParams(window.location.search);

  if (pageInput && !pageInput.value && params.get('page')) {
    pageInput.value = params.get('page');
  }

  var submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.textContent = email ? 'Email this report' : 'Copy report';
  if (how) {
    how.textContent = email
      ? 'Email this report opens your email app with the correction addressed to the publisher. This website does not store the form.'
      : 'Copy report puts the correction on your clipboard and shows it below. This website does not store the form. Email that text to the person who publishes Vehicle Hub PK.';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;

    var data = new FormData(form);
    var body = [
      'Name: ' + (data.get('name') || ''),
      'Email: ' + (data.get('email') || ''),
      'Page: ' + (data.get('page') || ''),
      '',
      String(data.get('message') || '').trim(),
      '',
      'Official source: ' + (data.get('source') || '')
    ].join('\n');

    if (email) {
      window.location.href =
        'mailto:' +
        email +
        '?subject=' +
        encodeURIComponent('Vehicle Hub PK correction') +
        '&body=' +
        encodeURIComponent(body);
      if (status) {
        status.textContent = 'Your email app should open with this report. Send it from there.';
      }
      return;
    }

    if (preview) {
      preview.hidden = false;
      preview.textContent = body;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(body).then(
        function () {
          if (status) {
            status.textContent = 'Report copied. Paste it into an email to the publisher. Nothing was stored on this site.';
          }
        },
        function () {
          if (status) {
            status.textContent = 'Report ready below. Copy it and email it to the publisher. Nothing was stored on this site.';
          }
        }
      );
    } else if (status) {
      status.textContent = 'Report ready below. Copy it and email it to the publisher. Nothing was stored on this site.';
    }
  });
})();
