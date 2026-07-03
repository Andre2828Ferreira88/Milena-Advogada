/* =========================================================
   FAQ ACCORDION V70
   Mostra apenas perguntas; resposta abre no clique.
   Seguro contra reinicialização e contra CSS antigo.
   ========================================================= */

(function () {
  function initFaqAccordion() {
    const faqSections = Array.from(document.querySelectorAll('#faq'));
    if (!faqSections.length) return;

    faqSections.forEach((faq, sectionIndex) => {
      const items = Array.from(faq.querySelectorAll('.faq-item'));
      if (!items.length) return;

      faq.classList.add('faq-ready');

      items.forEach((item, index) => {
        if (item.dataset.faqReady === 'true') {
          const answerReady = item.querySelector('.faq-answer');
          if (answerReady && !item.classList.contains('is-open')) {
            answerReady.style.setProperty('max-height', '0px', 'important');
            answerReady.style.setProperty('--faq-answer-height', '0px');
          }
          return;
        }

        const title = item.querySelector('h3');
        const answerText = item.querySelector('p');

        if (!title || !answerText) return;

        item.dataset.faqReady = 'true';
        item.classList.remove('is-open');

        const questionText = title.textContent.trim();
        const answerId = answerText.id || `faq-answer-${sectionIndex + 1}-${index + 1}`;

        const button = document.createElement('button');
        const label = document.createElement('span');
        const icon = document.createElement('span');

        answerText.id = answerId;

        const answerWrap = document.createElement('div');
        answerWrap.className = 'faq-answer';
        answerWrap.id = answerId;
        answerText.removeAttribute('id');

        answerText.parentNode.insertBefore(answerWrap, answerText);
        answerWrap.appendChild(answerText);

        button.type = 'button';
        button.className = 'faq-trigger';
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', answerId);

        label.textContent = questionText;
        icon.className = 'faq-icon';
        icon.setAttribute('aria-hidden', 'true');

        button.appendChild(label);
        button.appendChild(icon);

        title.textContent = '';
        title.appendChild(button);

        answerWrap.style.setProperty('max-height', '0px', 'important');
        answerWrap.style.setProperty('--faq-answer-height', '0px');

        button.addEventListener('click', () => {
          const isOpen = item.classList.contains('is-open');

          items.forEach((other) => {
            if (other === item) return;

            const otherAnswer = other.querySelector('.faq-answer');
            const otherButton = other.querySelector('.faq-trigger');

            other.classList.remove('is-open');

            if (otherAnswer) {
              otherAnswer.style.setProperty('max-height', '0px', 'important');
              otherAnswer.style.setProperty('--faq-answer-height', '0px');
            }
            if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
          });

          if (isOpen) {
            item.classList.remove('is-open');
            answerWrap.style.setProperty('max-height', '0px', 'important');
        answerWrap.style.setProperty('--faq-answer-height', '0px');
            button.setAttribute('aria-expanded', 'false');
            return;
          }

          item.classList.add('is-open');
          const answerHeight = `${answerWrap.scrollHeight}px`;
          answerWrap.style.setProperty('--faq-answer-height', answerHeight);
          answerWrap.style.setProperty('max-height', answerHeight, 'important');
          button.setAttribute('aria-expanded', 'true');
        });
      });
    });
  }

  function refreshOpenAnswers() {
    document.querySelectorAll('#faq .faq-item.is-open .faq-answer').forEach((answer) => {
      const answerHeight = `${answer.scrollHeight}px`;
      answer.style.setProperty('--faq-answer-height', answerHeight);
      answer.style.setProperty('max-height', answerHeight, 'important');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFaqAccordion);
  } else {
    initFaqAccordion();
  }

  window.addEventListener('resize', refreshOpenAnswers, { passive: true });
})();
