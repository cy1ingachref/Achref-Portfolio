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

  // ===== Animated particle network (self-contained, pauses when tab hidden) =====
  var canvas = document.getElementById('particles');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var dots = [], W = 0, H = 0, raf = null, running = false;
    var COLORS = ['127,119,221', '29,158,117', '120,150,255'];

    function size() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function build() {
      var n = Math.max(28, Math.min(70, Math.round(W * H / 26000)));
      dots = [];
      for (var i = 0; i < n; i++) {
        dots.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.6,
          c: COLORS[(Math.random() * COLORS.length) | 0]
        });
      }
    }
    function step() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < dots.length; i++) {
        var p = dots[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.c + ',0.85)';
        ctx.fill();
        for (var j = i + 1; j < dots.length; j++) {
          var q = dots[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var max = 130;
          if (dist < max) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(' + p.c + ',' + (0.16 * (1 - dist / max)).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
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
