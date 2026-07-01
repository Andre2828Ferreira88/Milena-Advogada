const WHATSAPP_NUMBER = "5511933082223"; // ajuste se necessário

const BASE_MESSAGE =
  "Olá! Tenho uma empresa de comércio/serviços (até 20 funcionários) e quero entender a assessoria jurídica mensal. Pode me enviar a proposta?";

function waLink(text){
  const msg = encodeURIComponent(text);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

function initWhatsApp(){
  // CTAs
  document.querySelectorAll(".js-wa-cta").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(waLink(BASE_MESSAGE), "_blank", "noopener,noreferrer");
    });
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

    const fd = new FormData(form);
    const nome = (fd.get("nome") || "").toString().trim();
    const whatsapp = (fd.get("whatsapp") || "").toString().trim();
    const empresa = (fd.get("empresa") || "").toString().trim();
    const area = (fd.get("area") || "").toString().trim();
    const demanda = (fd.get("demanda") || "").toString().trim();
    const segmento = (fd.get("segmento") || "").toString().trim();

    const isServiceForm = form.hasAttribute('data-service-form');

    let text;

    if (isServiceForm) {
      text =
        `Olá! Vim pela página de Direito Trabalhista Empresarial e gostaria de atendimento.\n\n` +
        `Nome: ${nome}\n` +
        `WhatsApp: ${whatsapp}\n` +
        (empresa ? `Empresa: ${empresa}\n` : '') +
        (area ? `Área de interesse: ${area}\n` : '') +
        (demanda ? `Demanda: ${demanda}\n` : '');
    } else {
      text =
        `${BASE_MESSAGE}\n\n` +
        `Nome: ${nome}\n` +
        `WhatsApp: ${whatsapp}\n` +
        `Segmento: ${segmento}`;
    }

    window.open(waLink(text), "_blank", "noopener,noreferrer");
  });
}

document.addEventListener("DOMContentLoaded", initWhatsApp);
