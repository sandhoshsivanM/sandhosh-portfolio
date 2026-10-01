"use client";
import confetti from "canvas-confetti";

const STICKERS = ["csharp", "dotnet", "sql", "redis", "docker", "azure", "rabbitmq", "react"];

function reduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Confetti made of the site's own stickers, thrown from a point on screen. */
export function stickerBurst(x: number, y: number, count = 14) {
  if (reduced()) return;
  for (let i = 0; i < count; i++) {
    const img = document.createElement("img");
    img.src = `/assets/stickers/${STICKERS[i % STICKERS.length]}-sm.webp`;
    img.alt = "";
    const size = 28 + Math.random() * 18;
    Object.assign(img.style, {
      position: "fixed",
      left: `${x - size / 2}px`,
      top: `${y - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      objectFit: "contain",
      pointerEvents: "none",
      zIndex: "100",
      filter: "drop-shadow(0 4px 6px rgba(40,20,10,.3))",
    });
    document.body.appendChild(img);
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
    const v = 140 + Math.random() * 160;
    const dx = Math.cos(angle) * v;
    const dy = Math.sin(angle) * v;
    const rot = (Math.random() - 0.5) * 540;
    img
      .animate(
        [
          { transform: "translate(0,0) scale(.4) rotate(0deg)", opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) scale(1) rotate(${rot / 2}deg)`, opacity: 1, offset: 0.45 },
          { transform: `translate(${dx * 1.3}px, ${dy + 260}px) scale(.9) rotate(${rot}deg)`, opacity: 0 },
        ],
        { duration: 1100 + Math.random() * 400, easing: "cubic-bezier(.22,1,.36,1)" },
      )
      .finished.finally(() => img.remove());
  }
}

/** Chunky 8-bit confetti for Player 2. */
export function pixelBurst() {
  if (reduced()) return;
  confetti({
    particleCount: 140,
    spread: 110,
    startVelocity: 44,
    shapes: ["square"],
    scalar: 1.5,
    flat: true,
    colors: ["#7cf2c8", "#ff4fd8", "#ffc53d", "#ffffff"],
    origin: { y: 0.65 },
  });
}
