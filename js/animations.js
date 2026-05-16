/* ============================================================
   ANIMATIONS.JS — Loading, typewriter, reveals, counters, GSAP
   ============================================================ */

(function () {

  /* ── LOADING SCREEN ──────────────────────────────────────── */
  function runLoadingScreen(onComplete) {
    const screen = document.getElementById('loading-screen');
    const bar    = document.getElementById('loading-bar');
    if (!screen || !bar) { onComplete(); return; }

    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        bar.style.width = '100%';
        setTimeout(() => {
          screen.classList.add('hidden');
          setTimeout(onComplete, 600);
        }, 350);
      }
      bar.style.width = p + '%';
    }, 75);
  }

  /* ── TYPEWRITER ─────────────────────────────────────────── */
  function typewrite(el, text, speed, onDone) {
    el.textContent = '';
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    el.appendChild(cursor);

    const tick = () => {
      if (i < text.length) {
        el.insertBefore(document.createTextNode(text[i]), cursor);
        i++;
        setTimeout(tick, speed + Math.random() * 25);
      } else {
        setTimeout(() => { cursor.style.display = 'none'; }, 1400);
        if (onDone) onDone();
      }
    };
    setTimeout(tick, 350);
  }

  /* ── COUNTER ────────────────────────────────────────────── */
  function animateCounter(el, target, duration) {
    const start    = performance.now();
    const numTarget = parseFloat(target);

    function fmt(v) {
      if (numTarget >= 1000000) return '+' + (v / 1000000).toFixed(1) + 'M';
      if (numTarget >= 100)     return '+' + Math.round(v);
      return '+' + Math.round(v);
    }

    const update = (now) => {
      const pct   = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(2, -10 * pct); /* easeOutExpo */
      el.textContent = fmt(numTarget * eased);
      if (pct < 1) requestAnimationFrame(update);
      else el.textContent = '+' + target;
    };
    requestAnimationFrame(update);
  }

  /* ── MANIFESTO ──────────────────────────────────────────── */
  function initManifesto() {
    const container = document.querySelector('.manifesto-words');
    if (!container) return;
    const words   = container.querySelectorAll('.manifesto-word');
    const divider = document.querySelector('.manifesto-line');

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        words.forEach((w, i) => setTimeout(() => w.classList.add('visible'), i * 115));
        if (divider) setTimeout(() => divider.classList.add('visible'), words.length * 115 + 200);
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(container);
  }

  /* ── TIMELINE ───────────────────────────────────────────── */
  function initTimeline() {
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setTimeout(() => item.classList.add('visible'), i * 90);
          obs.disconnect();
        }
      }, { threshold: 0.18 });
      obs.observe(item);
    });
  }

  /* ── COUNTERS ───────────────────────────────────────────── */
  function initCounters() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('visible');
        const valEl = el.querySelector('.numero-value');
        if (!valEl || el.dataset.counted) return;
        el.dataset.counted = '1';
        animateCounter(valEl, valEl.dataset.target, 1800);
        obs.unobserve(el);
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.numero-item').forEach(el => obs.observe(el));
  }

  /* ── ARGUMENTOS ─────────────────────────────────────────── */
  function initArgumentos() {
    document.querySelectorAll('.argumento').forEach((arg, i) => {
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setTimeout(() => arg.classList.add('visible'), i * 75);
          obs.disconnect();
        }
      }, { threshold: 0.1 });
      obs.observe(arg);
    });
  }

  /* ── GENERIC REVEALS ────────────────────────────────────── */
  function initReveals() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  /* ── NAVBAR ─────────────────────────────────────────────── */
  function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    setTimeout(() => nav.classList.add('visible'), 2600);
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });
  }

  /* ── HERO ENTRANCE ──────────────────────────────────────── */
  function initHero() {
    const logo     = document.querySelector('.hero-logo');
    const tagline  = document.querySelector('.hero-tagline');
    const subtitle = document.querySelector('.hero-subtitle');
    const divider  = document.querySelector('.hero-divider');
    const scroll   = document.querySelector('.hero-scroll');

    if (logo) {
      setTimeout(() => {
        logo.style.transition = 'opacity 1s ease, transform 1s ease';
        logo.style.opacity    = '1';
        logo.style.transform  = 'translateY(0)';
      }, 450);
    }

    if (tagline) {
      setTimeout(() => {
        typewrite(tagline, 'A EXPERIÊNCIA EM A&B QUE TRANSFORMA EVENTOS EM MEMÓRIAS', 50, () => {
          if (subtitle) setTimeout(() => { subtitle.style.transition = 'opacity 0.8s ease'; subtitle.style.opacity = '1'; }, 100);
          if (divider)  setTimeout(() => { divider.style.transition  = 'opacity 0.6s ease'; divider.style.opacity  = '1'; }, 300);
          if (scroll)   setTimeout(() => { scroll.style.transition   = 'opacity 0.6s ease'; scroll.style.opacity   = '1'; }, 600);
        });
      }, 850);
    }
  }

  /* ── ARENA PATHS ────────────────────────────────────────── */
  function initArena() {
    const paths = document.querySelectorAll('.route-path');
    if (!paths.length) return;
    paths.forEach(path => {
      const len = path.getTotalLength ? path.getTotalLength() : 200;
      path.style.strokeDasharray  = len;
      path.style.strokeDashoffset = len;
    });
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        paths.forEach((p, i) => {
          const len = p.getTotalLength ? p.getTotalLength() : 200;
          p.style.transition = `stroke-dashoffset ${1.4 + i * 0.3}s ${i * 0.18}s ease`;
          p.style.strokeDashoffset = '0';
        });
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    const arena = document.querySelector('.arena-diagram');
    if (arena) obs.observe(arena);
  }

  /* ── GSAP SCROLLTRIGGER ─────────────────────────────────── */
  function initGSAP() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    /* Parallax hero */
    gsap.to('.hero-content', {
      yPercent: 28, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });

    /* Stagger produto cards */
    gsap.utils.toArray('.produto-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.4)',
          delay: (i % 4) * 0.08,
          scrollTrigger: { trigger: card, start: 'top 90%' }
        }
      );
    });

    /* Event cards stagger */
    gsap.utils.toArray('.event-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          delay: (i % 3) * 0.1,
          scrollTrigger: { trigger: card, start: 'top 88%' }
        }
      );
    });

    /* Gallery section fade in */
    gsap.fromTo('#imagens .gallery-wrap',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '#imagens', start: 'top 80%' }
      }
    );
  }

  /* ── BOOT ────────────────────────────────────────────────── */
  function boot() {
    /* Pipocas iniciam ANTES da loading screen terminar */
    if (window.PopcornEngine) PopcornEngine.init();

    runLoadingScreen(() => {
      initNavbar();
      initHero();
      initManifesto();
      initTimeline();
      initCounters();
      initArgumentos();
      initReveals();
      initArena();
      initGSAP();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
