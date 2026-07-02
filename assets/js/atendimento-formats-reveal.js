(function () {
  'use strict';

  var sections = document.querySelectorAll('#atendimento.atendimento-formats--compact-only');
  if (!sections.length) return;

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  sections.forEach(function (section) {
    section.classList.add('is-reveal-ready');

    if (reducedMotion) {
      section.classList.add('is-revealed');
      return;
    }

    var reveal = function () {
      section.classList.add('is-revealed');
    };

    if (!('IntersectionObserver' in window)) {
      reveal();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal();
          observer.unobserve(section);
        }
      });
    }, {
      root: null,
      threshold: 0.22,
      rootMargin: '0px 0px -10% 0px'
    });

    observer.observe(section);
  });
})();
