/* ═══════════════════════════════════════════════════════════
   OG — inline-editor.js
   Tap any [data-editable] image to change it. Saves to localStorage.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var PREFIX = 'og_img_';

  function applySaved() {
    document.querySelectorAll('[data-editable]').forEach(function (el) {
      var key = el.dataset.editable;
      try {
        var saved = localStorage.getItem(PREFIX + key);
        if (saved && el.tagName === 'IMG') {
          el.src = saved;
          var wrap = el.parentElement;
          if (wrap && wrap.classList.contains('is-placeholder')) {
            wrap.classList.remove('is-placeholder');
          }
        }
      } catch (e) {}
    });
  }

  function wire() {
    document.querySelectorAll('[data-editable]').forEach(function (el) {
      if (el.dataset.wired === '1') return;
      el.dataset.wired = '1';
      el.style.cursor = 'pointer';
      el.title = 'Tap to change image';

      el.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openPicker(el.dataset.editable);
      });
    });
  }

  function openPicker(key) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = function (ev) {
      var file = ev.target.files[0];
      if (!file) return;

      var reader = new FileReader();
      reader.onload = function (r) {
        try {
          localStorage.setItem(PREFIX + key, r.target.result);

          document.querySelectorAll('[data-editable="' + key + '"]').forEach(function (el) {
            if (el.tagName === 'IMG') {
              el.src = r.target.result;
              var w = el.parentElement;
              if (w && w.classList.contains('is-placeholder')) {
                w.classList.remove('is-placeholder');
              }
            }
          });

          if (window.ogToast) window.ogToast('Image saved ✓');
        } catch (err) {
          alert('Image is too large. Please choose a smaller one.');
        }
      };
      reader.readAsDataURL(file);
    };

    input.click();
  }

  document.addEventListener('DOMContentLoaded', function () {
    applySaved();
    wire();
  });

  applySaved();
  wire();

})();