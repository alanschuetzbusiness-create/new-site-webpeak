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
