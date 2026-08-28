(function () {
  var sections = document.querySelectorAll(".reference-scroll_section");
  if (!sections.length) return;

  sections.forEach(function (section) {
    var track = section.querySelector(".reference-scroll_track");
    if (track && !track.querySelector('[data-reference="liquid-metal"]')) {
      var liquidMetalCard = document.createElement("article");
      liquidMetalCard.dataset.reference = "liquid-metal";
      liquidMetalCard.dataset.referenceUrl = "https://www.sgliquidmetal.com/";
      liquidMetalCard.className = "reference-scroll_card is-hidden-right";
      liquidMetalCard.innerHTML = [
        '<img src="./webpeak-local-assets/041a00c4af-6935ef1518820fc925c2d302_mountains--with-sky.avif" loading="eager" decoding="async" alt="Berglandschaft mit Himmel" class="reference-scroll_image">',
        '<img src="./webpeak-local-assets/reference-sg-liquid-metal.png" loading="eager" decoding="async" alt="Website Referenz von SG Liquid Metal Collection" class="reference-scroll_project-image">',
        '<div class="reference-scroll_overlay"></div>',
        '<div class="reference-scroll_content">',
          '<div class="reference-scroll_badge"><img src="./webpeak-local-assets/reference-sg-liquid-metal-logo.png" loading="eager" decoding="async" alt="Logo von SG Liquid Metal Collection" class="reference-scroll_badge-logo"></div>',
          '<div class="reference-scroll_copy">',
            '<div class="reference-scroll_title">SG Liquid Metal Collection</div>',
            '<div class="reference-scroll_text">Ikonische und international renommierte Schmuckmarke aus Miami.</div>',
            '<a class="reference-scroll_link" href="https://www.sgliquidmetal.com/" target="_blank" rel="noopener noreferrer">sgliquidmetal.com</a>',
          '</div>',
        '</div>'
      ].join("");
      var gwServicesCard = Array.prototype.find.call(track.querySelectorAll(".reference-scroll_card"), function (card) {
        return card.textContent.indexOf("GWServices") !== -1;
      });
      if (gwServicesCard) {
        gwServicesCard.insertAdjacentElement("afterend", liquidMetalCard);
      } else {
        track.appendChild(liquidMetalCard);
      }
    }
    if (track && !track.querySelector('[data-reference="omnix"]')) {
      var omnixCard = document.createElement("article");
      omnixCard.dataset.reference = "omnix";
      omnixCard.dataset.referenceUrl = "https://omnix.ch/";
      omnixCard.className = "reference-scroll_card is-hidden-right";
      omnixCard.innerHTML = [
        '<img src="./webpeak-local-assets/041a00c4af-6935ef1518820fc925c2d302_mountains--with-sky.avif" loading="eager" decoding="async" alt="Berglandschaft mit Himmel" class="reference-scroll_image">',
        '<img src="./webpeak-local-assets/reference-omnix.png" loading="eager" decoding="async" alt="Website Referenz von OMNIX" class="reference-scroll_project-image">',
        '<div class="reference-scroll_overlay"></div>',
        '<div class="reference-scroll_content">',
          '<div class="reference-scroll_badge"><img src="./webpeak-local-assets/logo-omnix.png" loading="eager" decoding="async" alt="Logo von OMNIX" class="reference-scroll_badge-logo"></div>',
          '<div class="reference-scroll_copy">',
            '<div class="reference-scroll_title">OMNIX</div>',
            '<div class="reference-scroll_text">Manuelle Qualitätssicherung für technische Bauteile in der Schweizer Produktion.</div>',
            '<a class="reference-scroll_link" href="https://omnix.ch/" target="_blank" rel="noopener noreferrer">omnix.ch</a>',
          '</div>',
        '</div>'
      ].join("");
      var liquidMetalReference = track.querySelector('[data-reference="liquid-metal"]');
      if (liquidMetalReference) {
        liquidMetalReference.insertAdjacentElement("afterend", omnixCard);
      } else {
        track.appendChild(omnixCard);
      }
    }
    Array.prototype.slice.call(section.querySelectorAll("a.reference-scroll_card")).forEach(function (linkCard) {
      var staticCard = document.createElement("article");
      staticCard.dataset.referenceUrl = linkCard.href;
      Array.prototype.slice.call(linkCard.attributes).forEach(function (attribute) {
        if (attribute.name !== "href" && attribute.name !== "target" && attribute.name !== "rel") {
          staticCard.setAttribute(attribute.name, attribute.value);
        }
      });
      staticCard.innerHTML = linkCard.innerHTML;
      linkCard.replaceWith(staticCard);
    });

    Array.prototype.slice.call(section.querySelectorAll(".reference-scroll_card")).forEach(function (card) {
      var url = card.dataset.referenceUrl;
      var urlLabel = card.querySelector(".reference-scroll_link");
      if (!url || !urlLabel || urlLabel.matches("a")) return;

      var projectLink = document.createElement("a");
      projectLink.className = urlLabel.className;
      projectLink.textContent = urlLabel.textContent;
      projectLink.href = url;
      projectLink.target = "_blank";
      projectLink.rel = "noopener noreferrer";
      urlLabel.replaceWith(projectLink);
    });

    var cards = Array.prototype.slice.call(section.querySelectorAll(".reference-scroll_card"));
    cards.forEach(function (card) {
      Array.prototype.forEach.call(card.querySelectorAll("img"), function (image) {
        image.loading = "eager";
        image.decoding = "async";
      });
    });
    var previous = section.querySelector("[data-reference-prev]");
    var next = section.querySelector("[data-reference-next]");
    var touchStartX = 0;
    var touchStartY = 0;
    var touchMoved = false;
    var lastSwipeAt = 0;
    var defaultIndex = cards.findIndex(function (card) {
      return card.dataset.reference === "omnix";
    });
    var activeIndex = defaultIndex >= 0 ? defaultIndex : Math.max(0, cards.findIndex(function (card) {
      return card.classList.contains("is-active");
    }));

    function normalizeIndex(index) {
      return ((index % cards.length) + cards.length) % cards.length;
    }

    if (track) {
      track.setAttribute("data-reference-loop", "true");
      track.setAttribute("aria-roledescription", "Endlosschleife");
    }

    [previous, next].forEach(function (control) {
      if (!control) return;
      control.disabled = false;
      control.removeAttribute("aria-disabled");
    });

    function focusCard(index) {
      activeIndex = normalizeIndex(index);
      cards.forEach(function (card, cardIndex) {
        var diff = (cardIndex - activeIndex + cards.length) % cards.length;
        if (diff > Math.floor(cards.length / 2)) diff -= cards.length;
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
        if (event.target.closest("a.reference-scroll_link")) {
          if (Date.now() - lastSwipeAt < 350) event.preventDefault();
          return;
        }
        if (Date.now() - lastSwipeAt < 350) {
          event.preventDefault();
          return;
        }
        event.preventDefault();
        if (!card.classList.contains("is-active")) focusCard(index);
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
