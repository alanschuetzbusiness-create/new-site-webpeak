(function () {
  "use strict";

  var cross = document.querySelector(".webpeak-home-design-cross");
  var modal = document.querySelector("[data-home-design-modal]");
  var openButton = document.querySelector("[data-home-design-modal-open]");
  var closeButtons = modal ? modal.querySelectorAll("[data-home-design-modal-close]") : [];
  var lastActiveElement = null;

  function showCross() {
    if (!cross) return;
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cross.classList.add("is-drawn");
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          cross.classList.add("is-drawn");
          observer.disconnect();
        }
      });
    }, { threshold: .45 });

    observer.observe(cross);
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.documentElement.classList.remove("webpeak-home-design-modal-open");
    if (lastActiveElement) lastActiveElement.focus({ preventScroll: true });
  }

  function openModal() {
    if (!modal) return;
    lastActiveElement = document.activeElement;
    modal.hidden = false;
    document.documentElement.classList.add("webpeak-home-design-modal-open");
    var firstField = modal.querySelector("input:not([type='hidden']):not(.webpeak-home-design-honey)");
    if (firstField) window.setTimeout(function () { firstField.focus({ preventScroll: true }); }, 30);
  }

  showCross();
  if (openButton) openButton.addEventListener("click", openModal);
  Array.prototype.forEach.call(closeButtons, function (button) { button.addEventListener("click", closeModal); });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeModal();
  });
})();
