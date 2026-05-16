/* ============================================================
   POPCORN ENGINE — Canvas 2D com imagem real "pipcoa caindo.png"
   Pipocas caem logo ao abrir a tela, reagem ao scroll e mouse
   ============================================================ */

const PopcornEngine = (function () {

  let canvas, ctx;
  const img = new Image();
  let pieces = [];
  let scrollY = 0, lastScrollY = 0, scrollVelocity = 0;
  let mouseX = -9999, mouseY = -9999;
  let animId;
  let ticks = 0;
  let ready = false;

  const isMobile = () => window.innerWidth <= 768;

  function count() { return isMobile() ? 22 : 48; }

  /* ── SPAWN ───────────────────────────────────────────────── */
  function spawn(randomY) {
    const w = canvas.width;
    const h = canvas.height;
    return {
      x:        Math.random() * w,
      y:        randomY ? Math.random() * h * 1.5 : -40 - Math.random() * 160,
      size:     28 + Math.random() * 44,
      speed:    0.55 + Math.random() * 1.1,
      rot:      Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.025,
      oscAmp:   14 + Math.random() * 28,
      oscFreq:  0.004 + Math.random() * 0.006,
      oscOff:   Math.random() * Math.PI * 2,
      alpha:    0.55 + Math.random() * 0.40,
      drift:    (Math.random() - 0.5) * 0.18,
    };
  }

  function spawnAll() {
    pieces = [];
    const n = count();
    for (let i = 0; i < n; i++) {
      pieces.push(spawn(true)); /* distribuídas aleatoriamente na tela */
    }
  }

  /* ── INIT ─────────────────────────────────────────────────── */
  function init() {
    canvas = document.getElementById('popcorn-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resize();

    /* Carrega imagem — pipocas aparecem assim que a imagem carregar */
    img.src = 'assets/pipcoa caindo.png';
    img.onload = () => {
      ready = true;
      spawnAll();
      animate();
    };
    img.onerror = () => {
      /* fallback: desenha formas simples se imagem falhar */
      ready = 'fallback';
      spawnAll();
      animate();
    };

    window.addEventListener('resize',    resize,      { passive: true });
    window.addEventListener('scroll',    onScroll,    { passive: true });
    window.addEventListener('mousemove', onMouse,     { passive: true });
    window.addEventListener('touchmove', onTouch,     { passive: true });
  }

  /* ── ANIMATE ─────────────────────────────────────────────── */
  function animate() {
    animId = requestAnimationFrame(animate);
    ticks++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* velocidade do scroll */
    scrollVelocity  = (scrollY - lastScrollY) * 0.12;
    lastScrollY     = scrollY;
    const speedBoost = 1 + Math.min(Math.abs(scrollVelocity) * 2.5, 3);

    pieces.forEach(p => {
      /* queda */
      p.y += p.speed * speedBoost;
      /* deriva horizontal suave */
      p.x += p.drift + Math.sin(ticks * p.oscFreq + p.oscOff) * p.oscAmp * 0.04;
      /* rotação */
      p.rot += p.rotSpeed;

      /* repulsão suave do mouse */
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90 && dist > 0.1) {
        const force = (90 - dist) / 90 * 0.025;
        p.x += (dx / dist) * force * 60;
        p.y += (dy / dist) * force * 60;
      }

      /* reset ao sair pela base */
      if (p.y > canvas.height + 60) {
        Object.assign(p, spawn(false));
      }
      /* wrap horizontal */
      if (p.x < -60) p.x = canvas.width + 50;
      if (p.x > canvas.width + 60) p.x = -50;

      /* desenha */
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);

      if (ready === true) {
        /* imagem real */
        ctx.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size);
      } else {
        /* fallback: forma orgânica amarela */
        ctx.fillStyle = '#FFC107';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.45, p.size * 0.32, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.ellipse(-p.size*0.12, -p.size*0.1, p.size * 0.28, p.size * 0.22, 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }

  /* ── EVENTOS ─────────────────────────────────────────────── */
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    if (ready) spawnAll();
  }

  function onScroll()      { scrollY = window.scrollY; }
  function onMouse(e)      { mouseX = e.clientX; mouseY = e.clientY; }
  function onTouch(e)      { if (e.touches[0]) { mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; } }

  return { init };

})();
