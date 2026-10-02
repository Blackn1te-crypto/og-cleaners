/* ═══════════════════════════════════════════════════════════
   OG — main.js
   Splash, nav, welcome text, prices, announcements.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── SPLASH ─── */
  var splash = document.getElementById('splash');
  var splashMsg = document.getElementById('splashMsg');
  var splashFill = document.getElementById('splashFill');

  if (splash) {
    document.body.classList.add('has-splash');

    var messages = [
      'Waking the OG empire…',
      'Loading cleaners showcase…',
      'Bringing in the hoodies…',
      'Polishing gradients…',
      'Almost ready…'
    ];
    var i = 0;
    var progress = 0;

    var msgTimer = setInterval(function () {
      i = (i + 1) % messages.length;
      if (splashMsg) splashMsg.textContent = messages[i];
    }, 700);

    var progTimer = setInterval(function () {
      progress += 4;
      if (progress > 100) progress = 100;
      if (splashFill) splashFill.style.width = progress + '%';
      if (progress >= 100) clearInterval(progTimer);
    }, 90);

    var hide = function () {
      clearInterval(msgTimer);
      clearInterval(progTimer);
      splash.classList.add('is-hidden');
      document.body.classList.remove('has-splash');
      setTimeout(function () {
        if (splash.parentNode) splash.parentNode.removeChild(splash);
      }, 1000);
    };

    window.addEventListener('load', function () { setTimeout(hide, 3400); });
    setTimeout(function () {
      if (document.body.contains(splash)) hide();
    }, 5000);
  }

  /* ─── MOBILE NAV ─── */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var open = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    mainNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ─── SMOOTH SCROLL ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length > 1) {
        var t = document.querySelector(id);
        if (t) {
          e.preventDefault();
          t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ─── FOOTER YEAR ─── */
  document.querySelectorAll('#year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ─── ANNOUNCEMENT BAR ─── */
  var announceBar = document.getElementById('announceBar');
  var announceText = document.getElementById('announceText');
  if (announceBar && announceText) {
    try {
      var enabled = localStorage.getItem('og_announce_enabled') === '1';
      var text = localStorage.getItem('og_announce_text');
      if (enabled && text) {
        announceText.textContent = text;
        announceBar.hidden = false;
      }
    } catch (e) {}
  }

  /* ─── WELCOME MESSAGE ─── */
  var welcomeMsg = document.getElementById('welcomeMessage');
  if (welcomeMsg) {
    try {
      var saved = localStorage.getItem('og_welcome_message');
      if (saved) welcomeMsg.textContent = saved;
    } catch (e) {}
  }

  /* ─── PRICES ─── */
  function applySavedPrices() {
    document.querySelectorAll('[data-price]').forEach(function (el) {
      var key = el.dataset.price;
      try {
        var saved = localStorage.getItem('og_price_' + key);
        if (saved) el.textContent = saved;
      } catch (e) {}
    });
  }
  applySavedPrices();

  /* ─── TOAST ─── */
  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'og-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () {
      t.style.transition = 'opacity .4s';
      t.style.opacity = '0';
      setTimeout(function () { t.remove(); }, 400);
    }, 2200);
  }
  window.ogToast = toast;

})();