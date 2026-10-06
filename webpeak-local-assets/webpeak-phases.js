(function () {
  var section = document.getElementById('ablauf');
  if (!section) return;
  var tabs = Array.from(section.querySelectorAll('[data-phases-tab]'));
  var panels = Array.from(section.querySelectorAll('[data-phases-panel]'));
  var prev = section.querySelector('[data-phases-prev]');
  var next = section.querySelector('[data-phases-next]');
  var mobile = window.matchMedia('(max-width: 767px)');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var active = 0;
  var start = 0;
  function activate(index, focus, animate) {
    active = Math.max(0, Math.min(tabs.length - 1, index));
    var count = mobile.matches ? 2 : 4;
    if (active < start) start = active;
    if (active >= start + count) start = active - count + 1;
    start = Math.max(0, Math.min(start, tabs.length - count));
    tabs.forEach(function(tab, i) {
      tab.hidden = i < start || i >= start + count;
      tab.classList.toggle('is-active', i === active);
      tab.setAttribute('aria-selected', String(i === active));
      tab.tabIndex = i === active ? 0 : -1;
    });
    panels.forEach(function(panel, i) {
      panel.hidden = i !== active;
      panel.classList.toggle('is-active', i === active);
      panel.classList.remove('is-entering');
      if (i === active && animate && !reduced.matches) {
        void panel.offsetWidth;
        panel.classList.add('is-entering');
      }
    });
    prev.disabled = active === 0;
    next.disabled = active === tabs.length - 1;
    if (focus) tabs[active].focus();
  }
  tabs.forEach(function(tab, i) {
    tab.addEventListener('click', function() { activate(i, false, true); });
    tab.addEventListener('keydown', function(e) {
      var index;
      if (e.key === 'ArrowRight') index = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') index = (i + tabs.length - 1) % tabs.length;
      else if (e.key === 'Home') index = 0;
      else if (e.key === 'End') index = tabs.length - 1;
      else return;
      e.preventDefault();
      activate(index, true, true);
    });
  });
  prev.addEventListener('click', function() { activate(active - 1, false, true); });
  next.addEventListener('click', function() { activate(active + 1, false, true); });
  mobile.addEventListener('change', function() { activate(active, false, false); });
  activate(0, false, false);
})();
