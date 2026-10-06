(function () {
  var sections = document.querySelectorAll("[data-reviews]");
  if (!sections.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  Array.prototype.forEach.call(sections, function (section) {
    var track = section.querySelector("[data-reviews-track]");
    var prev = section.querySelector("[data-reviews-prev]");
    var next = section.querySelector("[data-reviews-next]");
    if (!track || !prev || !next) return;

    function stepWidth() {
      var item = track.querySelector("[data-reviews-item]");
      if (!item) return track.clientWidth * 0.85;
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap) || 0;
      return item.getBoundingClientRect().width + gap;
    }

    function syncControls() {
      var maxScroll = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 1;
      next.disabled = maxScroll <= 1 || track.scrollLeft >= maxScroll - 1;
      // Hide the arrows when every card already fits on screen.
      section.classList.toggle("is-no-overflow", maxScroll <= 1);
    }

    function move(direction) {
      track.scrollBy({
        left: direction * stepWidth(),
        behavior: reduceMotion.matches ? "auto" : "smooth",
      });
    }

    prev.addEventListener("click", function () {
      move(-1);
    });

    next.addEventListener("click", function () {
      move(1);
    });

    track.addEventListener("scroll", syncControls, { passive: true });
    window.addEventListener("resize", syncControls);
    window.addEventListener("load", syncControls);
    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener("change", syncControls);
    }
    syncControls();
  });
})();
