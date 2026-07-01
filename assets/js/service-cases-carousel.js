(function () {
  'use strict';

  const carousels = document.querySelectorAll('[data-service-carousel]');
  if (!carousels.length) return;

  carousels.forEach(function (carousel) {
    const track = carousel.querySelector('[data-service-track]');
    const prev = carousel.querySelector('[data-service-prev]');
    const next = carousel.querySelector('[data-service-next]');

    if (!track || !prev || !next) return;

    function getMaxScroll() {
      return Math.max(0, track.scrollWidth - track.clientWidth);
    }

    function getStep() {
      const card = track.querySelector('.service-case-card');
      if (!card) return Math.max(260, track.clientWidth * 0.78);

      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || 18) || 18;

      return card.getBoundingClientRect().width + gap;
    }

    function updateButtons() {
      const maxScroll = getMaxScroll();

      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft >= maxScroll - 4;

      prev.classList.toggle('is-disabled', prev.disabled);
      next.classList.toggle('is-disabled', next.disabled);

      prev.style.opacity = prev.disabled ? '0.45' : '1';
      next.style.opacity = next.disabled ? '0.45' : '1';
    }

    prev.addEventListener('click', function () {
      track.scrollBy({
        left: -getStep(),
        behavior: 'smooth'
      });
    });

    next.addEventListener('click', function () {
      track.scrollBy({
        left: getStep(),
        behavior: 'smooth'
      });
    });

    let ticking = false;

    track.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateButtons();
          ticking = false;
        });

        ticking = true;
      }
    }, { passive: true });

    /* Drag com mouse no desktop, sem travar o limite natural do scroll */
    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    let dragged = false;

    track.addEventListener('pointerdown', function (event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      isDown = true;
      dragged = false;
      startX = event.clientX;
      startScrollLeft = track.scrollLeft;

      track.classList.add('is-dragging');
      track.setPointerCapture?.(event.pointerId);
    });

    track.addEventListener('pointermove', function (event) {
      if (!isDown) return;

      const delta = event.clientX - startX;

      if (Math.abs(delta) > 4) {
        dragged = true;
        event.preventDefault();
      }

      track.scrollLeft = startScrollLeft - delta;
    });

    function finishDrag(event) {
      if (!isDown) return;

      isDown = false;
      track.classList.remove('is-dragging');
      track.releasePointerCapture?.(event.pointerId);

      window.requestAnimationFrame(updateButtons);
    }

    track.addEventListener('pointerup', finishDrag);
    track.addEventListener('pointercancel', finishDrag);
    track.addEventListener('pointerleave', finishDrag);

    track.addEventListener('click', function (event) {
      if (!dragged) return;
      event.preventDefault();
      event.stopPropagation();
      dragged = false;
    }, true);

    window.addEventListener('resize', function () {
      window.requestAnimationFrame(updateButtons);
    });

    updateButtons();
  });
})();
