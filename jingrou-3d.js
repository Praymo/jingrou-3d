const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "50px", threshold: 0 }
);

document.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));

document.querySelectorAll(".marquee-track").forEach((track) => {
  const items = Array.from(track.children);
  for (let round = 0; round < 2; round += 1) {
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  }
});

const marqueeRows = Array.from(document.querySelectorAll(".marquee-row"));

function updateMarquee() {
  marqueeRows.forEach((row) => {
    const rect = row.getBoundingClientRect();
    const offset = (window.innerHeight - rect.top) * 0.16;
    const direction = row.dataset.direction === "right" ? 1 : -1;
    row.style.transform = `translate3d(${direction * (offset - 200)}px, 0, 0)`;
  });
}

const animatedText = document.querySelector(".animated-text");
if (animatedText) {
  const sourceText = animatedText.textContent.trim();
  animatedText.textContent = "";
  sourceText.split(/(\s+)/).forEach((token) => {
    if (/^\s+$/.test(token)) {
      animatedText.appendChild(document.createTextNode(token));
      return;
    }
    const word = document.createElement("span");
    word.className = "animated-word";
    token.split("").forEach((char) => {
      const span = document.createElement("span");
      span.className = "animated-char";
      span.textContent = char;
      word.appendChild(span);
    });
    animatedText.appendChild(word);
  });
}

function updateAnimatedText() {
  if (!animatedText) return;
  const rect = animatedText.getBoundingClientRect();
  const start = window.innerHeight * 0.8;
  const end = window.innerHeight * 0.2;
  const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end + rect.height)));
  const spans = Array.from(animatedText.querySelectorAll(".animated-char"));
  const litCount = Math.floor(progress * spans.length);

  spans.forEach((span, index) => {
    span.classList.toggle("is-lit", index <= litCount);
  });
}

function updateScrollEffects() {
  updateMarquee();
  updateAnimatedText();
}

window.addEventListener("scroll", updateScrollEffects, { passive: true });
window.addEventListener("resize", updateScrollEffects);
updateScrollEffects();

document.querySelectorAll(".magnet").forEach((magnet) => {
  const strength = Number(magnet.dataset.strength || 3);
  const padding = Number(magnet.dataset.padding || 120);

  function reset() {
    magnet.style.transition = "transform 0.28s cubic-bezier(0.2, 0, 0, 1)";
    magnet.style.transform = "translate3d(-50%, -50%, 0)";
  }

  window.addEventListener(
    "mousemove",
    (event) => {
      const rect = magnet.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const withinX = event.clientX > rect.left - padding && event.clientX < rect.right + padding;
      const withinY = event.clientY > rect.top - padding && event.clientY < rect.bottom + padding;

      if (!withinX || !withinY) {
        reset();
        return;
      }

      const moveX = (event.clientX - centerX) / strength;
      const moveY = (event.clientY - centerY) / strength;
      magnet.style.transition = "transform 0.16s cubic-bezier(0.2, 0, 0, 1)";
      magnet.style.transform = `translate3d(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px), 0)`;
    },
    { passive: true }
  );

  window.addEventListener("mouseleave", reset);
});
