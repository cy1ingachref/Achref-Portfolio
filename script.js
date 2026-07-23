// ===== Achref Ferjani — minimal interactions =====
(function () {
  'use strict';

  // Year in footer
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Subtle reveal-on-scroll for content blocks (safe: visible if JS fails)
  var blocks = document.querySelectorAll('.block, .site-foot');
  if (!('IntersectionObserver' in window)) return;
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
})();
