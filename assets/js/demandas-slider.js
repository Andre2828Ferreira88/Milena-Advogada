/* =========================================================
   DEMANDAS SLIDER — Áreas de atuação
   Sem GSAP. Slider vertical simples, leve e isolado.
   ========================================================= */

(function () {
  "use strict";

  function initDemandasSlider() {
    const section = document.querySelector("#demandas.demandas-slider");
    if (!section) return;

    const slides = Array.from(section.querySelectorAll("[data-demandas-slide]"));
    const prevBtn = section.querySelector("[data-demandas-prev]");
    const nextBtn = section.querySelector("[data-demandas-next]");
    const current = section.querySelector("[data-demandas-current]");

    if (!slides.length || !prevBtn || !nextBtn) return;

    let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
    if (activeIndex < 0) activeIndex = 0;

    let isChanging = false;

    function pad(num) {
      return String(num).padStart(2, "0");
    }

    function render(nextIndex) {
      if (isChanging) return;

      const total = slides.length;
      const normalizedIndex = (nextIndex + total) % total;
      if (normalizedIndex === activeIndex) return;

      isChanging = true;
      activeIndex = normalizedIndex;

      slides.forEach((slide, index) => {
        const isActive = index === activeIndex;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", isActive ? "false" : "true");
      });

      if (current) current.textContent = pad(activeIndex + 1);

      window.setTimeout(() => {
        isChanging = false;
      }, 390);
    }

    function goPrev() {
      render(activeIndex - 1);
    }

    function goNext() {
      render(activeIndex + 1);
    }

    prevBtn.addEventListener("click", goPrev);
    nextBtn.addEventListener("click", goNext);

    section.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        goPrev();
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        goNext();
      }
    });

    section.setAttribute("tabindex", "-1");

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", isActive ? "false" : "true");
    });

    if (current) current.textContent = pad(activeIndex + 1);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDemandasSlider);
  } else {
    initDemandasSlider();
  }
})();
