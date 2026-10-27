(function () {
  var section = document.querySelector('#webpeak-journey');
  if (!section) return;
  var content = section.querySelector('.timeline_content');
  var cards = section.querySelector('.timeline_content-right');
  var mountain = section.querySelector('.webpeak-scroll-video');
  var rows = Array.prototype.slice.call(cards.querySelectorAll('.timeline_row'));
  var mobile = window.matchMedia('(max-width: 767px)');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var cardsHome = document.createComment('Journey cards');
  var mountainHome = document.createComment('Journey mountain');
  cards.before(cardsHome);
  mountain.before(mountainHome);
  var runway = document.createElement('div');
  var scene = document.createElement('div');
  runway.className = 'journey-mobile-runway';
  scene.className = 'journey-mobile-scene';
  runway.appendChild(scene);
  var travel = 1;
  var stickyTop = 90;
  var ticking = false;
  var state = { active: false, progress: 0 };
  window.webpeakMobileJourney = state;

  function clamp(value) { return Math.max(0, Math.min(1, value)); }

  function update() {
    ticking = false;
    if (!state.active) return;
    state.progress = clamp((stickyTop - runway.getBoundingClientRect().top) / travel);
    var position = state.progress * (rows.length - 1);
    var step = Math.floor(position);
    // A reading pause at each step, followed by a reversible sideways wipe.
    var fraction = clamp((position - step - .3) / .6);
    var eased = fraction * fraction * (3 - 2 * fraction);
    var slide = step + eased;
    var active = Math.round(slide);
    rows.forEach(function (row, index) {
      var distance = index - slide;
      row.style.transform = 'translate3d(' + (distance * 108).toFixed(3) + '%,0,0)';
      row.style.opacity = String(1 - Math.min(1, Math.abs(distance)) * .35);
      row.setAttribute('aria-hidden', index === active ? 'false' : 'true');
      row.inert = index !== active;
    });
    section.dataset.journeyStep = String(active + 1);
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function measure() {
    if (!state.active) return;
    var nav = document.querySelector('.navbar_component');
    stickyTop = Math.max(86, nav ? nav.getBoundingClientRect().bottom + 12 : 86);
    var cardHeight = cards.offsetHeight;
    var available = window.innerHeight - stickyTop - cardHeight - 32;
    var mountainSize = Math.max(120, Math.min(cards.clientWidth, 380, available));
    scene.style.setProperty('--journey-mountain-size', mountainSize + 'px');
    scene.style.top = stickyTop + 'px';
    // If text scaling makes the scene taller than the screen, let its top scroll
    // naturally before pinning so that every line remains reachable.
    stickyTop = Math.min(stickyTop, window.innerHeight - scene.offsetHeight - 16);
    scene.style.top = stickyTop + 'px';
    travel = Math.max(480, window.innerHeight * .85) * (rows.length - 1);
    runway.style.height = (scene.offsetHeight + travel) + 'px';
    update();
  }

  function configure() {
    var enabled = mobile.matches && !reduced.matches;
    if (enabled !== state.active) {
      state.active = enabled;
      section.classList.toggle('has-mobile-journey', enabled);
      if (enabled) {
        content.appendChild(runway);
        scene.appendChild(cards);
        scene.appendChild(mountain);
      } else {
        cardsHome.after(cards);
        mountainHome.after(mountain);
        runway.remove();
        rows.forEach(function (row) {
          row.style.removeProperty('transform');
          row.style.removeProperty('opacity');
          row.removeAttribute('aria-hidden');
          row.inert = false;
        });
        delete section.dataset.journeyStep;
      }
    }
    measure();
  }

  configure();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure, { once: true });
  mobile.addEventListener('change', configure);
  reduced.addEventListener('change', configure);
  if (document.fonts) document.fonts.ready.then(measure);
  if (window.ResizeObserver) new ResizeObserver(measure).observe(cards);
})();
