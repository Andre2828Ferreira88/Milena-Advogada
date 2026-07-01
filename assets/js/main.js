document.addEventListener("DOMContentLoaded", () => {

  const btn = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  const closeBtn = document.querySelector("[data-nav-close]");

  if (!btn || !menu) return;

  const open = () => {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    btn.setAttribute("aria-expanded", "true");
  };

  const close = () => {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-expanded", "false");
  };

  btn.addEventListener("click", () => {
    const isOpen = menu.classList.contains("is-open");
    isOpen ? close() : open();
  });

  if (closeBtn) closeBtn.addEventListener("click", close);

  // clicar fora do painel fecha
  menu.addEventListener("click", (e) => {
    if (e.target === menu) close();
  });

  // clicar em um link fecha
  menu.querySelectorAll("a[href^='#']").forEach(a => {
    a.addEventListener("click", () => close());
  });

  // ESC fecha
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector("[data-pain-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-pain-track]");
  const slides = Array.from(slider.querySelectorAll("[data-pain-slide]"));
  if (!track || slides.length === 0) return;

  const setActive = () => {
    const center = track.scrollLeft + track.clientWidth / 2;

    let best = slides[0];
    let bestDist = Infinity;

    for (const s of slides) {
      const sCenter = s.offsetLeft + s.clientWidth / 2;
      const dist = Math.abs(center - sCenter);
      if (dist < bestDist) {
        bestDist = dist;
        best = s;
      }
    }

    slides.forEach(s => s.classList.toggle("is-active", s === best));
  };

  // inicial
  setActive();

  // atualiza durante scroll (com debounce leve)
  let t = null;
  track.addEventListener("scroll", () => {
    if (t) cancelAnimationFrame(t);
    t = requestAnimationFrame(setActive);
  }, { passive: true });

  window.addEventListener("resize", setActive);
});
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector("[data-pain-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-pain-track]");
  const slides = Array.from(slider.querySelectorAll("[data-pain-slide]"));
  const prevBtn = slider.querySelector("[data-pain-prev]");
  const nextBtn = slider.querySelector("[data-pain-next]");
  if (!track || slides.length === 0 || !prevBtn || !nextBtn) return;

  const getActiveIndex = () => {
    const center = track.scrollLeft + track.clientWidth / 2;
    let bestI = 0;
    let bestDist = Infinity;

    slides.forEach((s, idx) => {
      const sCenter = s.offsetLeft + s.clientWidth / 2;
      const dist = Math.abs(center - sCenter);
      if (dist < bestDist) { bestDist = dist; bestI = idx; }
    });

    return bestI;
  };

  const go = (idx) => {
    const el = slides[idx];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  prevBtn.addEventListener("click", () => {
    const i = getActiveIndex();
    const prev = (i - 1 + slides.length) % slides.length; // loop infinito
    go(prev);
  });

  nextBtn.addEventListener("click", () => {
    const i = getActiveIndex();
    const next = (i + 1) % slides.length; // loop infinito
    go(next);
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector("[data-steps-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-steps-track]");
  const cards = Array.from(track?.querySelectorAll(".step") || []);
  const prev = slider.querySelector("[data-steps-prev]");
  const next = slider.querySelector("[data-steps-next]");
  if (!track || cards.length === 0 || !prev || !next) return;

  const getActiveIndex = () => {
    const left = track.scrollLeft;
    let bestI = 0, bestDist = Infinity;
    cards.forEach((c, i) => {
      const dist = Math.abs(c.offsetLeft - left);
      if (dist < bestDist) { bestDist = dist; bestI = i; }
    });
    return bestI;
  };

  const go = (idx) => {
    const el = cards[idx];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  prev.addEventListener("click", () => {
    const i = getActiveIndex();
    go(Math.max(0, i - 1));
  });

  next.addEventListener("click", () => {
    const i = getActiveIndex();
    go(Math.min(cards.length - 1, i + 1));
  });
});
// =========================
// PRELOADER (premium)
// =========================
(() => {
  const pre = document.getElementById("preloader");
  const fill = document.getElementById("preloaderFill");
  if (!pre || !fill) return;

  // trava scroll
  document.documentElement.classList.add("is-loading");
  document.body.classList.add("is-loading");

  let p = 0;
  let raf = null;

  // progresso fake suave (vai até 92% antes do load real)
  const tick = () => {
    const target = 100;
    const speed = 0.10; // ajuste (0.6 mais lento / 1.0 mais rápido)
    if (p < target) p = Math.min(target, p + speed);
    fill.style.width = `${p.toFixed(1)}%`;
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  const finish = () => {
    if (raf) cancelAnimationFrame(raf);

    // completa
    p = 100;
    fill.style.width = "100%";
    fill.parentElement?.setAttribute("aria-valuenow", "100");

    // pequena pausa pra ficar “premium”
    setTimeout(() => {
      pre.classList.add("is-hidden");
      document.documentElement.classList.remove("is-loading");
      document.body.classList.remove("is-loading");
    }, 350);
  };

  // some quando tudo estiver carregado (imagens, etc)
  window.addEventListener("load", () => {
    // garante que não some “instantâneo” (fica mais profissional)
    setTimeout(finish, 1200);
  });

  // fallback: se o load demorar muito, remove em no máximo 4s
  setTimeout(() => {
    if (!pre.classList.contains("is-hidden")) finish();
  }, 4000);
})();
// ===============================
// INCLUDED "Netflix" auto-scroll
// (pausa só segurando)
// ===============================

// Parallax sutil no HERO (leve e premium)
(function heroParallax(){
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  let raf = null;

  const onMove = (e) => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX / window.innerWidth - 0.5) * 10; // intensidade
      const y = (e.clientY / window.innerHeight - 0.5) * 10;

      hero.style.setProperty("--px", `${x}px`);
      hero.style.setProperty("--py", `${y}px`);
    });
  };

  window.addEventListener("mousemove", onMove, { passive: true });
})();
// =========================
// BOT (2026) — Assistente (Tech HUD + typing + progress)
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("assistente");
  if (!root) return;

  const chat = document.getElementById("botChat");
  const send = document.getElementById("botSend");
  const botStatus = document.getElementById("botStatus");
  const botStep = document.getElementById("botStep");
  const botProgressFill = document.getElementById("botProgressFill");

  if (!chat || !send) return;

  const WHATSAPP_NUMBER = "5511933082223"; // ajuste se necessário

  const state = {
    dor: "",
    funcionarios: "",
    prestadores: "",
    contrato: "",
    urgencia: "",
    risco: 0,
  };

  const steps = [
    {
      key: "dor",
      ask: "Qual é a maior preocupação jurídica da sua empresa hoje?",
      options: [
        { label: "Trabalhista", value: "Trabalhista (demissão, advertência, rotina)", score: 3 },
        { label: "Contratos", value: "Contratos (clientes e prestação de serviços)", score: 2 },
        { label: "Prestadores", value: "Prestadores (vínculo, responsabilidade, cláusulas)", score: 3 },
        { label: "Societário", value: "Societário (sócios, quotas, alteração contratual)", score: 2 },
      ],
    },
    {
      key: "funcionarios",
      ask: "Quantos funcionários (CLT) você tem hoje?",
      options: [
        { label: "0", value: "0", score: 1 },
        { label: "1–5", value: "1–5", score: 2 },
        { label: "6–20", value: "6–20", score: 3 },
        { label: "Acima de 20", value: "Acima de 20", score: 3 },
      ],
    },
    {
      key: "prestadores",
      ask: "Você utiliza prestadores (PJ/autônomos) com frequência?",
      options: [
        { label: "Não", value: "Não", score: 0 },
        { label: "Às vezes", value: "Às vezes", score: 2 },
        { label: "Sim, frequentemente", value: "Sim, frequentemente", score: 3 },
      ],
    },
    {
      key: "contrato",
      ask: "Os contratos atuais foram revisados por advogado?",
      options: [
        { label: "Sim, revisados", value: "Sim, revisados", score: 0 },
        { label: "Modelo genérico", value: "Modelo genérico", score: 2 },
        { label: "Às vezes / depende", value: "Às vezes / depende", score: 2 },
        { label: "Não usamos", value: "Não usamos", score: 3 },
      ],
    },
    {
      key: "urgencia",
      ask: "Qual é o momento da sua demanda hoje?",
      options: [
        { label: "Preventivo (organizar)", value: "Preventivo (organizar)", score: 1 },
        { label: "Tenho uma decisão agora", value: "Tenho uma decisão agora", score: 2 },
        { label: "Já deu problema", value: "Já deu problema", score: 3 },
      ],
    },
  ];

  const setMeta = (i) => {
    const total = steps.length;
    const done = Math.max(0, Math.min(i, total));
    if (botStep) botStep.textContent = `${done}/${total}`;
    if (botProgressFill) botProgressFill.style.width = `${(done / total) * 100}%`;
  };

  const setStatus = (txt) => {
    if (botStatus) botStatus.textContent = txt;
  };

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  const scrollBottom = () => {
    chat.scrollTop = chat.scrollHeight;
  };

  const addBotMsg = (text) => {
    const msg = el("div", "bot-msg is-bot", text);
    chat.appendChild(msg);
    scrollBottom();
  };

  const addUserMsg = (text) => {
    const msg = el("div", "bot-msg is-user", text);
    chat.appendChild(msg);
    scrollBottom();
  };

  const addTyping = () => {
    const wrap = el("div", "bot-msg is-bot");
    const t = el("div", "bot-typing", "");
    t.appendChild(el("span"));
    t.appendChild(el("span"));
    t.appendChild(el("span"));
    wrap.appendChild(t);
    wrap.dataset.typing = "1";
    chat.appendChild(wrap);
    scrollBottom();
    return wrap;
  };

  const removeTyping = () => {
    chat.querySelectorAll('[data-typing="1"]').forEach(n => n.remove());
  };

  const clearOptions = () => {
    chat.querySelectorAll(".bot-options").forEach(n => n.remove());
  };

  const addOptions = (options, onPick) => {
    const wrap = el("div", "bot-options");
    options.forEach((o) => {
      const b = el("button", "bot-opt", o.label);
      b.type = "button";
      b.addEventListener("click", () => onPick(o, b));
      wrap.appendChild(b);
    });
    chat.appendChild(wrap);
    scrollBottom();
    return wrap;
  };

  const riskLabel = (score) => {
    if (score <= 4) return "Baixo";
    if (score <= 8) return "Médio";
    return "Alto";
  };

  const recommendation = (s) => {
    const level = riskLabel(s.risco);
    if (level === "Alto") {
      return "Recomendação: priorizar revisão de contratos e rotinas (trabalhista/prestadores) para reduzir exposição imediata e evitar decisões no improviso.";
    }
    if (level === "Médio") {
      return "Recomendação: revisar pontos críticos e estruturar rotina preventiva para manter previsibilidade e reduzir passivos.";
    }
    return "Recomendação: manter prevenção contínua e revisar documentos-chave periodicamente para sustentar segurança jurídica.";
  };

  const buildSummary = () => {
    const level = riskLabel(state.risco);
    const rec = recommendation(state);

    return {
      level,
      rec,
      text:
        `Olá! Fiz o diagnóstico no site e quero entender a assessoria jurídica mensal.\n\n` +
        `Diagnóstico inicial:\n` +
        `• Principal preocupação: ${state.dor}\n` +
        `• Funcionários (CLT): ${state.funcionarios}\n` +
        `• Prestadores: ${state.prestadores}\n` +
        `• Contratos: ${state.contrato}\n` +
        `• Momento: ${state.urgencia}\n\n` +
        `Nível de risco percebido: ${level}\n` +
        `${rec}\n\n` +
        `Pode me enviar a proposta?`
    };
  };

  let idx = 0;

  const next = async () => {
    clearOptions();
    removeTyping();

    setMeta(idx);
    setStatus("Analisando…");

    if (idx >= steps.length) {
      const summary = buildSummary();

      // typing + mensagens finais
      const t = addTyping();
      setTimeout(() => {
        t.remove();
        setStatus("Diagnóstico pronto");
        addBotMsg("Perfeito. Com base nas suas respostas, segue um diagnóstico inicial:");
        addBotMsg(`Nível de risco percebido: ${summary.level}`);
        addBotMsg(summary.rec);
        addBotMsg("Se quiser, eu já monto a mensagem completa e você fala direto com a advogada no WhatsApp.");
        send.disabled = false;
        send.dataset.summary = summary.text;
        setMeta(steps.length);
      }, 520);

      return;
    }

    const step = steps[idx];

    // typing + pergunta
    const t = addTyping();
    setTimeout(() => {
      t.remove();
      setStatus(`Coletando dados • ${step.key}`);
      addBotMsg(step.ask);

      addOptions(step.options, (pick, btn) => {
        // visual selected
        chat.querySelectorAll(".bot-opt").forEach(b => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");

        // salva
        state[step.key] = pick.value;
        state.risco += Number(pick.score || 0);

        addUserMsg(pick.label);

        idx += 1;

        // ritmo “real”
        setTimeout(next, 520);
      });
    }, 420);
  };

  // start
  chat.innerHTML = "";
  send.disabled = true;

  setStatus("Inicializando…");
  setMeta(0);

  addBotMsg("Olá! Vou fazer um diagnóstico rápido e objetivo para entender sua empresa.");
  setTimeout(() => {
    setStatus("Pronto para iniciar");
    next();
  }, 520);

  send.addEventListener("click", () => {
    const text = send.dataset.summary || "";
    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(link, "_blank", "noopener,noreferrer");
  });
});
// =========================
// INCLUDED — Manual slider (sem autoplay)
// =========================
// =========================
// INCLUDED — Manual slider (sem autoplay) [FIX]
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const shell = document.querySelector("[data-included-slider]");
  if (!shell) return;

  const scroller = shell.querySelector(".included-slider"); // QUEM ROLA
  const track = shell.querySelector("[data-included-track]");
  if (!scroller || !track) return;

  const prev = shell.querySelector("[data-included-prev]");
  const next = shell.querySelector("[data-included-next]");

  const getStep = () => {
    const card = track.querySelector(".included-card");
    if (!card) return 320;

    const cardW = card.getBoundingClientRect().width;

    // gap real do track
    const gap = parseFloat(getComputedStyle(track).gap || "18") || 18;
    return cardW + gap;
  };

  const scrollByDir = (dir) => {
    scroller.scrollBy({ left: getStep() * dir, behavior: "smooth" });
  };

  prev?.addEventListener("click", () => scrollByDir(-1));
  next?.addEventListener("click", () => scrollByDir(1));
});

