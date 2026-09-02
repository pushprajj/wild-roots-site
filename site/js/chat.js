/* Wild Roots International — tawk.to live chat.
   Set TAWK_PROPERTY_ID and TAWK_WIDGET_ID from the tawk.to dashboard
   (Administration → Channels → Chat Widget → the URL in the embed code:
   https://embed.tawk.to/<PROPERTY_ID>/<WIDGET_ID>). Leave empty to disable.

   tawk's own bubble (greeting popup, quick replies) is hidden; the site
   renders its own quiet launcher that opens the tawk chat window. */
(function () {
  'use strict';
  var TAWK_PROPERTY_ID = '6a908ca9c457f034442a9670';
  var TAWK_WIDGET_ID = '1k12aauaj';
  if (!TAWK_PROPERTY_ID) return;

  var launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'chat-launcher';
  launcher.setAttribute('aria-label', 'Open chat');
  launcher.innerHTML =
    '<span class="chat-launcher__label">Chat with the desk</span>' +
    '<span class="chat-launcher__orb" aria-hidden="true">' +
      '<svg class="chat-launcher__icon" viewBox="0 0 32 32"><circle cx="16" cy="12" r="5.2" fill="#fff"/><path d="M6.5 26c1.1-5 5-7.6 9.5-7.6s8.4 2.6 9.5 7.6c-2.4 1.6-5.7 2.5-9.5 2.5S8.9 27.6 6.5 26z" fill="#fff"/><circle cx="24.5" cy="8.5" r="4.6" fill="#fff" stroke="#00963f" stroke-width="1.4"/><path d="M22.6 8.5h3.8M22.6 10.3h2.4" stroke="#00963f" stroke-width="1.2" stroke-linecap="round"/></svg>' +
      '<span class="chat-launcher__dot"></span>' +
      '<span class="chat-launcher__badge" hidden></span>' +
    '</span>';
  launcher.hidden = true;
  document.body.appendChild(launcher);

  var label = launcher.querySelector('.chat-launcher__label');
  var badge = launcher.querySelector('.chat-launcher__badge');

  function setStatus(status) {
    var online = status === 'online';
    launcher.classList.toggle('is-online', online);
    label.textContent = online ? 'Chat with the desk' : 'Leave a message';
    launcher.setAttribute('aria-label', online ? 'Chat with the desk' : 'Leave a message');
  }

  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();
  window.Tawk_API.onLoad = function () {
    window.Tawk_API.hideWidget();
    setStatus(window.Tawk_API.getStatus());
    launcher.hidden = false;
    // show the label and a gentle pulse for the first few seconds only
    launcher.classList.add('is-fresh');
    setTimeout(function () { launcher.classList.remove('is-fresh'); }, 8000);
  };
  window.Tawk_API.onStatusChange = setStatus;
  window.Tawk_API.onChatMaximized = function () { launcher.hidden = true; };
  window.Tawk_API.onChatMinimized = function () {
    window.Tawk_API.hideWidget();
    launcher.hidden = false;
  };
  // Unread badge only once the visitor has actually started a chat —
  // tawk's automatic greeting would otherwise count as "1 unread".
  var engaged = false;
  try { engaged = sessionStorage.getItem('wr-chat') === '1'; } catch (e) {}
  window.Tawk_API.onUnreadCountChanged = function (n) {
    badge.hidden = !(engaged && n);
    badge.textContent = n;
  };
  launcher.addEventListener('click', function () {
    engaged = true;
    try { sessionStorage.setItem('wr-chat', '1'); } catch (e) {}
    window.Tawk_API.showWidget();
    window.Tawk_API.maximize();
  });

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://embed.tawk.to/' + TAWK_PROPERTY_ID + '/' + TAWK_WIDGET_ID;
  s.charset = 'UTF-8';
  s.setAttribute('crossorigin', '*');
  document.head.appendChild(s);
})();
