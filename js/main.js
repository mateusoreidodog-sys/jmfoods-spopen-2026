/* ============================================================
   MAIN.JS — Scroll suave, navbar, carrossel de imagens, interações
   ============================================================ */

(function () {

  /* ── SMOOTH SCROLL ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── CTA BUTTON ─────────────────────────────────────────── */
  const ctaBtn = document.querySelector('.cta-button');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.open('https://web.whatsapp.com/send?phone=5511953862539&entry_point=wa_pages&type=custom_url', '_blank');
    });
  }

  /* ── 3D TILT em event-cards ─────────────────────────────── */
  document.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 16;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 16;
      this.style.transform = `translateY(-6px) perspective(700px) rotateX(${-y*0.35}deg) rotateY(${x*0.35}deg)`;
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = '';
      this.style.transition = 'transform 0.4s ease';
    });
  });

  /* ── CARROSSEL DE IMAGENS ───────────────────────────────── */
  (function initGallery() {
    const track  = document.getElementById('gallery-track');
    const dots   = document.querySelectorAll('.gallery-dot');
    const btnPrev = document.getElementById('gallery-prev');
    const btnNext = document.getElementById('gallery-next');
    if (!track) return;

    const slides  = track.querySelectorAll('.gallery-slide');
    if (!slides.length) return;

    let current  = 0;
    let autoTimer = null;
    let perView   = getPerView();

    function getPerView() {
      if (window.innerWidth <= 768)  return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function maxIndex() {
      return Math.max(0, slides.length - perView);
    }

    function goTo(idx) {
      perView = getPerView();
      const max = maxIndex();
      current = Math.min(Math.max(idx, 0), max);

      const slideW  = slides[0].getBoundingClientRect().width;
      const gap     = 24; /* 1.5rem */
      const offset  = current * (slideW + gap);
      track.style.transform = `translateX(-${offset}px)`;

      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function next() { goTo(current + 1 >= slides.length - perView + 1 ? 0 : current + 1); }
    function prev() { goTo(current - 1 < 0 ? maxIndex() : current - 1); }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(next, 3800);
    }
    function stopAuto() { clearInterval(autoTimer); }

    /* Dots */
    dots.forEach((d, i) => {
      d.addEventListener('click', () => { goTo(i); startAuto(); });
    });

    /* Setas */
    if (btnPrev) btnPrev.addEventListener('click', () => { prev(); startAuto(); });
    if (btnNext) btnNext.addEventListener('click', () => { next(); startAuto(); });

    /* Pause on hover */
    track.parentElement?.addEventListener('mouseenter', stopAuto);
    track.parentElement?.addEventListener('mouseleave', startAuto);

    /* Swipe touch */
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); startAuto(); }
    });

    window.addEventListener('resize', () => { perView = getPerView(); goTo(current); });

    /* Init dots */
    if (dots.length) dots[0].classList.add('active');
    startAuto();
  })();

  /* ── MODAL VÍDEO GALERIA ────────────────────────────────── */
  window.openVideoModal = function () {
    const modal = document.getElementById('video-modal');
    const mv    = document.getElementById('modal-video');
    if (!modal || !mv) return;
    modal.classList.add('open');
    mv.currentTime = 0;
    mv.play();
    document.body.style.overflow = 'hidden';
  };

  window.closeVideoModal = function (e) {
    /* Fecha ao clicar no backdrop ou no botão X */
    if (e && e.currentTarget !== e.target && !e.target.closest('.video-modal-close')) return;
    const modal = document.getElementById('video-modal');
    const mv    = document.getElementById('modal-video');
    if (!modal) return;
    modal.classList.remove('open');
    if (mv) mv.pause();
    document.body.style.overflow = '';
  };

  /* Fechar com ESC */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('video-modal');
      const mv    = document.getElementById('modal-video');
      if (modal) modal.classList.remove('open');
      if (mv)    mv.pause();
      document.body.style.overflow = '';
    }
  });

  /* ── CURSOR GLOW (desktop) ─────────────────────────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = [
      'position:fixed', 'pointer-events:none', 'z-index:9997',
      'width:280px', 'height:280px', 'border-radius:50%',
      'background:radial-gradient(circle,rgba(201,168,76,0.06) 0%,transparent 70%)',
      'transform:translate(-50%,-50%)',
      'top:0', 'left:0', 'transition:opacity 0.3s'
    ].join(';');
    document.body.appendChild(glow);

    let gx = 0, gy = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; }, { passive: true });
    (function moveGlow() {
      gx += (cx - gx) * 0.1;
      gy += (cy - gy) * 0.1;
      glow.style.left = gx + 'px';
      glow.style.top  = gy + 'px';
      requestAnimationFrame(moveGlow);
    })();
  }

})();
