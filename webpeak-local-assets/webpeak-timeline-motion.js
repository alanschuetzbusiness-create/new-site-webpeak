(function () {
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function setupTimeline(timeline) {
    var rows = Array.prototype.slice.call(timeline.querySelectorAll(".timeline_row"));
    var progressWrap = timeline.querySelector(".timeline_progress");
    var progress = timeline.querySelector(".timeline_progress-line");
    var circles = Array.prototype.slice.call(timeline.querySelectorAll(".timeline_circle"));

    if (!rows.length || !progress) return;

    progress.style.transformOrigin = "top center";
    progress.style.transition = "transform 160ms ease-out";
    circles.forEach(function (circle) {
      circle.style.transition = "background-color 180ms ease-out, transform 180ms ease-out";
    });

    function syncLineEnd() {
      var firstCircle = circles[0];
      var lastCircle = circles[circles.length - 1];
      if (!progressWrap || !firstCircle || !lastCircle) return;

      var timelineContent = timeline.querySelector(".timeline_content") || timeline;
      var contentRect = timelineContent.getBoundingClientRect();
      var firstRect = firstCircle.getBoundingClientRect();
      var lastRect = lastCircle.getBoundingClientRect();
      var firstCenter = firstRect.top + firstRect.height / 2 - contentRect.top;
      var lastCenter = lastRect.top + lastRect.height / 2 - contentRect.top;

      progressWrap.style.top = Math.max(0, Math.round(firstCenter)) + "px";
      progressWrap.style.bottom = "auto";
      progressWrap.style.height = Math.max(0, Math.round(lastCenter - firstCenter)) + "px";
      timeline.classList.add("is-timeline-ready");
    }

    function update() {
      syncLineEnd();

      var firstCircle = circles[0];
      var lastCircle = circles[circles.length - 1];
      var progressValue = 0;

      if (firstCircle && lastCircle && progressWrap) {
        var progressRect = progressWrap.getBoundingClientRect();
        var firstRect = firstCircle.getBoundingClientRect();
        var lastRect = lastCircle.getBoundingClientRect();
        var firstCenter = firstRect.top + firstRect.height / 2 - progressRect.top;
        var lastCenter = lastRect.top + lastRect.height / 2 - progressRect.top;
        var playhead = window.innerHeight * 0.54 - progressRect.top;

        progressValue = clamp((playhead - firstCenter) / Math.max(1, lastCenter - firstCenter), 0, 1);
      }

      progress.style.transform = "scaleY(" + progressValue.toFixed(3) + ")";

      var trigger = window.innerHeight * 0.54;
      rows.forEach(function (row, index) {
        var rowRect = row.getBoundingClientRect();
        var isActive = rowRect.top + rowRect.height * 0.18 < trigger;
        var circle = circles[index];
        var item = row.querySelector(".timeline_item");
        if (!circle) return;

        circle.style.backgroundColor = isActive ? "#FFBF00" : "#FFE7A3";
        circle.style.transform = isActive ? "scale(1.22)" : "scale(1)";
        if (item) {
          item.classList.toggle("is-active", isActive);
        }
      });
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", function () {
      syncLineEnd();
      update();
    });
  }

  function init() {
    document.querySelectorAll("#webpeak-journey .timeline_component").forEach(setupTimeline);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
