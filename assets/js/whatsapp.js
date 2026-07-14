const WHATSAPP_NUMBER = "5511933082223"; // ajuste se necessário

const DEFAULT_BASE_MESSAGE =
  "Olá! Vim pelo anúncio de Direito Trabalhista Empresarial e gostaria de orientação para uma demanda da minha empresa.";

function getBaseMessage(){
  return (document.body && document.body.dataset && document.body.dataset.whatsappMessage)
    ? document.body.dataset.whatsappMessage.trim()
    : DEFAULT_BASE_MESSAGE;
}

function waLink(text){
  const msg = encodeURIComponent(text);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

function initWhatsApp(){
  const ensureContactModal = () => {
    let modal = document.querySelector('[data-wa-modal]');
    if (modal) return modal;

    const style = document.createElement('style');
    style.setAttribute('data-wa-modal-style', 'true');
    style.textContent = `
      .wa-lead-modal {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: grid;
        place-items: center;
        padding: 18px;
        background: rgba(15, 10, 24, 0.55);
        backdrop-filter: blur(12px);
        opacity: 0;
        pointer-events: none;
        transition: opacity .25s ease;
      }

      .wa-lead-modal.is-open {
        opacity: 1;
        pointer-events: auto;
      }

      .wa-lead-modal__card {
        width: min(94vw, 430px);
        border: 1px solid rgba(111, 55, 168, 0.18);
        border-radius: 24px;
        padding: 26px;
        background: linear-gradient(145deg, rgba(255,255,255,.98), rgba(248,244,252,.96));
        box-shadow: 0 26px 80px rgba(28, 16, 44, 0.24);
        transform: translateY(18px) scale(.98);
        transition: transform .25s ease;
      }

      .wa-lead-modal.is-open .wa-lead-modal__card {
        transform: translateY(0) scale(1);
      }

      .wa-lead-modal__eyebrow {
        margin: 0 0 8px;
        color: #6f37a8;
        font-size: .76rem;
        font-weight: 800;
        letter-spacing: .12em;
        text-transform: uppercase;
      }

      .wa-lead-modal__title {
        margin: 0;
        color: #1f1730;
        font-size: clamp(1.28rem, 4.6vw, 1.8rem);
        line-height: 1.08;
        letter-spacing: -.04em;
      }

      .wa-lead-modal__text {
        margin: 12px 0 20px;
        color: rgba(31, 23, 48, .72);
        font-size: .96rem;
        line-height: 1.55;
      }

      .wa-lead-modal__grid {
        display: grid;
        gap: 12px;
      }

      .wa-lead-modal__field {
        display: grid;
        gap: 7px;
      }

      .wa-lead-modal__field span {
        color: rgba(31, 23, 48, .72);
        font-size: .82rem;
        font-weight: 700;
      }

      .wa-lead-modal__field input {
        width: 100%;
        min-height: 48px;
        border: 1px solid rgba(31, 23, 48, .14);
        border-radius: 14px;
        padding: 0 14px;
        color: #1f1730;
        background: #fff;
        font: inherit;
        outline: none;
        transition: border-color .2s ease, box-shadow .2s ease;
      }

      .wa-lead-modal__field input:focus {
        border-color: rgba(111, 55, 168, .55);
        box-shadow: 0 0 0 4px rgba(111, 55, 168, .10);
      }

      .wa-lead-modal__actions {
        display: grid;
        grid-template-columns: 1fr 1.45fr;
        gap: 10px;
        margin-top: 18px;
      }

      .wa-lead-modal__btn {
        min-height: 48px;
        border: 0;
        border-radius: 999px;
        padding: 0 16px;
        cursor: pointer;
        font: inherit;
        font-weight: 800;
      }

      .wa-lead-modal__btn--ghost {
        color: rgba(31, 23, 48, .72);
        background: rgba(31, 23, 48, .06);
      }

      .wa-lead-modal__btn--primary {
        color: #fff;
        background: linear-gradient(135deg, #6f37a8, #4b1f7d);
        box-shadow: 0 14px 32px rgba(111, 55, 168, .25);
      }

      .wa-lead-modal__error {
        display: none;
        margin: 10px 0 0;
        color: #b42318;
        font-size: .86rem;
        font-weight: 700;
      }

      .wa-lead-modal.has-error .wa-lead-modal__error {
        display: block;
      }

      @media (max-width: 460px) {
        .wa-lead-modal__card { padding: 22px; border-radius: 20px; }
        .wa-lead-modal__actions { grid-template-columns: 1fr; }
      }
    `;
    document.head.appendChild(style);

    modal = document.createElement('div');
    modal.className = 'wa-lead-modal';
    modal.setAttribute('data-wa-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="wa-lead-modal__card" role="dialog" aria-modal="true" aria-labelledby="waLeadTitle">
        <p class="wa-lead-modal__eyebrow">Atendimento pelo WhatsApp</p>
        <h2 class="wa-lead-modal__title" id="waLeadTitle">Antes de continuar, informe seus dados</h2>
        <p class="wa-lead-modal__text">Preencha nome e telefone para iniciar a conversa com uma mensagem mais organizada.</p>
        <form class="wa-lead-modal__form" novalidate>
          <div class="wa-lead-modal__grid">
            <label class="wa-lead-modal__field">
              <span>Nome</span>
              <input name="nome" type="text" placeholder="Seu nome" autocomplete="name" required>
            </label>
            <label class="wa-lead-modal__field">
              <span>Telefone</span>
              <input name="telefone" type="tel" placeholder="(00) 00000-0000" autocomplete="tel" required>
            </label>
          </div>
          <p class="wa-lead-modal__error">Preencha nome e telefone para continuar.</p>
          <div class="wa-lead-modal__actions">
            <button class="wa-lead-modal__btn wa-lead-modal__btn--ghost" type="button" data-wa-close>Cancelar</button>
            <button class="wa-lead-modal__btn wa-lead-modal__btn--primary" type="submit">Chamar no WhatsApp</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    const close = () => {
      modal.classList.remove('is-open', 'has-error');
      modal.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('wa-modal-open');
    };

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('[data-wa-close]')) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });

    modal._waClose = close;
    return modal;
  };

  const openContactModal = () => {
    const modal = ensureContactModal();
    const form = modal.querySelector('.wa-lead-modal__form');
    const nomeInput = form.querySelector('input[name="nome"]');
    const telInput = form.querySelector('input[name="telefone"]');

    form.reset();
    modal.classList.remove('has-error');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('wa-modal-open');

    setTimeout(() => nomeInput && nomeInput.focus(), 80);

    form.onsubmit = (e) => {
      e.preventDefault();
      const nome = (nomeInput.value || '').trim();
      const telefone = (telInput.value || '').trim();

      if (nome.length < 2 || telefone.length < 8) {
        modal.classList.add('has-error');
        return;
      }

      const text = getBaseMessage();

      modal._waClose && modal._waClose();
      window.open(waLink(text), '_blank', 'noopener,noreferrer');
    };
  };

  // CTAs do WhatsApp + botões principais do header/menu que apontavam para #contato
  document.querySelectorAll(".js-wa-cta, .nav-cta, .is-cta[href='#contato']").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openContactModal();
    }, true);
  });

  // Form -> compõe mensagem e abre WhatsApp
  const form = document.querySelector(".js-wa-form");
  if (!form) return;

  function markField(input, valid) {
    const wrap = input && input.closest ? input.closest('.input-wrap') : null;
    if (!wrap) return;
    wrap.classList.toggle('is-valid', valid);
    wrap.classList.toggle('is-error', !valid);
  }

  function validateForm(formEl) {
    let ok = true;
    formEl.querySelectorAll('input[required], select[required], textarea[required]').forEach((input) => {
      const value = (input.value || '').trim();
      const valid = value.length >= 2;
      markField(input, valid);
      if (!valid) ok = false;
    });
    return ok;
  }

  form.querySelectorAll('input, select, textarea').forEach((input) => {
    input.addEventListener('input', () => {
      if (input.closest('.input-wrap')?.classList.contains('is-error')) {
        markField(input, (input.value || '').trim().length >= 2);
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (!validateForm(form)) return;

    const text = getBaseMessage();

    window.open(waLink(text), "_blank", "noopener,noreferrer");
  });
}

document.addEventListener("DOMContentLoaded", initWhatsApp);
