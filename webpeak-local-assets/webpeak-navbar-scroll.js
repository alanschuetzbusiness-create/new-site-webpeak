(function () {
  var nav = document.querySelector(".navbar_component");
  if (!nav) return;

  nav.style.removeProperty("width");
  nav.style.removeProperty("height");
  nav.style.removeProperty("will-change");

  var ticking = false;
  var lastState = null;

  function update() {
    var scrolled = window.scrollY > 48;
    if (scrolled !== lastState) {
      nav.classList.toggle("is-scroll-minimized", scrolled);
      lastState = scrolled;
    }
    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
})();
