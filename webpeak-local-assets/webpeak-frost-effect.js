(function () {
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(pointer: fine)").matches;
  if (prefersReducedMotion || !canHover) return;

  var main = document.querySelector(".main-wrapper");
  var header = main && main.querySelector("header");
  var canvas = main && main.querySelector(".webpeak-frost-canvas");
  if (!main || !header || !canvas) return;

  var ctx = canvas.getContext("2d", { alpha: true });
  var cursorDot = document.createElement("div");
  var particles = [];
  var width = 0;
  var height = 0;
  var lastSpawn = 0;
  var lastX = 0;
  var lastY = 0;
  var isAnimating = false;

  main.classList.add("webpeak-frost-ready");
  cursorDot.className = "webpeak-frost-dot";
  cursorDot.setAttribute("aria-hidden", "true");
  main.appendChild(cursorDot);

  function resize() {
    var scale = Math.min(window.devicePixelRatio || 1, 1.5);
    width = Math.max(1, window.innerWidth || document.documentElement.clientWidth);
    height = Math.max(1, window.innerHeight || document.documentElement.clientHeight);

    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
  }

  function addCrystal(x, y, force) {
    var count = force ? 2 : 1;
    for (var i = 0; i < count; i += 1) {
      var angle = Math.random() * Math.PI * 2;
      var speed = .08 + Math.random() * .38;
      particles.push({
        x: x + (Math.random() - .5) * 18,
        y: y + (Math.random() - .5) * 18,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - .06,
        size: 11 + Math.random() * 18,
        life: 1,
        decay: .026 + Math.random() * .014,
        spin: Math.random() * Math.PI,
        branch: Math.random() > .18
      });
    }
  }

  function drawCrystal(p) {
    var alpha = Math.max(0, p.life);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.spin);
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1.45;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(75, 98, 114, .5)";
    ctx.fillStyle = "rgba(244, 251, 252, .58)";
    ctx.shadowColor = "rgba(88, 124, 146, .26)";
    ctx.shadowBlur = 18;

    var radius = p.size * (1 + (1 - alpha) * .8);
    var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 1.45);
    gradient.addColorStop(0, "rgba(246, 253, 255, .34)");
    gradient.addColorStop(.5, "rgba(190, 226, 235, .18)");
    gradient.addColorStop(1, "rgba(190, 226, 235, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    for (var i = 0; i < 6; i += 1) {
      var a = (Math.PI * 2 / 6) * i;
      var x = Math.cos(a) * radius;
      var y = Math.sin(a) * radius;
      ctx.moveTo(0, 0);
      ctx.lineTo(x, y);
      if (p.branch) {
        var bx = Math.cos(a) * radius * .58;
        var by = Math.sin(a) * radius * .58;
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + Math.cos(a + .72) * radius * .28, by + Math.sin(a + .72) * radius * .28);
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + Math.cos(a - .72) * radius * .28, by + Math.sin(a - .72) * radius * .28);
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  function animate() {
    isAnimating = true;
    ctx.clearRect(0, 0, width, height);

    for (var i = particles.length - 1; i >= 0; i -= 1) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= .974;
      p.vy *= .974;
      p.spin += .0025;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
      } else {
        drawCrystal(p);
      }
    }

    if (particles.length) {
      requestAnimationFrame(animate);
    } else {
      isAnimating = false;
    }
  }

  function onPointerMove(event) {
    var x = event.clientX;
    var y = event.clientY;
    if (x < 0 || x > width || y < 0 || y > height) return;

    cursorDot.style.left = x + "px";
    cursorDot.style.top = y + "px";
    document.body.classList.add("webpeak-frost-cursor-active");

    var now = performance.now();
    var distance = Math.hypot(x - lastX, y - lastY);
    if (now - lastSpawn > 70 || distance > 52) {
      addCrystal(x, y, distance > 78);
      lastSpawn = now;
      lastX = x;
      lastY = y;
      if (!isAnimating) {
        requestAnimationFrame(animate);
      }
    }
  }

  function onPointerEnter(event) {
    var x = event.clientX;
    var y = event.clientY;
    cursorDot.style.left = x + "px";
    cursorDot.style.top = y + "px";
    document.body.classList.add("webpeak-frost-cursor-active");
    addCrystal(x, y, true);
    if (!isAnimating) requestAnimationFrame(animate);
  }

  function onPointerLeave() {
    document.body.classList.remove("webpeak-frost-cursor-active");
  }

  resize();
  window.addEventListener("resize", resize);
  main.addEventListener("pointerenter", onPointerEnter, { passive: true });
  main.addEventListener("pointermove", onPointerMove, { passive: true });
  main.addEventListener("pointerleave", onPointerLeave, { passive: true });
})();
