function initRails(){
  document.querySelectorAll("[data-rail]").forEach((rail) => {
    const track = rail.querySelector("[data-rail-track]");
    const section = rail.closest(".included");
    const prev = section ? section.querySelector("[data-rail-prev]") : null;
    const next = section ? section.querySelector("[data-rail-next]") : null;

    const stepSize = () => {
      const card = track.querySelector(".rail-card");
      const gap = 18;
      return card ? (card.getBoundingClientRect().width + gap) : 340;
    };

    const scrollByCard = (dir) => {
      track.scrollBy({ left: dir * stepSize(), behavior: "smooth" });
    };

    if (prev) prev.addEventListener("click", () => scrollByCard(-1));
    if (next) next.addEventListener("click", () => scrollByCard(1));

    // Wheel vertical -> horizontal quando o mouse está em cima do rail
    rail.addEventListener("wheel", (e) => {
      const canScroll = track.scrollWidth > track.clientWidth;
      if (!canScroll) return;

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        track.scrollLeft += e.deltaY;
      }
    }, { passive:false });

    // Drag-to-scroll (desktop)
    let isDown = false, startX = 0, startLeft = 0;

    track.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX;
      startLeft = track.scrollLeft;
      track.classList.add("is-dragging");
    });

    window.addEventListener("mouseup", () => {
      isDown = false;
      track.classList.remove("is-dragging");
    });

    track.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      track.scrollLeft = startLeft - dx;
    });
  });
}

window.initRails = initRails;
