/* ═══════════════════════════════════════════════════════════
   OG — theme.js
   Load in <head> BEFORE CSS. Applies instantly on every page.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var THEME_KEY = 'og_theme';
  var BG_KEY = 'og_bg';
  var DEFAULT_THEME = 'og-green';

  /* ─── THEME ─── */
  function applyTheme(theme) {
    if (!theme || theme === DEFAULT_THEME) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    try { localStorage.setItem(THEME_KEY, theme || DEFAULT_THEME); } catch (e) {}
  }

  /* ─── BACKGROUND PRESET ─── */
  function applyBackground(bg) {
    if (!bg || bg === 'default' || bg === 'custom') {
      document.body.removeAttribute('data-bg');
    } else {
      document.body.setAttribute('data-bg', bg);
    }
    try { localStorage.setItem(BG_KEY, bg || 'default'); } catch (e) {}
  }

  /* ─── CUSTOM COLOURS ─── */
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
      } else {
        document.body.style.background = '';
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

  /* ─── APPLY ON LOAD ─── */
  try {
    applyTheme(localStorage.getItem(THEME_KEY) || DEFAULT_THEME);
  } catch (e) {}

  function applyBodyStuff() {
    try {
      applyBackground(localStorage.getItem(BG_KEY) || 'default');
      applyCustomColors();
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyBodyStuff);
  } else {
    applyBodyStuff();
  }

  /* ─── EXPOSE ─── */
  window.OGTheme = {
    apply: applyTheme,
    applyBackground: applyBackground,
    applyCustomColors: applyCustomColors,
    get: function () { try { return localStorage.getItem(THEME_KEY) || DEFAULT_THEME; } catch (e) { return DEFAULT_THEME; } },
    getBg: function () { try { return localStorage.getItem(BG_KEY) || 'default'; } catch (e) { return 'default'; } },
    lighten: lighten,
    darken: darken
  };

})();