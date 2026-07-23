// ===== Achref Ferjani — minimal interactions =====
(function () {
  'use strict';

  // Year in footer
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Subtle reveal-on-scroll for content blocks (safe: visible if JS fails)
  var blocks = document.querySelectorAll('.block, .site-foot');
  if ('IntersectionObserver' in window) {
    blocks.forEach(function (b) { b.style.opacity = '0'; b.style.transform = 'translateY(18px)'; b.style.transition = 'opacity .7s var(--ease), transform .7s var(--ease)'; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'none';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    blocks.forEach(function (b) { io.observe(b); });
  }

  // ===== Animated moving starfield (self-contained, pauses when tab hidden) =====
  var canvas = document.getElementById('stars');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var stars = [], W = 0, H = 0, raf = null, running = false, t = 0;

    function size() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function build() {
      var n = Math.max(80, Math.min(220, Math.round(W * H / 9000)));
      stars = [];
      for (var i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.3 + 0.3,
          base: Math.random() * 0.5 + 0.3,        // base brightness
          tw: Math.random() * Math.PI * 2,         // twinkle phase
          tws: Math.random() * 0.04 + 0.01,        // twinkle speed
          vy: Math.random() * 0.18 + 0.04,         // slow downward drift
          vx: (Math.random() - 0.5) * 0.06         // slight horizontal drift
        });
      }
    }
    function step() {
      if (!running) return;
      t += 1;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.y += s.vy; s.x += s.vx;
        if (s.y > H + 2) { s.y = -2; s.x = Math.random() * W; }
        if (s.x < -2) s.x = W + 2; else if (s.x > W + 2) s.x = -2;
        var a = s.base + Math.sin(t * s.tws + s.tw) * 0.35;
        if (a < 0) a = 0; if (a > 1) a = 1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + a.toFixed(3) + ')';
        ctx.fill();
        // a few brighter stars get a soft glow
        if (s.r > 1.05) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(180,190,255,' + (a * 0.12).toFixed(3) + ')';
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(step);
    }
    function start() { if (!running) { running = true; step(); } }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

    size(); build(); start();
    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { size(); build(); }, 200);
    });
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) stop();
  }
})();
