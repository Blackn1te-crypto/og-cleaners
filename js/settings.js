/* ═══════════════════════════════════════════════════════════
   OG — settings.js
   Settings page: themes, backgrounds, custom colors, images,
   welcome, prices, announcements, contact, privacy.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var THEME_KEY = 'og_theme';
  var BG_KEY = 'og_bg';
  var DEFAULT_THEME = 'og-green';
  var IMG_PREFIX = 'og_img_';

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

  /* ─── THEME ─── */
  function applyTheme(theme) {
    if (!theme || theme === DEFAULT_THEME) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    try { localStorage.setItem(THEME_KEY, theme || DEFAULT_THEME); } catch (e) {}
  }
  window.applyTheme = applyTheme;

  /* ─── BACKGROUND ─── */
  function applyBackground(bg) {
    if (!bg || bg === 'default' || bg === 'custom') {
      document.body.removeAttribute('data-bg');
    } else {
      document.body.setAttribute('data-bg', bg);
    }
    try { localStorage.setItem(BG_KEY, bg || 'default'); } catch (e) {}
  }
  window.applyBackground = applyBackground;

  /* ─── SAVE HANDLERS ─── */
  window.saveWelcome = function () {
    var v = (document.getElementById('welcomeInput') || {}).value || '';
    try { localStorage.setItem('og_welcome_message', v.trim()); } catch (e) {}
    toast('Welcome message saved ✓');
  };

  window.savePrices = function () {
    for (var i = 1; i <= 5; i++) {
      var el = document.getElementById('price-' + i);
      if (el && el.value.trim()) {
        try { localStorage.setItem('og_price_hoodie-' + i, el.value.trim()); } catch (e) {}
      }
    }
    toast('Prices saved ✓');
  };

  window.saveAnnounce = function () {
    var txtEl = document.getElementById('announceInput');
    var enEl = document.getElementById('announceEnabled');
    try {
      localStorage.setItem('og_announce_text', txtEl ? txtEl.value.trim() : '');
      localStorage.setItem('og_announce_enabled', (enEl && enEl.checked) ? '1' : '0');
    } catch (e) {}
    toast('Announcement saved ✓');
  };

  window.saveContact = function () {
    var emailEl = document.getElementById('emailInput');
    var waEl = document.getElementById('wa1Input');
    try {
      if (emailEl && emailEl.value.trim()) localStorage.setItem('og_contact_email', emailEl.value.trim());
      if (waEl && waEl.value.trim()) localStorage.setItem('og_contact_wa1', waEl.value.trim());
    } catch (e) {}
    toast('Contact saved ✓');
  };

  window.savePrivacy = function () {
    var el = document.getElementById('privacyInput');
    try { localStorage.setItem('og_privacy_notice', el ? el.value.trim() : ''); } catch (e) {}
    toast('Privacy notice saved ✓');
  };

  window.resetImage = function (key) {
    try { localStorage.removeItem(IMG_PREFIX + key); } catch (e) {}
    location.reload();
  };

  window.resetAllSettings = function () {
    try {
      Object.keys(localStorage).forEach(function (k) {
        if (k.indexOf('og_') === 0) localStorage.removeItem(k);
      });
    } catch (e) {}
    location.reload();
  };

  /* ─── COLOR HELPERS ─── */
  function lighten(hex, amt) { return shiftColor(hex, amt); }
  function darken(hex, amt) { return shiftColor(hex, -amt); }
  function shiftColor(hex, amt) {
    if (!hex) return hex;
    hex = hex.replace('#', '');
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    r = Math.min(255, Math.max(0, r + amt));
    g = Math.min(255, Math.max(0, g + amt));
    b = Math.min(255, Math.max(0, b + amt));
    return '#' + [r, g, b].map(function (v) {
      var h = v.toString(16);
      return h.length === 1 ? '0' + h : h;
    }).join('');
  }

  function applyCustomColors() {
    try {
      var top = localStorage.getItem('og_bg_top');
      var mid = localStorage.getItem('og_bg_mid');
      var bot = localStorage.getItem('og_bg_bot');
      var acc = localStorage.getItem('og_accent');
      var br = localStorage.getItem('og_brand');

      if (top && mid && bot) {
        document.body.style.background =
          'radial-gradient(1200px 800px at 15% 5%, rgba(16,185,129,.14), transparent 60%),' +
          'radial-gradient(1000px 700px at 85% 15%, rgba(245,158,11,.12), transparent 60%),' +
          'linear-gradient(180deg, ' + top + ' 0%, ' + mid + ' 55%, ' + bot + ' 100%)';
        document.body.style.backgroundAttachment = 'fixed';
      }

      if (acc) {
        document.documentElement.style.setProperty('--accent', acc);
        document.documentElement.style.setProperty('--accent-soft', lighten(acc, 20));
        document.documentElement.style.setProperty('--accent-dark', darken(acc, 20));
      }
      if (br) {
        document.documentElement.style.setProperty('--brand', br);
        document.documentElement.style.setProperty('--brand-light', lighten(br, 15));
        document.documentElement.style.setProperty('--brand-dark', darken(br, 25));
      }
    } catch (e) {}
  }

  window.saveCustomColors = function () {
    var top = document.getElementById('bgTopPicker');
    var mid = document.getElementById('bgMidPicker');
    var bot = document.getElementById('bgBotPicker');
    var acc = document.getElementById('accentPicker');
    var br = document.getElementById('brandPicker');

    try {
      if (top) localStorage.setItem('og_bg_top', top.value);
      if (mid) localStorage.setItem('og_bg_mid', mid.value);
      if (bot) localStorage.setItem('og_bg_bot', bot.value);
      if (acc) localStorage.setItem('og_accent', acc.value);
      if (br) localStorage.setItem('og_brand', br.value);
      localStorage.setItem('og_bg', 'custom');
    } catch (e) {}

    document.body.removeAttribute('data-bg');
    applyCustomColors();
    toast('Custom colours saved ✓');
  };

  window.resetCustomColors = function () {
    try {
      ['og_bg_top', 'og_bg_mid', 'og_bg_bot', 'og_accent', 'og_brand', 'og_bg'].forEach(function (k) {
        localStorage.removeItem(k);
      });
    } catch (e) {}
    location.reload();
  };

  /* ─── SETTINGS PAGE INIT ─── */
  document.addEventListener('DOMContentLoaded', function () {
    var wrap = document.querySelector('.settings-wrap');
    if (!wrap) return;

    /* ── ACTIVE THEME ── */
    var currentTheme = 'og-green';
    try { currentTheme = localStorage.getItem(THEME_KEY) || 'og-green'; } catch (e) {}

    document.querySelectorAll('#themeGrid .theme-swatch').forEach(function (btn) {
      if (btn.dataset.theme === currentTheme) btn.classList.add('is-active');
      btn.addEventListener('click', function () {
        document.querySelectorAll('#themeGrid .theme-swatch').forEach(function (b) {
          b.classList.remove('is-active');
        });
        btn.classList.add('is-active');
        applyTheme(btn.dataset.theme);
        toast('Theme applied ✓');
      });
    });

    /* ── ACTIVE BACKGROUND ── */
    var currentBg = 'default';
    try { currentBg = localStorage.getItem(BG_KEY) || 'default'; } catch (e) {}

    document.querySelectorAll('#bgGrid .theme-swatch').forEach(function (btn) {
      if (btn.dataset.bg === currentBg) btn.classList.add('is-active');
      btn.addEventListener('click', function () {
        document.querySelectorAll('#bgGrid .theme-swatch').forEach(function (b) {
          b.classList.remove('is-active');
        });
        btn.classList.add('is-active');
        document.body.style.background = '';
        applyBackground(btn.dataset.bg);
        toast('Background applied ✓');
      });
    });

    /* ── LOAD SAVED TEXT VALUES ── */
    function setVal(id, val) {
      var el = document.getElementById(id);
      if (el) el.value = val || '';
    }
    try {
      setVal('welcomeInput', localStorage.getItem('og_welcome_message'));
      for (var i = 1; i <= 5; i++) {
        setVal('price-' + i, localStorage.getItem('og_price_hoodie-' + i));
      }
      setVal('announceInput', localStorage.getItem('og_announce_text'));
      var eBox = document.getElementById('announceEnabled');
      if (eBox) eBox.checked = localStorage.getItem('og_announce_enabled') === '1';
      setVal('emailInput', localStorage.getItem('og_contact_email') || 'malveensiriya6@gmail.com');
      setVal('wa1Input', localStorage.getItem('og_contact_wa1') || '+263 776 339 527');
      setVal('privacyInput', localStorage.getItem('og_privacy_notice'));
    } catch (e) {}

    /* ── COLOR PICKERS ── */
    var pickers = {
      bgTopPicker: 'og_bg_top',
      bgMidPicker: 'og_bg_mid',
      bgBotPicker: 'og_bg_bot',
      accentPicker: 'og_accent',
      brandPicker: 'og_brand'
    };

    Object.keys(pickers).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      try {
        var saved = localStorage.getItem(pickers[id]);
        if (saved) el.value = saved;
      } catch (e) {}
      var hexLabel = document.getElementById(id.replace('Picker', 'Hex'));
      if (hexLabel) hexLabel.textContent = el.value.toUpperCase();
      el.addEventListener('input', function () {
        if (hexLabel) hexLabel.textContent = el.value.toUpperCase();
      });
    });

    /* ── IMAGE UPLOADS ── */
    document.querySelectorAll('[data-upload-input]').forEach(function (input) {
      input.addEventListener('change', function (e) {
        var file = e.target.files[0];
        if (!file) return;
        var key = input.dataset.uploadInput;
        var reader = new FileReader();
        reader.onload = function (ev) {
          try {
            localStorage.setItem(IMG_PREFIX + key, ev.target.result);
            var preview = document.getElementById('preview-' + key);
            if (preview) preview.src = ev.target.result;
            toast('Image saved ✓');
          } catch (err) {
            alert('Image is too large. Please choose a smaller one.');
          }
        };
        reader.readAsDataURL(file);
      });
    });

    /* ── TAP PREVIEW → OPEN PICKER ── */
    document.querySelectorAll('.upload-preview').forEach(function (box) {
      box.addEventListener('click', function () {
        var key = box.dataset.uploadKey;
        var input = document.querySelector('[data-upload-input="' + key + '"]');
        if (input) input.click();
      });
    });

    /* ── LOAD SAVED PREVIEW IMAGES ── */
    document.querySelectorAll('[data-upload-key]').forEach(function (box) {
      var key = box.dataset.uploadKey;
      try {
        var saved = localStorage.getItem(IMG_PREFIX + key);
        if (saved) {
          var img = box.querySelector('img');
          if (img) img.src = saved;
        }
      } catch (e) {}
    });
  });

})();