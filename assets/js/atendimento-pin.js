/* =========================================================
   Atendimento — desktop com ScrollTrigger / mobile estático
   - Desktop: mantém a animação pinada como estava
   - Celular/tablet: remove totalmente pin/fixed/sticky e scrub
   ========================================================= */
(function () {
  'use strict';

  const TRIGGER_ID = 'atendimento-scroll-desktop-pin';
  const DESKTOP_QUERY = '(min-width: 901px)';

  function initAtendimentoPin() {
    const section = document.querySelector('#atendimento.atendimento-pin, [data-atendimento-pin]');
    if (!section) return;

    const grid = section.querySelector('.atendimento-pin__grid');
    const right = section.querySelector('.atendimento-pin__right');
    const panelDemand = section.querySelector('[data-atendimento-panel="0"], .atendimento-panel--demand');
    const panelMonthly = section.querySelector('[data-atendimento-panel="1"], .atendimento-panel--monthly');
    const progressBar = section.querySelector('[data-atendimento-progress]');
    const leftCopy = section.querySelector('.atendimento-pin__copy');
    const monthlyBg = section.querySelector('.atendimento-panel__bg');

    if (!grid || !right || !panelDemand || !panelMonthly) return;

    const hasGSAP = !!(window.gsap && window.ScrollTrigger);
    const desktopMedia = window.matchMedia(DESKTOP_QUERY);
    let currentMode = null;
    let activeTrigger = null;
    let activeTimeline = null;
    let resizeTimer = null;

    function measureHeader() {
      const topbar = document.querySelector('.topbar');
      const header = document.querySelector('.site-header');
      const topbarH = topbar ? topbar.getBoundingClientRect().height : 0;
      const headerH = header ? header.getBoundingClientRect().height : 0;
      const total = Math.round(topbarH + headerH);

      section.style.setProperty('--topbar-h', `${Math.round(topbarH)}px`);
      section.style.setProperty('--header-h', `${Math.round(headerH)}px`);
      section.style.setProperty('--atendimento-header-h', `${total}px`);
      section.style.setProperty('--atendimento-safe-top', `${Math.max(total + 34, 96)}px`);
    }

    function killAtendimentoTriggers() {
      if (!window.ScrollTrigger) return;

      window.ScrollTrigger.getAll().forEach((st) => {
        const id = st.vars && st.vars.id ? String(st.vars.id) : '';
        const trigger = st.trigger;
        const isThisSection = trigger === section || trigger === grid || (trigger && section.contains(trigger));

        if (id.includes('atendimento') || isThisSection) {
          st.kill(true);
        }
      });

      activeTrigger = null;
      activeTimeline = null;
    }

    function clearRuntimeStyles() {
      section.classList.remove('is-pin-active', 'is-manual-fixed', 'is-manual-after', 'is-mobile-static', 'is-gsap-ready');

      [section, grid, right, panelDemand, panelMonthly, leftCopy, monthlyBg, progressBar].forEach((el) => {
        if (!el || !window.gsap) return;
        window.gsap.set(el, { clearProps: 'all' });
      });

      // Limpeza extra para estilos inline criados por tentativas antigas de pin/fixed.
      [section, grid].forEach((el) => {
        if (!el) return;
        el.style.position = '';
        el.style.top = '';
        el.style.left = '';
        el.style.right = '';
        el.style.bottom = '';
        el.style.width = '';
        el.style.height = '';
        el.style.minHeight = '';
        el.style.maxHeight = '';
        el.style.zIndex = '';
        el.style.transform = '';
      });
    }

    function setMobileStatic() {
      currentMode = 'mobile';
      killAtendimentoTriggers();
      clearRuntimeStyles();
      measureHeader();

      section.classList.add('is-mobile-static');
      right.classList.remove('is-monthly');
      right.classList.add('is-demand');
      panelDemand.classList.add('is-active');
      panelMonthly.classList.add('is-active');

      // Garante que no celular não exista nenhum comportamento preso/fixo.
      section.style.position = 'relative';
      section.style.height = 'auto';
      section.style.minHeight = '0px';
      section.style.overflow = 'visible';

      grid.style.position = 'relative';
      grid.style.top = 'auto';
      grid.style.left = 'auto';
      grid.style.right = 'auto';
      grid.style.bottom = 'auto';
      grid.style.height = 'auto';
      grid.style.minHeight = '0px';
      grid.style.transform = 'none';

      panelDemand.style.opacity = '1';
      panelDemand.style.visibility = 'visible';
      panelDemand.style.transform = 'none';
      panelDemand.style.pointerEvents = 'auto';

      panelMonthly.style.opacity = '1';
      panelMonthly.style.visibility = 'visible';
      panelMonthly.style.transform = 'none';
      panelMonthly.style.pointerEvents = 'auto';

      if (progressBar) progressBar.style.transform = 'scaleX(0)';

      if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    }

    function getDistance() {
      return Math.round(Math.max(window.innerHeight * 0.82, 680));
    }

    function setDesktopAnimated() {
      if (!hasGSAP) {
        setMobileStatic();
        return;
      }

      currentMode = 'desktop';
      const { gsap, ScrollTrigger } = window;
      gsap.registerPlugin(ScrollTrigger);

      killAtendimentoTriggers();
      clearRuntimeStyles();
      measureHeader();

      const preload = new Image();
      preload.decoding = 'async';
      preload.src = 'assets/img/hero-bg.jpg';

      section.classList.add('is-gsap-ready');

      gsap.set([section, grid], { clearProps: 'transform' });
      gsap.set(grid, { force3D: true });
      gsap.set([panelDemand, panelMonthly], {
        force3D: true,
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d'
      });

      gsap.set(panelDemand, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        zIndex: 4,
        pointerEvents: 'auto'
      });

      gsap.set(panelMonthly, {
        autoAlpha: 0,
        y: 30,
        scale: 1.01,
        zIndex: 5,
        pointerEvents: 'none'
      });

      if (leftCopy) gsap.set(leftCopy, { y: 0, force3D: true });
      if (monthlyBg) gsap.set(monthlyBg, { scale: 1.07, xPercent: -1.2, force3D: true });
      if (progressBar) gsap.set(progressBar, { scaleX: 0, transformOrigin: 'left center', force3D: true });

      panelDemand.classList.add('is-active');
      panelMonthly.classList.remove('is-active');
      right.classList.add('is-demand');
      right.classList.remove('is-monthly');

      const tl = gsap.timeline({ defaults: { ease: 'none' } });
      activeTimeline = tl;

      if (progressBar) tl.to(progressBar, { scaleX: 1, duration: 1 }, 0);
      if (leftCopy) tl.to(leftCopy, { y: -6, duration: 0.45 }, 0.24);

      tl.to(panelDemand, {
        autoAlpha: 0,
        y: -22,
        scale: 0.994,
        duration: 0.34
      }, 0.27);

      tl.to(panelMonthly, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.34
      }, 0.27);

      if (monthlyBg) {
        tl.to(monthlyBg, {
          scale: 1.025,
          xPercent: 0,
          duration: 0.82
        }, 0);
      }

      const setMonthlyState = (active) => {
        const alreadyMonthly = right.classList.contains('is-monthly');
        if (active === alreadyMonthly) return;

        right.classList.toggle('is-monthly', active);
        right.classList.toggle('is-demand', !active);
        panelMonthly.classList.toggle('is-active', active);
        panelDemand.classList.toggle('is-active', !active);
        panelMonthly.style.pointerEvents = active ? 'auto' : 'none';
        panelDemand.style.pointerEvents = active ? 'none' : 'auto';
      };

      activeTrigger = ScrollTrigger.create({
        id: TRIGGER_ID,
        trigger: section,
        animation: tl,
        start: 'top top',
        end: () => `+=${getDistance()}`,
        scrub: 0.55,
        pin: section,
        pinType: 'fixed',
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 30,
        fastScrollEnd: false,
        onEnter: () => section.classList.add('is-pin-active'),
        onEnterBack: () => section.classList.add('is-pin-active'),
        onLeave: () => section.classList.remove('is-pin-active'),
        onLeaveBack: () => section.classList.remove('is-pin-active'),
        onRefreshInit: measureHeader,
        onRefresh: measureHeader,
        onUpdate: (self) => {
          setMonthlyState(self.progress >= 0.34);
        }
      });

      window.__mespAtendimento = {
        version: 'mobile-disabled-desktop-pin-v46',
        section,
        grid,
        right,
        panelDemand,
        panelMonthly,
        trigger: activeTrigger,
        timeline: activeTimeline
      };

      window.__mespAtendimentoDebug = function () {
        const next = section.nextElementSibling;
        const sectionRect = section.getBoundingClientRect();
        const gridRect = grid.getBoundingClientRect();
        const spacer = section.parentElement && section.parentElement.classList.contains('pin-spacer')
          ? section.parentElement
          : null;

        const data = {
          version: 'mobile-disabled-desktop-pin-v46',
          mode: currentMode,
          desktopMedia: desktopMedia.matches,
          scrollY: Math.round(window.scrollY),
          viewportW: window.innerWidth,
          viewportH: window.innerHeight,
          section: {
            position: getComputedStyle(section).position,
            offsetHeight: section.offsetHeight,
            rectTop: Math.round(sectionRect.top),
            rectBottom: Math.round(sectionRect.bottom),
            rectHeight: Math.round(sectionRect.height)
          },
          grid: {
            position: getComputedStyle(grid).position,
            offsetHeight: grid.offsetHeight,
            rectTop: Math.round(gridRect.top),
            rectBottom: Math.round(gridRect.bottom),
            rectHeight: Math.round(gridRect.height)
          },
          spacer: spacer ? {
            offsetHeight: spacer.offsetHeight,
            rectHeight: Math.round(spacer.getBoundingClientRect().height),
            paddingBottom: getComputedStyle(spacer).paddingBottom
          } : null,
          nextSectionTop: next ? Math.round(next.getBoundingClientRect().top) : null,
          trigger: activeTrigger ? {
            progress: Number(activeTrigger.progress.toFixed(3)),
            start: activeTrigger.start,
            end: activeTrigger.end,
            isActive: activeTrigger.isActive,
            pin: !!activeTrigger.pin
          } : null
        };

        console.log('[MESP atendimento debug]', data);
        return data;
      };

      const refresh = () => {
        if (currentMode !== 'desktop') return;
        measureHeader();
        ScrollTrigger.refresh();
      };

      window.setTimeout(refresh, 180);
      window.addEventListener('load', refresh, { once: true });
    }

    function applyMode() {
      const shouldDesktop = desktopMedia.matches;
      const nextMode = shouldDesktop ? 'desktop' : 'mobile';
      if (currentMode === nextMode) return;

      if (shouldDesktop) {
        setDesktopAnimated();
      } else {
        setMobileStatic();
      }
    }

    applyMode();

    if (desktopMedia.addEventListener) {
      desktopMedia.addEventListener('change', applyMode);
    } else if (desktopMedia.addListener) {
      desktopMedia.addListener(applyMode);
    }

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const nextMode = desktopMedia.matches ? 'desktop' : 'mobile';
        if (nextMode !== currentMode) {
          applyMode();
        } else if (currentMode === 'desktop' && window.ScrollTrigger) {
          measureHeader();
          window.ScrollTrigger.refresh();
        }
      }, 180);
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAtendimentoPin, { once: true });
  } else {
    initAtendimentoPin();
  }
})();
