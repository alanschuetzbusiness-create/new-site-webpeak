(function () {
  var sections = document.querySelectorAll(".reference-scroll_section");
  if (!sections.length) return;

  sections.forEach(function (section) {
    var track = section.querySelector(".reference-scroll_track");
    if (track && !track.querySelector('[href="https://lmcollection.com/"]')) {
      var liquidMetalCard = document.createElement("a");
      liquidMetalCard.href = "https://lmcollection.com/";
      liquidMetalCard.target = "_blank";
      liquidMetalCard.rel = "noopener";
      liquidMetalCard.className = "reference-scroll_card is-hidden-right";
      liquidMetalCard.innerHTML = [
        '<img src="./webpeak-local-assets/041a00c4af-6935ef1518820fc925c2d302_mountains--with-sky.avif" loading="lazy" alt="Berglandschaft mit Himmel" class="reference-scroll_image">',
        '<img src="./webpeak-local-assets/reference-sg-liquid-metal.png" loading="lazy" alt="Website Referenz von SG Liquid Metal Collection" class="reference-scroll_project-image">',
        '<div class="reference-scroll_overlay"></div>',
        '<div class="reference-scroll_content">',
          '<div class="reference-scroll_badge"><img src="./webpeak-local-assets/reference-sg-liquid-metal-logo.png" loading="lazy" alt="Logo von SG Liquid Metal Collection" class="reference-scroll_badge-logo"></div>',
          '<div>',
            '<div class="reference-scroll_title">SG Liquid Metal Collection</div>',
            '<div class="reference-scroll_text">Ikonische und international renommierte Schmuckmarke aus Miami.</div>',
            '<div class="reference-scroll_link">lmcollection.com</div>',
          '</div>',
        '</div>'
      ].join("");
      var gwServicesCard = track.querySelector('[href="https://gwservices.ch/"]');
      if (gwServicesCard) {
        gwServicesCard.insertAdjacentElement("afterend", liquidMetalCard);
      } else {
        track.appendChild(liquidMetalCard);
      }
    }
    var cards = Array.prototype.slice.call(section.querySelectorAll(".reference-scroll_card"));
    var previous = section.querySelector("[data-reference-prev]");
    var next = section.querySelector("[data-reference-next]");
    var touchStartX = 0;
    var touchStartY = 0;
    var touchMoved = false;
    var lastSwipeAt = 0;
    var defaultIndex = cards.findIndex(function (card) {
      return card.href === "https://lmcollection.com/";
    });
    var activeIndex = defaultIndex >= 0 ? defaultIndex : Math.max(0, cards.findIndex(function (card) {
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
        if (Date.now() - lastSwipeAt < 350) {
          event.preventDefault();
          return;
        }
        if (card.classList.contains("is-active")) {
          event.preventDefault();
          window.open(card.href, "_blank", "noopener");
          return;
        }
        event.preventDefault();
        focusCard(index);
      });
    });

    if (track) {
      track.addEventListener("touchstart", function (event) {
        if (!event.touches || event.touches.length !== 1) return;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        touchMoved = false;
      }, { passive: true });

      track.addEventListener("touchmove", function (event) {
        if (!event.touches || event.touches.length !== 1) return;
        var deltaX = event.touches[0].clientX - touchStartX;
        var deltaY = event.touches[0].clientY - touchStartY;
        if (Math.abs(deltaX) > 12 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15) {
          touchMoved = true;
          event.preventDefault();
        }
      }, { passive: false });

      track.addEventListener("touchend", function (event) {
        if (!touchMoved || !event.changedTouches || !event.changedTouches.length) return;
        var deltaX = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(deltaX) < 44) return;
        lastSwipeAt = Date.now();
        focusCard(activeIndex + (deltaX < 0 ? 1 : -1));
      });
    }

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
