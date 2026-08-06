(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll(".stack_card-snowflake"));
  if (!items.length) return;

  var ticking = false;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function update() {
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
    items.forEach(function (item, index) {
      var card = item.closest(".stack_card") || item.closest(".webpeak-person-card");
      if (!card) return;

      var rect = card.getBoundingClientRect();
      var progress = 1 - clamp((rect.top + rect.height * 0.15) / viewportHeight, 0, 1);
      var maxRotation = item.classList.contains("webpeak-person-snowflake") ? 42 : index === 2 ? 62 : 86;
      var rotation = clamp(progress * maxRotation, 0, maxRotation);

      item.style.willChange = "transform";
      item.style.transform = "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(" + rotation.toFixed(3) + "deg) skew(0deg, 0deg)";
      item.style.transformStyle = "preserve-3d";
    });
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

(function () {
  var titles = Array.prototype.slice.call(document.querySelectorAll(".webpeak-stat-title"));
  var swissMadeTitle = titles.find(function (title) {
    return title.textContent.trim() === "Swiss Made";
  });

  if (!swissMadeTitle || swissMadeTitle.querySelector(".webpeak-swiss-emblem")) return;

  var style = document.createElement("style");
  style.textContent =
    ".webpeak-swiss-made-title{display:flex;align-items:center;gap:.28em;white-space:nowrap}" +
    ".webpeak-swiss-emblem{display:inline-flex;width:.82em;height:.82em;flex:0 0 auto;align-items:center;justify-content:center;border-radius:50%;overflow:hidden;background:#f00;box-shadow:inset 0 0 0 1px rgba(11,31,58,.08)}" +
    ".webpeak-swiss-emblem img{display:block;width:100%;height:100%;object-fit:cover}" +
    "@media(max-width:767px){.webpeak-swiss-made-title{gap:.24em}.webpeak-swiss-emblem{width:.78em;height:.78em}}";
  document.head.appendChild(style);

  swissMadeTitle.classList.add("webpeak-swiss-made-title");

  var emblem = document.createElement("span");
  emblem.className = "webpeak-swiss-emblem";
  emblem.setAttribute("aria-hidden", "true");
  emblem.innerHTML = '<img src="./webpeak-local-assets/swiss-flag-round.png" alt="">';
  swissMadeTitle.appendChild(emblem);
})();

(function () {
  var list = document.querySelector(".layout-list_right");
  if (!list) return;

  var items = Array.prototype.slice.call(list.querySelectorAll(".layout-list_item"));
  if (!items.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach(function (item) {
      item.classList.add("is-revealed");
    });
    return;
  }

  list.classList.add("is-reveal-ready");

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var item = entry.target;
        var index = items.indexOf(item);
        window.setTimeout(function () {
          item.classList.add("is-revealed");
        }, Math.min(index, 3) * 90);
        observer.unobserve(item);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -7% 0px"
    }
  );

  items.forEach(function (item) {
    observer.observe(item);
  });
})();

(function () {
  var contactPageUrl = "https://calendly.com/alan-schuetz-webpeak/30min";
  var contactButtons = document.querySelectorAll(".webpeak-person-button");

  contactButtons.forEach(function (button) {
    button.href = contactPageUrl;
  });
})();

(function () {
  var swissTitle = Array.prototype.slice.call(document.querySelectorAll(".webpeak-stat-title")).find(function (title) {
    return title.textContent.trim() === "Swiss Made";
  });
  if (!swissTitle) return;

  var swissItem = swissTitle.closest(".layout-stats_item");
  var description = swissItem && swissItem.querySelector("p");
  if (!description) return;

  description.textContent = "Keine KI-Websites und kein billiges Outsourcing. Ihr Design wird von A bis Z in der Schweiz erstellt.";
})();

(function () {
  var component = document.querySelector(".webpeak-lead-stack-component");
  if (!component) return;

  var cards = Array.prototype.slice.call(component.querySelectorAll(".stack_card"));
  var mobileQuery = window.matchMedia("(max-width: 767px)");
  var resizeFrame = 0;
  if (!cards.length) return;

  function syncMobileCardStops() {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(function () {
      if (!mobileQuery.matches) {
        cards.forEach(function (card) {
          card.style.removeProperty("top");
        });
        return;
      }

      var rootSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
      var nextTop = 7 * rootSize;

      cards.forEach(function (card) {
        card.style.top = Math.round(nextTop) + "px";

        var heading = card.querySelector(".webpeak-stack-heading");
        if (!heading) return;

        var cardRect = card.getBoundingClientRect();
        var headingRect = heading.getBoundingClientRect();
        var headingBottom = headingRect.bottom - cardRect.top;

        nextTop = Math.ceil(nextTop + headingBottom + 2);
      });
    });
  }

  syncMobileCardStops();
  window.addEventListener("load", syncMobileCardStops);
  window.addEventListener("resize", syncMobileCardStops);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncMobileCardStops);
  }

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener("change", syncMobileCardStops);
  } else if (mobileQuery.addListener) {
    mobileQuery.addListener(syncMobileCardStops);
  }
})();

(function () {
  var component = document.querySelector(".webpeak-lead-stack-component");
  if (!component) return;

  var header = component.querySelector(".webpeak-stack-section-header");
  var lastCard = component.querySelector(".stack_card.is-4");
  var desktopQuery = window.matchMedia("(min-width: 992px)");
  if (!header || !lastCard) return;

  var startScroll = 0;
  var ticking = false;

  function getStaticDocumentTop(element) {
    var top = 0;
    var node = element;

    while (node) {
      top += node.offsetTop || 0;
      node = node.offsetParent;
    }

    return top;
  }

  function measure() {
    var stickyTop = parseFloat(window.getComputedStyle(lastCard).top) || 0;
    var stackGap = parseFloat(window.getComputedStyle(component).rowGap) || 0;
    startScroll = getStaticDocumentTop(lastCard) - stickyTop + stackGap;
  }

  function update() {
    if (!desktopQuery.matches) {
      header.style.removeProperty("transform");
      ticking = false;
      return;
    }

    var distance = Math.max(0, window.scrollY - startScroll);
    header.style.transform = "translate3d(0, " + (-distance).toFixed(2) + "px, 0)";
    ticking = false;
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  function refresh() {
    measure();
    requestUpdate();
  }

  refresh();
  window.addEventListener("load", refresh);
  window.addEventListener("resize", refresh);
  window.addEventListener("scroll", requestUpdate, { passive: true });

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener("change", refresh);
  } else if (desktopQuery.addListener) {
    desktopQuery.addListener(refresh);
  }
})();
