(function () {
  "use strict";

  if (!window.matchMedia("(max-width: 767px)").matches) return;

  document.querySelectorAll(".reference-scroll_section").forEach(function (section) {
    var track = section.querySelector(".reference-scroll_track");
    var previous = section.querySelector("[data-reference-prev]");
    var next = section.querySelector("[data-reference-next]");
    var startX = 0;
    var startY = 0;

    if (!track || !previous || !next) return;

    track.setAttribute("data-reference-loop", "true");
    track.setAttribute("aria-roledescription", "Endlosschleife");
    previous.disabled = false;
    next.disabled = false;
    previous.removeAttribute("aria-disabled");
    next.removeAttribute("aria-disabled");

    track.addEventListener("touchstart", function (event) {
      if (!event.touches || event.touches.length !== 1) return;
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    }, { capture: true, passive: true });

    track.addEventListener("touchend", function (event) {
      if (!event.changedTouches || !event.changedTouches.length) return;

      var deltaX = event.changedTouches[0].clientX - startX;
      var deltaY = event.changedTouches[0].clientY - startY;
      if (Math.abs(deltaX) < 44 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.15) return;

      event.stopImmediatePropagation();
      (deltaX < 0 ? next : previous).click();
    }, { capture: true, passive: true });
  });
})();
