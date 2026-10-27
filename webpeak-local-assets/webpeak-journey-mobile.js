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
  var targetProgress = 0;
  var lastTime = 0;
  var lastActive = -1;
  var lastRendered = -1;
  var layoutWidth = 0;
  var layoutHeight = 0;
  var sectionTail = 0;
  var state = { active: false, progress: 0, returning: false };
  window.webpeakMobileJourney = state;

  function clamp(value) { return Math.max(0, Math.min(1, value)); }

  function render() {
    if (state.progress === lastRendered) return;
    lastRendered = state.progress;
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
      if (active !== lastActive) {
        row.setAttribute('aria-hidden', index === active ? 'false' : 'true');
        row.inert = index !== active;
      }
    });
    if (active !== lastActive) section.dataset.journeyStep = String(active + 1);
    lastActive = active;
    // One animation clock for both the cards and the mountain canvas.
    window.dispatchEvent(new Event('webpeak:journey-progress'));
  }

  function update(time) {
    ticking = false;
    if (!state.active) { lastTime = 0; return; }
    var rect = runway.getBoundingClientRect();
    var raw = clamp((stickyTop - rect.top) / travel);
    // Browser scroll positions are rounded; settle cleanly on the end frames.
    if (raw < .0005) raw = 0;
    if (raw > .9995) raw = 1;
    // Reset only once the entire section is offscreen, never while the last
    // card is still being read. On the return trip keep the first step visible.
    if (rect.bottom + sectionTail <= 0) state.returning = true;
    if (raw === 0) state.returning = false;
    targetProgress = state.returning ? 0 : raw;
    var elapsed = lastTime ? Math.min(64, time - lastTime) : 16.7;
    lastTime = time;
    if (state.returning || reduced.matches) {
      state.progress = targetProgress;
    } else {
      state.progress += (targetProgress - state.progress) * (1 - Math.exp(-elapsed / 65));
      if (Math.abs(targetProgress - state.progress) < .00005) state.progress = targetProgress;
    }
    render();
    if (state.progress !== targetProgress) requestUpdate();
    else lastTime = 0;
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function measure() {
    if (!state.active) return;
    layoutWidth = window.innerWidth;
    if (!layoutHeight) layoutHeight = window.innerHeight;
    var nav = document.querySelector('.navbar_component');
    stickyTop = Math.max(86, nav ? nav.getBoundingClientRect().bottom + 12 : 86);
    var cardHeight = cards.offsetHeight;
    var available = layoutHeight - stickyTop - cardHeight - 32;
    var mountainSize = Math.max(120, Math.min(cards.clientWidth, 380, available));
    scene.style.setProperty('--journey-mountain-size', mountainSize + 'px');
    scene.style.top = stickyTop + 'px';
    // If text scaling makes the scene taller than the screen, let its top scroll
    // naturally before pinning so that every line remains reachable.
    stickyTop = Math.min(stickyTop, layoutHeight - scene.offsetHeight - 16);
    scene.style.top = stickyTop + 'px';
    travel = Math.max(480, layoutHeight * .85) * (rows.length - 1);
    runway.style.height = (scene.offsetHeight + travel) + 'px';
    sectionTail = section.getBoundingClientRect().bottom - runway.getBoundingClientRect().bottom;
    requestUpdate();
  }

  function configure() {
    var enabled = mobile.matches && !reduced.matches;
    if (enabled !== state.active) {
      state.active = enabled;
      state.returning = false;
      state.progress = 0;
      lastRendered = -1;
      lastActive = -1;
      layoutHeight = window.innerHeight;
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
  window.addEventListener('resize', function () {
    // Mobile browser chrome changes innerHeight while scrolling. Keep the
    // scene and its scroll distance stable until a real resize/orientation change.
    if (window.innerWidth !== layoutWidth || Math.abs(window.innerHeight - layoutHeight) > 120) {
      layoutHeight = window.innerHeight;
      measure();
    }
  });
  window.addEventListener('load', measure, { once: true });
  mobile.addEventListener('change', configure);
  reduced.addEventListener('change', configure);
  if (document.fonts) document.fonts.ready.then(measure);
  if (window.ResizeObserver) new ResizeObserver(measure).observe(cards);
})();
