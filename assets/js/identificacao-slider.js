(function () {
  "use strict";

  const init = () => {
    const slider = document.querySelector("[data-identificacao-slider]");
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll("[data-identificacao-slide]"));
    const prev = slider.querySelector("[data-identificacao-prev]");
    const next = slider.querySelector("[data-identificacao-next]");
    const current = slider.querySelector("[data-identificacao-current]");

    if (!slides.length || !prev || !next) return;

    let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    if (index < 0) index = 0;

    const format = (value) => String(value).padStart(2, "0");

    const render = (nextIndex) => {
      index = (nextIndex + slides.length) % slides.length;

      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === index;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
      });

      if (current) current.textContent = format(index + 1);
    };

    prev.addEventListener("click", () => render(index - 1));
    next.addEventListener("click", () => render(index + 1));

    slider.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        render(index - 1);
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        render(index + 1);
      }
    });

    slider.setAttribute("tabindex", "0");
    render(index);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
