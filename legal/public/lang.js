// Language toggle for the legal pages. Both languages ship in the HTML, so
// the page is complete without JavaScript - the Turkish block is visible by
// default and this only swaps which one is shown. That matters because a
// store reviewer or a crawler must be able to read the policy regardless.
(function () {
  var STORAGE_KEY = 'hizli-okuma-legal-lang';

  function apply(lang) {
    document.querySelectorAll('[data-lang-block]').forEach(function (block) {
      block.classList.toggle('active', block.getAttribute('data-lang-block') === lang);
    });
    document.querySelectorAll('.langswitch button').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-lang') === lang));
    });
    document.documentElement.lang = lang;
  }

  var stored;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    stored = null;
  }

  var initial = stored || (navigator.language || '').toLowerCase().indexOf('tr') === 0 ? 'tr' : 'en';
  if (stored === 'tr' || stored === 'en') initial = stored;
  apply(initial);

  document.querySelectorAll('.langswitch button').forEach(function (button) {
    button.addEventListener('click', function () {
      var lang = button.getAttribute('data-lang');
      apply(lang);
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (error) {
        /* storage unavailable - the toggle still works for this page view */
      }
    });
  });
})();
