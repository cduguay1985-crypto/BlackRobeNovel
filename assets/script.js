/* ============================================================
   The Black Robe — interactions
   ============================================================ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Hero reveals on load ---------- */
  window.addEventListener('load', function () {
    document.querySelectorAll('.hero .reveal').forEach(function (el) {
      el.classList.add('in');
    });
  });

  /* ---------- Scroll reveal (everything below the hero) ---------- */
  const revealEls = document.querySelectorAll('.reveal:not(.hero .reveal)');
  const allReveals = Array.prototype.filter.call(
    document.querySelectorAll('.reveal'),
    function (el) { return !el.closest('.hero'); }
  );

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    allReveals.forEach(function (el) { io.observe(el); });
  } else {
    allReveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Nav scrolled state + progress bar ---------- */
  const nav = document.getElementById('nav');
  const progressBar = document.getElementById('progressBar');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('scrolled', y > 80);
    if (progressBar) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Count-up stats ---------- */
  const stats = document.querySelectorAll('.stat__num[data-count]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        const dur = 1400;
        const start = performance.now();
        function step(now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        requestAnimationFrame(step);
        sio.unobserve(el);
      });
    }, { threshold: 0.6 });
    stats.forEach(function (el) { sio.observe(el); });
  }

  /* ---------- Ember particles in the hero ---------- */
  const canvas = document.getElementById('embers');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    const hero = canvas.parentElement;
    let w, h, embers, raf;

    function size() {
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    }

    function makeEmber() {
      return {
        x: Math.random() * w,
        y: h + Math.random() * 60,
        r: Math.random() * 2 + 0.6,
        vy: -(Math.random() * 0.5 + 0.2),
        vx: (Math.random() - 0.5) * 0.3,
        life: Math.random(),
        flick: Math.random() * 0.04 + 0.01
      };
    }

    function init() {
      size();
      const count = Math.min(70, Math.floor(w / 22));
      embers = [];
      for (let i = 0; i < count; i++) {
        const e = makeEmber();
        e.y = Math.random() * h;
        embers.push(e);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.x += e.vx;
        e.y += e.vy;
        e.life += e.flick;
        const alpha = (0.35 + Math.sin(e.life) * 0.3) * 0.7;
        if (e.y < -10) Object.assign(e, makeEmber());
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 3);
        g.addColorStop(0, 'rgba(231,189,128,' + alpha + ')');
        g.addColorStop(0.4, 'rgba(199,120,60,' + alpha * 0.5 + ')');
        g.addColorStop(1, 'rgba(199,120,60,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    init();
    draw();

    let rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(init, 200);
    });

    // Pause when hero is offscreen to save battery
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { if (!raf) draw(); }
          else { cancelAnimationFrame(raf); raf = null; }
        });
      }, { threshold: 0 }).observe(hero);
    }
  }

  /* ---------- Subtle parallax on the cover ---------- */
  const cover = document.querySelector('.cover-float');
  if (cover && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    const story = document.querySelector('.story');
    story.addEventListener('mousemove', function (e) {
      const rect = story.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      cover.style.transform = 'rotateY(' + (cx * 10) + 'deg) rotateX(' + (-cy * 10) + 'deg)';
    });
    story.addEventListener('mouseleave', function () {
      cover.style.transform = '';
    });
  }

  /* ---------- Friendly nudge if buy links aren't set yet ---------- */
  document.querySelectorAll('.buy-link[href="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      link.style.transition = 'transform .2s';
      link.style.transform = 'translateY(-6px) scale(.98)';
      setTimeout(function () { link.style.transform = ''; }, 200);
    });
  });

})();
