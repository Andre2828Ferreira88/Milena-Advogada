/* ═══════════════════════════════════════════════════
   MESP Advocacia — Enhancements
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  const WA_NUM = '5511933082223';
  function waLink(msg) {
    return 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(msg);
  }

  /* ─────────────────────────────────────────────
     1. BARRA DE PROGRESSO DE SCROLL
     ───────────────────────────────────────────── */
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = Math.min(pct, 100).toFixed(1) + '%';
    }, { passive: true });
  }


  /* ─────────────────────────────────────────────
     2. BARRA CTA MOBILE — aparece após sair do hero
     ───────────────────────────────────────────── */
  const waBottom = document.getElementById('waBottom');
  const heroSection = document.querySelector('.hero');
  if (waBottom && heroSection) {
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        waBottom.classList.toggle('is-visible', !e.isIntersecting);
      });
    }, { threshold: 0 });
    obs.observe(heroSection);
  }


  /* ─────────────────────────────────────────────
     3. TYPING ANIMATION — hero subtitle
     ───────────────────────────────────────────── */
  const typingEl = document.getElementById('typingText');
  if (typingEl) {
    const phrases = [
      'em demandas pontuais.',
      'em suporte esporádico.',
      'em assessoria contínua.',
      'com segurança e estratégia.'
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let paused = false;

    function type() {
      if (paused) return;
      const current = phrases[phraseIdx];

      if (!deleting) {
        charIdx++;
        typingEl.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          paused = true;
          setTimeout(function () { deleting = true; paused = false; tick(); }, 2200);
          return;
        }
      } else {
        charIdx--;
        typingEl.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      }
      tick();
    }

    function tick() {
      const delay = deleting ? 45 : 80;
      setTimeout(type, delay);
    }

    // start after initial render
    setTimeout(tick, 1000);
  }


  /* ─────────────────────────────────────────────
     4. FEEDBACK VISUAL — formulário do hero
     ───────────────────────────────────────────── */
  const heroForm = document.getElementById('heroForm');
  if (heroForm) {
    function validateField(input) {
      const wrap = input.closest('.input-wrap');
      if (!wrap) return true;
      const valid = input.value.trim().length >= 2;
      wrap.classList.toggle('is-valid', valid);
      wrap.classList.toggle('is-error', !valid);
      return valid;
    }

    ['fieldNome', 'fieldWa'].forEach(function (id) {
      const input = document.getElementById(id);
      if (!input) return;
      input.addEventListener('input', function () {
        if (input.closest('.input-wrap').classList.contains('is-error')) {
          validateField(input);
        }
      });
      input.addEventListener('blur', function () {
        if (input.value.trim()) validateField(input);
      });
    });

    heroForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const nomeInput = document.getElementById('fieldNome');
      const waInput   = document.getElementById('fieldWa');
      const v1 = validateField(nomeInput);
      const v2 = validateField(waInput);
      if (!v1 || !v2) return;

      const msg = 'Olá! Me chamo ' + nomeInput.value.trim() +
                  ' (' + waInput.value.trim() + ') e gostaria de informações sobre o atendimento jurídico.';
      window.open(waLink(msg), '_blank');
    });
  }


  /* ─────────────────────────────────────────────
     5. CONTADORES ANIMADOS — seção sobre
     ───────────────────────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length) {
    function animateCounter(el) {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 1400;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(ease * target);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    const statsObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCounter(e.target);
          statsObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(function (el) { statsObs.observe(el); });
  }


  /* ─────────────────────────────────────────────
     6. CURSOR PERSONALIZADO (desktop)
     ───────────────────────────────────────────── */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className  = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    }, { passive: true });

    // ring follows with smooth lag
    function animateRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // scale ring on interactive elements
    document.querySelectorAll('a, button, .da-cta, .bot-opt').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        ring.style.width  = '44px';
        ring.style.height = '44px';
        ring.style.borderColor = 'var(--brand-2)';
        dot.style.opacity = '0.5';
      });
      el.addEventListener('mouseleave', function () {
        ring.style.width  = '32px';
        ring.style.height = '32px';
        ring.style.borderColor = 'rgba(91,44,85,.45)';
        dot.style.opacity = '1';
      });
    });
  }


  /* ─────────────────────────────────────────────
     7. REVEAL COM DIREÇÃO — aplicar classes por seção
     ───────────────────────────────────────────── */
  // Authority: copy entra da esquerda, foto da direita
  const authCopy  = document.querySelector('.authority-grid > .reveal:first-child');
  const authPhoto = document.querySelector('.authority-photo');
  if (authCopy)  { authCopy.classList.remove('reveal');  authCopy.classList.add('reveal-left'); }
  if (authPhoto) { authPhoto.classList.remove('reveal'); authPhoto.classList.add('reveal-right'); }

  // Split section: col-left da esquerda, col-right da direita
  document.querySelectorAll('.split-col--left').forEach(function (el) {
    el.classList.add('reveal-left');
  });
  document.querySelectorAll('.split-col--right').forEach(function (el) {
    el.classList.add('reveal-right');
  });

  // Testimonial cards: scale
  document.querySelectorAll('.testimonial-card').forEach(function (el) {
    el.classList.add('reveal-scale');
  });

  // DA cards: alternating
  document.querySelectorAll('.da-card').forEach(function (el, i) {
    el.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
  });

  // Observe directional reveals
  const dirObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('reveal--visible');
        dirObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal-left, .reveal-right, .reveal-scale').forEach(function (el) {
    dirObs.observe(el);
  });


  /* ─────────────────────────────────────────────
     TESTIMONIALS DOTS — mobile pagination
     ───────────────────────────────────────────── */
  (function () {
    const grid = document.querySelector('.testimonials-grid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.testimonial-card');
    if (cards.length < 2) return;

    // criar container de dots abaixo do grid
    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'testimonial-dots';
    cards.forEach(function (_, i) {
      const dot = document.createElement('span');
      if (i === 0) dot.className = 'active';
      dotsWrap.appendChild(dot);
    });
    grid.parentNode.insertBefore(dotsWrap, grid.nextSibling);

    // atualizar dot ativo no scroll
    grid.addEventListener('scroll', function () {
      const scrollLeft = grid.scrollLeft;
      const cardWidth = cards[0].getBoundingClientRect().width + 14; // gap
      const idx = Math.round(scrollLeft / cardWidth);
      dotsWrap.querySelectorAll('span').forEach(function (dot, i) {
        dot.classList.toggle('active', i === idx);
      });
    }, { passive: true });
  })();


})();