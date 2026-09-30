/* Wild Roots International — shared behaviour (FAQ accordion, enquiry forms) */
(function () {
  'use strict';

  /* -----------------------------------------------------------------------
     Enquiry form submission.
     Set FORM_ENDPOINT to a form backend URL (e.g. Formspree: create a form
     at https://formspree.io and paste its endpoint here) to submit enquiries
     via AJAX. While it is empty, the form falls back to opening the visitor's
     email app with a pre-filled message to CONTACT_EMAIL.
     ----------------------------------------------------------------------- */
  var FORM_ENDPOINT = 'https://wr.corpmos.com/api/enquiry';
  var CONTACT_EMAIL = 'contact@wildrootsint.in';

  document.querySelectorAll('form[data-enquiry]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var button = form.querySelector('button[type="submit"]');
      var note = form.querySelector('[data-form-note]');
      var data = new FormData(form);

      function done() {
        if (button) {
          button.textContent = 'Enquiry sent';
          button.disabled = true;
        }
        if (note) note.textContent = 'Thank you — the desk will reply the same working day.';
      }

      if (FORM_ENDPOINT) {
        if (button) button.textContent = 'Sending…';
        fetch(FORM_ENDPOINT, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' }
        })
          .then(function (res) {
            if (!res.ok) throw new Error('Request failed');
            done();
          })
          .catch(function () {
            // relay unreachable — fall back to the visitor's email app
            if (button) button.textContent = 'Send enquiry';
            if (note) note.textContent = 'Opening your email app — or write to ' + CONTACT_EMAIL + ' directly.';
            mailto();
          });
      }

      function mailto() {
        var lines = [];
        data.forEach(function (value, key) {
          if (String(value).trim()) lines.push(key.charAt(0).toUpperCase() + key.slice(1) + ': ' + value);
        });
        var subject = 'Enquiry — ' + (data.get('name') || 'Wild Roots website');
        window.location.href = 'mailto:' + CONTACT_EMAIL +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(lines.join('\n'));
        done();
      }
      if (!FORM_ENDPOINT) mailto();
    });
  });

  /* -----------------------------------------------------------------------
     Hero journey phases — highlight the label matching the video segment.
     Boundaries sit at the midpoints of the stitched video's crossfades.
     ----------------------------------------------------------------------- */
  var phaseList = document.getElementById('hero-phases');
  var heroVideo = document.querySelector('.hero video');
  if (phaseList && heroVideo) {
    var bounds = [3.8, 7.6, 11.3];
    var items = phaseList.querySelectorAll('li');
    heroVideo.addEventListener('timeupdate', function () {
      var t = heroVideo.currentTime;
      var phase = 0;
      while (phase < bounds.length && t >= bounds[phase]) phase++;
      items.forEach(function (li, i) {
        li.classList.toggle('is-active', i === phase);
      });
    });
  }

  /* -----------------------------------------------------------------------
     Mobile navigation — hamburger toggles the dropdown panel; closes on
     link click, outside click, or Escape.
     ----------------------------------------------------------------------- */
  var headers = Array.prototype.slice.call(document.querySelectorAll('.site-header'));
  function closeAllMenus() {
    headers.forEach(function (header) {
      var nav = header.querySelector('.site-nav');
      var btn = header.querySelector('.nav-toggle');
      if (nav) nav.classList.remove('is-open');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }
  headers.forEach(function (header) {
    var btn = header.querySelector('.nav-toggle');
    var nav = header.querySelector('.site-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', function () {
      var open = nav.classList.contains('is-open');
      closeAllMenus();
      if (!open) {
        nav.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeAllMenus();
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.site-header')) closeAllMenus();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllMenus();
  });

  /* -----------------------------------------------------------------------
     FAQ accordion — single open item, aria-expanded kept in sync.
     ----------------------------------------------------------------------- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq__item'));
  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq__q');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      faqItems.forEach(function (other) {
        other.classList.remove('is-open');
        var b = other.querySelector('.faq__q');
        var s = other.querySelector('.faq__sign');
        if (b) b.setAttribute('aria-expanded', 'false');
        if (s) s.textContent = '+';
      });
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        var sign = item.querySelector('.faq__sign');
        if (sign) sign.textContent = '–';
      }
    });
  });
})();
