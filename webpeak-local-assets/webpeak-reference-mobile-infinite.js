(function () {
  "use strict";

  if (!window.matchMedia("(max-width: 767px)").matches) return;

  var positionClasses = [
    "is-active",
    "is-prev",
    "is-next",
    "is-far-prev",
    "is-far-next",
    "is-hidden-left",
    "is-hidden-right"
  ];

  document.querySelectorAll(".reference-scroll_section").forEach(function (section) {
    var track = section.querySelector(".reference-scroll_track");
    var previous = section.querySelector("[data-reference-prev]");
    var next = section.querySelector("[data-reference-next]");
    var cards = track ? Array.prototype.slice.call(track.querySelectorAll(".reference-scroll_card")) : [];
    var activeIndex = cards.findIndex(function (card) {
      return card.classList.contains("is-active");
    });
    var startX = 0;
    var startY = 0;

    if (!track || !previous || !next || !cards.length) return;
    if (activeIndex < 0) activeIndex = 0;

    function normalizeIndex(index) {
      return ((index % cards.length) + cards.length) % cards.length;
    }

    function getPosition(cardIndex, index) {
      var diff = (cardIndex - index + cards.length) % cards.length;
      if (diff > Math.floor(cards.length / 2)) diff -= cards.length;
      if (diff === 0) return "is-active";
      if (diff === -1) return "is-prev";
      if (diff === 1) return "is-next";
      if (diff === -2) return "is-far-prev";
      if (diff === 2) return "is-far-next";
      return diff < -2 ? "is-hidden-left" : "is-hidden-right";
    }

    function crossesLoopSeam(oldPosition, newPosition) {
      return (
        (oldPosition === "is-far-prev" && newPosition === "is-far-next") ||
        (oldPosition === "is-far-next" && newPosition === "is-far-prev") ||
        (oldPosition === "is-hidden-left" && newPosition === "is-hidden-right") ||
        (oldPosition === "is-hidden-right" && newPosition === "is-hidden-left")
      );
    }

    function focusCard(index) {
      var newIndex = normalizeIndex(index);

      cards.forEach(function (card, cardIndex) {
        var oldPosition = positionClasses.find(function (className) {
          return card.classList.contains(className);
        });
        var newPosition = getPosition(cardIndex, newIndex);

        card.classList.remove("is-loop-teleport");
        if (crossesLoopSeam(oldPosition, newPosition)) {
          card.classList.add("is-loop-teleport");
        }

        card.classList.remove.apply(card.classList, positionClasses);
        card.classList.add(newPosition);
        card.setAttribute("aria-current", newPosition === "is-active" ? "true" : "false");
      });

      activeIndex = newIndex;
    }

    function move(direction, event) {
      if (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      focusCard(activeIndex + direction);
    }

    track.setAttribute("data-reference-loop", "true");
    track.setAttribute("aria-roledescription", "Endlosschleife");
    previous.disabled = false;
    next.disabled = false;
    previous.removeAttribute("aria-disabled");
    next.removeAttribute("aria-disabled");

    previous.addEventListener("click", function (event) {
      move(-1, event);
    }, true);

    next.addEventListener("click", function (event) {
      move(1, event);
    }, true);

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
      focusCard(activeIndex + (deltaX < 0 ? 1 : -1));
    }, { capture: true, passive: true });
  });
})();
