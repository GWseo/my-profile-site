// Mobile menu
const menu = document.getElementById('mobile-menu');
const menuBtn = document.getElementById('menu-btn');
menuBtn.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', false);
}));

// Header style + progress bar
const header = document.getElementById('header');
const progress = document.getElementById('progress');
function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 10);
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Active nav link
const links = document.querySelectorAll('.nav-link[href^="#"]');
const spy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

// Constellation background
(function () {
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, stars = [], dpr = Math.min(devicePixelRatio || 1, 2);

  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round((w * h) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3,
      vx: (Math.random() - 0.5) * 0.06, vy: (Math.random() - 0.5) * 0.06,
      p: Math.random() * Math.PI * 2, bright: Math.random() < 0.18
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const maxD = Math.min(130, w * 0.22);
    for (let i = 0; i < stars.length; i++) {
      const a = stars[i];
      for (let j = i + 1; j < stars.length; j++) {
        const b = stars[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
        if (d < maxD) {
          ctx.strokeStyle = `rgba(190,200,255,${0.16 * (1 - d / maxD)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (const s of stars) {
      const tw = reduce ? 1 : 0.65 + 0.35 * Math.sin(t / 900 + s.p);
      ctx.fillStyle = s.bright ? `rgba(230,200,140,${0.85 * tw})` : `rgba(200,210,255,${0.55 * tw})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.bright ? s.r + 0.6 : s.r, 0, 6.2832); ctx.fill();
      if (!reduce) {
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0 || s.x > w) s.vx *= -1;
        if (s.y < 0 || s.y > h) s.vy *= -1;
      }
    }
    if (!reduce) requestAnimationFrame(draw);
  }

  resize();
  addEventListener('resize', () => { resize(); if (reduce) draw(0); });
  draw(0);
})();
