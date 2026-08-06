(function () {
  var original = document.querySelector(".webpeak-fit-section");
  if (!original || document.querySelector(".webpeak-fit-section-compare")) return;

  var originalSection = original.closest("section.section");
  if (!originalSection) return;

  var comparisonSection = originalSection.cloneNode(true);
  var comparison = comparisonSection.querySelector(".webpeak-fit-section");
  var comparisonGrid = comparison && comparison.querySelector(".layout-list_right");
  if (!comparison || !comparisonGrid) return;

  comparison.classList.add("webpeak-fit-section-compare");
  comparisonSection.setAttribute("data-fit-comparison", "new");

  var comparisonTitle = comparison.querySelector(".layout-list_left h2");
  if (comparisonTitle) {
    comparisonTitle.textContent = "Für welche Projekte erstellen wir ein kostenloses Erstdesign?";
  }

  comparisonGrid.className = "webpeak-fit-cross";
  comparisonGrid.setAttribute("data-webpeak-fit-cross", "");
  comparisonGrid.innerHTML = [
    '<div class="webpeak-fit-cross-grid">',
      '<article class="webpeak-fit-cross-item" style="--fit-index:0">',
        '<div class="webpeak-fit-title-row"><div class="layout-list_item-icon-wrapper"><img aria-hidden="true" loading="lazy" alt="" src="./webpeak-local-assets/icon-chart-line-up.svg" class="icon-1x1-small"></div><h3 class="text-size-large text-weight-bold">Neue Website für ein bestehendes Unternehmen</h3></div>',
      '</article>',
      '<article class="webpeak-fit-cross-item" style="--fit-index:1">',
        '<div class="webpeak-fit-title-row"><div class="layout-list_item-icon-wrapper"><img aria-hidden="true" loading="lazy" alt="" src="./webpeak-local-assets/icon-ghost.svg" class="icon-1x1-small"></div><h3 class="text-size-large text-weight-bold">Relaunch eines veralteten Webauftritts</h3></div>',
      '</article>',
      '<article class="webpeak-fit-cross-item" style="--fit-index:2">',
        '<div class="webpeak-fit-title-row"><div class="layout-list_item-icon-wrapper"><img aria-hidden="true" loading="lazy" alt="" src="./webpeak-local-assets/icon-rocket-outline.svg" class="icon-1x1-small"></div><h3 class="text-size-large text-weight-bold">Professioneller Start für ein neues Unternehmen</h3></div>',
      '</article>',
      '<article class="webpeak-fit-cross-item" style="--fit-index:3">',
        '<div class="webpeak-fit-title-row"><div class="layout-list_item-icon-wrapper"><img aria-hidden="true" loading="lazy" alt="" src="./webpeak-local-assets/icon-clover-light.svg" class="icon-1x1-small"></div><h3 class="text-size-large text-weight-bold">Ernsthafte Absicht zur späteren Umsetzung</h3></div>',
      '</article>',
    '</div>',
    '<span class="webpeak-fit-line webpeak-fit-line-top" aria-hidden="true"></span>',
    '<span class="webpeak-fit-line webpeak-fit-line-bottom" aria-hidden="true"></span>',
    '<span class="webpeak-fit-line webpeak-fit-line-left" aria-hidden="true"></span>',
    '<span class="webpeak-fit-line webpeak-fit-line-right" aria-hidden="true"></span>',
    '<span class="webpeak-fit-center" aria-hidden="true"><svg viewBox="0 0 64 58" focusable="false"><path class="webpeak-fit-mountain-back" d="M4 50 18 31l13 19H4Zm29 0 14-20 13 20H33Z"></path><path class="webpeak-fit-mountain-front" d="m13 50 19-29 20 29H13Z"></path><path class="webpeak-fit-snow" d="m25.5 31 6.5-10 7.2 10.5-4.3-2.1-3.1 4-2.4-4-3.9 1.6Z"></path><path class="webpeak-fit-flagpole" d="M32 22V5"></path><path class="webpeak-fit-flag" d="M33 6h13l-3.5 4 3.5 4H33V6Z"></path></svg></span>'
  ].join("");

  originalSection.insertAdjacentElement("afterend", comparisonSection);
  originalSection.remove();

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    comparisonGrid.classList.add("is-drawn");
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.intersectionRatio >= 0.88) {
        comparisonGrid.classList.add("is-drawn");
      } else if (entry.intersectionRatio < 0.3) {
        comparisonGrid.classList.remove("is-drawn");
      }
    });
  }, { threshold: [0, 0.3, 0.7, 0.88, 1] });

  observer.observe(comparison);
})();
