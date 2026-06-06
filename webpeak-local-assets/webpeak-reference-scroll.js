(function () {
  var sections = document.querySelectorAll(".reference-scroll_section");
  if (!sections.length) return;

  sections.forEach(function (section) {
    var track = section.querySelector(".reference-scroll_track");
    var cards = Array.prototype.slice.call(section.querySelectorAll(".reference-scroll_card"));
    var previous = section.querySelector("[data-reference-prev]");
    var next = section.querySelector("[data-reference-next]");
    var activeIndex = Math.max(0, cards.findIndex(function (card) {
      return card.classList.contains("is-active");
    }));

    function focusCard(index) {
      activeIndex = (index + cards.length) % cards.length;
      cards.forEach(function (card, cardIndex) {
        var diff = cardIndex - activeIndex;
        var active = cardIndex === activeIndex;
        card.classList.remove("is-active", "is-prev", "is-next", "is-far-prev", "is-far-next", "is-hidden-left", "is-hidden-right");
        if (active) card.classList.add("is-active");
        else if (diff === -1) card.classList.add("is-prev");
        else if (diff === 1) card.classList.add("is-next");
        else if (diff === -2) card.classList.add("is-far-prev");
        else if (diff === 2) card.classList.add("is-far-next");
        else if (diff < -2) card.classList.add("is-hidden-left");
        else card.classList.add("is-hidden-right");
        card.setAttribute("aria-current", active ? "true" : "false");
      });
    }

    cards.forEach(function (card, index) {
      card.addEventListener("click", function (event) {
        if (card.classList.contains("is-active")) {
          event.preventDefault();
          window.open(card.href, "_blank", "noopener");
          return;
        }
        event.preventDefault();
        focusCard(index);
      });
    });

    if (previous) {
      previous.addEventListener("click", function () {
        focusCard(activeIndex - 1);
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        focusCard(activeIndex + 1);
      });
    }

    focusCard(activeIndex);
  });
})();
