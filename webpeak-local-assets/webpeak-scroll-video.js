(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stage = document.querySelector(".webpeak-scroll-video");
  if (!stage) return;

  var frame = stage.querySelector(".webpeak-scroll-video_frame");
  var media = stage.querySelector(".webpeak-scroll-video_media");
  if (!frame || !media) return;

  var isJourneyVideo = stage.classList.contains("is-journey");
  var progressRoot = isJourneyVideo ? stage.closest("#webpeak-journey") || stage : stage;
  var timelineProgressWrap = progressRoot.querySelector ? progressRoot.querySelector(".timeline_progress") : null;
  var timelineCircles = progressRoot.querySelectorAll ? Array.prototype.slice.call(progressRoot.querySelectorAll(".timeline_circle")) : [];
  var isSequence = media.tagName === "IMG" && media.dataset.sequencePath;
  var sequencePath = isSequence ? media.dataset.sequencePath : "";
  var frameCount = Number(media.dataset.frameCount) || 1;
  var currentFrame = -1;
  var canvas = null;
  var canvasContext = null;
  var ticking = false;
  var targetProgress = 0;
  var smoothProgress = 0;
  var animationActive = false;
  var preloadedFrames = {};
  var loadedFrames = {};
  var pendingFrame = null;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function padFrame(number) {
    return String(number).padStart(3, "0");
  }

  function frameUrl(index) {
    return sequencePath + "/frame-" + padFrame(index + 1) + ".jpg";
  }

  function preloadFrame(index) {
    if (!isSequence || index < 0 || index >= frameCount || preloadedFrames[index]) return;
    var image = new Image();
    image.decoding = "async";
    image.onload = function () {
      loadedFrames[index] = true;
      if (currentFrame === -1 && index === 0) {
        setFrameByIndex(0);
      }
      if (pendingFrame === index) {
        pendingFrame = null;
        setFrameByIndex(index);
      }
    };
    image.src = frameUrl(index);
    preloadedFrames[index] = image;
    if (image.complete && image.naturalWidth > 0) {
      loadedFrames[index] = true;
    }
  }

  function preloadAround(index) {
    preloadFrame(index);
    preloadFrame(index + 1);
    preloadFrame(index + 2);
    preloadFrame(index + 3);
    preloadFrame(index - 1);
  }

  function preloadAllFrames() {
    if (!isSequence) return;
    var index = 0;
    function step() {
      var end = Math.min(frameCount, index + 4);
      for (; index < end; index += 1) {
        preloadFrame(index);
      }
      if (index < frameCount) {
        window.setTimeout(step, 45);
      }
    }
    step();
  }

  function setFrameByIndex(index) {
    if (index === currentFrame) return;
    var image = preloadedFrames[index];
    if (canvasContext && image && image.complete && image.naturalWidth > 0) {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      canvasContext.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
    currentFrame = index;
  }

  function setFrame(progress) {
    if (!isSequence) return;
    var index = Math.round(clamp(progress, 0, 1) * (frameCount - 1));
    if (index === currentFrame) return;
    preloadAround(index);
    if (loadedFrames[index]) {
      setFrameByIndex(index);
    } else {
      pendingFrame = index;
    }
  }

  function applyVisuals(progress) {
    if (reduceMotion) {
      frame.style.transform = "";
      media.style.transform = "";
      setFrame(0);
      return;
    }

    var eased = 1 - Math.pow(1 - progress, 3);
    var frameY = 18 - eased * 30;
    var scale = .93 + eased * .07;
    var mediaY = -2 + eased * 4;
    var mediaScale = 1.06 - eased * .02;
    var opacity = .82 + eased * .18;

    frame.style.transform = "translate3d(0," + frameY.toFixed(2) + "px,0) scale(" + scale.toFixed(4) + ")";
    frame.style.opacity = opacity.toFixed(3);
    media.style.transform = "translate3d(0," + mediaY.toFixed(2) + "%,0) scale(" + mediaScale.toFixed(4) + ")";
    setFrame(progress);
  }

  function readProgress() {
    if (isJourneyVideo && window.matchMedia("(max-width: 767px)").matches) {
      var stageRect = stage.getBoundingClientRect();
      var stageTravel = Math.max(1, stageRect.height - window.innerHeight);
      return clamp((-stageRect.top) / stageTravel, 0, 1);
    }

    if (isJourneyVideo && timelineProgressWrap && timelineCircles.length > 1) {
      var firstCircle = timelineCircles[1] || timelineCircles[0];
      var lastCircle = timelineCircles[timelineCircles.length - 1];
      var progressRect = timelineProgressWrap.getBoundingClientRect();
      var firstRect = firstCircle.getBoundingClientRect();
      var lastRect = lastCircle.getBoundingClientRect();
      var firstCenter = firstRect.top + firstRect.height / 2 - progressRect.top;
      var lastCenter = lastRect.top + lastRect.height / 2 - progressRect.top;
      var playhead = window.innerHeight * 0.54 - progressRect.top;

      return clamp((playhead - firstCenter) / Math.max(1, lastCenter - firstCenter), 0, 1);
    }

    var rect = progressRoot.getBoundingClientRect();
    var travel = Math.max(1, rect.height - window.innerHeight);
    var rawProgress = clamp((-rect.top) / travel, 0, 1);
    var startDelay = isJourneyVideo ? .08 : 0;
    return clamp((rawProgress - startDelay) / (1 - startDelay), 0, 1);
  }

  function animate() {
    animationActive = false;
    smoothProgress += (targetProgress - smoothProgress) * .26;

    if (Math.abs(targetProgress - smoothProgress) < .002) {
      smoothProgress = targetProgress;
    }

    applyVisuals(smoothProgress);

    if (smoothProgress !== targetProgress) {
      animationActive = true;
      requestAnimationFrame(animate);
    }
  }

  function update() {
    ticking = false;
    targetProgress = readProgress();
    if (!animationActive) {
      animationActive = true;
      requestAnimationFrame(animate);
    }
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  if (isSequence) {
    canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 720;
    canvas.className = media.className;
    canvas.setAttribute("aria-label", media.getAttribute("alt") || "");
    canvasContext = canvas.getContext("2d");
    media.replaceWith(canvas);
    media = canvas;

    preloadFrame(0);
    preloadFrame(1);
    preloadFrame(2);
    preloadAllFrames();
  } else if (media.pause) {
    media.pause();
    media.removeAttribute("autoplay");
    media.removeAttribute("loop");
  }

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
})();

(function () {
  var demoSection = document.querySelector("#webpeak-demo");
  if (!demoSection) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;
  var ticking = false;
  var animating = false;
  var target = 0;
  var current = 0;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function readFadeProgress() {
    var rect = demoSection.getBoundingClientRect();
    var start = window.innerHeight * .78;
    var end = window.innerHeight * .18;

    if (rect.top > start) return 0;
    if (rect.bottom < 0) return 1;

    return clamp((start - rect.top) / Math.max(1, start - end), 0, 1);
  }

  function writeProgress(value) {
    root.style.setProperty("--webpeak-demo-bg-fade", value.toFixed(3));
  }

  function animate() {
    animating = false;

    if (reduceMotion) {
      current = target;
    } else {
      current += (target - current) * .18;
      if (Math.abs(target - current) < .003) current = target;
    }

    writeProgress(current);

    if (current !== target) {
      animating = true;
      requestAnimationFrame(animate);
    }
  }

  function update() {
    ticking = false;
    target = readFadeProgress();

    if (!animating) {
      animating = true;
      requestAnimationFrame(animate);
    }
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
})();

(function () {
  var banner = document.querySelector(".webpeak-pricing-banner");
  if (!banner) return;

  var marquees = Array.prototype.slice.call(banner.querySelectorAll(".banner_marquee"));
  if (!marquees.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ticking = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function update() {
    ticking = false;

    if (reduceMotion) {
      marquees.forEach(function (marquee) {
        marquee.style.transform = "";
      });
      return;
    }

    var rect = banner.getBoundingClientRect();
    var travel = window.innerHeight + rect.height;
    var progress = clamp((window.innerHeight - rect.top) / Math.max(1, travel), 0, 1);
    var distance = banner.offsetWidth * .18;
    var x = progress * -distance;

    marquees.forEach(function (marquee) {
      marquee.style.transform = "translate3d(" + x.toFixed(2) + "px, 0, 0)";
    });
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
})();
