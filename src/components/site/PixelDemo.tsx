"use client";
import { useEffect, useRef } from "react";

/**
 * Stand-in for the Sun of Elegance gameplay clip: a tiny auto-running
 * platformer drawn on a 160×90 canvas. Only runs while visible.
 */
export function PixelDemo({ label }: { label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const W = 160, H = 90, GROUND = 72;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // gaps in the ground the hero has to jump, as [start, width] in world px
    const gaps = [[120, 18], [230, 22], [330, 16], [450, 24]];
    const coins = [[96, 46], [128, 40], [240, 38], [300, 50], [342, 40], [400, 50], [462, 36]];
    const LOOP = 520;
    let camera = 0, y = GROUND, vy = 0, frame = 0, visible = false, raf = 0;

    const inGap = (x: number) => gaps.some(([s, w]) => ((x % LOOP) + LOOP) % LOOP > s && ((x % LOOP) + LOOP) % LOOP < s + w);

    function draw() {
      // sky
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#2a1b5e");
      g.addColorStop(1, "#ff7a59");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      // sun
      ctx.fillStyle = "#ffc53d";
      ctx.fillRect(116, 14, 18, 18);
      ctx.fillStyle = "#ffe88a";
      ctx.fillRect(120, 18, 10, 10);
      // far hills (parallax)
      ctx.fillStyle = "#4b2a7a";
      for (let i = -1; i < 6; i++) {
        const hx = i * 40 - ((camera * 0.3) % 40);
        ctx.fillRect(hx, 56, 28, 16);
        ctx.fillRect(hx + 6, 48, 16, 8);
      }
      // ground tiles
      for (let sx = 0; sx < W; sx += 4) {
        const wx = sx + camera;
        if (inGap(wx)) continue;
        ctx.fillStyle = "#7cf2c8";
        ctx.fillRect(sx, GROUND, 4, 3);
        ctx.fillStyle = (Math.floor(wx / 8) % 2 === 0) ? "#1e1440" : "#24184d";
        ctx.fillRect(sx, GROUND + 3, 4, H - GROUND);
      }
      // coins
      for (const [cx, cy] of coins) {
        for (const base of [0, LOOP]) {
          const sx = cx + base - (camera % LOOP);
          if (sx < -4 || sx > W) continue;
          const wobble = Math.floor(frame / 8) % 2;
          ctx.fillStyle = "#ffc53d";
          ctx.fillRect(sx, cy, 4 - wobble, 5);
        }
      }
      // hero (blue hoodie, like the avatar)
      const px = 40, py = Math.round(y);
      const step = Math.floor(frame / 5) % 2;
      ctx.fillStyle = "#141210";
      ctx.fillRect(px + 1, py - 14, 6, 3); // hair
      ctx.fillStyle = "#f2b48c";
      ctx.fillRect(px + 1, py - 11, 6, 4); // face
      ctx.fillStyle = "#2f7bf5";
      ctx.fillRect(px, py - 7, 8, 5); // hoodie
      ctx.fillStyle = "#141210";
      ctx.fillRect(px + (step ? 1 : 2), py - 2, 2, 2);
      ctx.fillRect(px + (step ? 5 : 4), py - 2, 2, 2);
      ctx.fillStyle = "#fff";
      ctx.fillRect(px + 5, py - 10, 1, 1); // eye
    }

    function update() {
      frame++;
      camera += 1.1;
      const footX = camera + 44;
      const onGround = y >= GROUND && !inGap(footX);
      // jump just before a gap
      if (onGround && inGap(footX + 14)) vy = -3.1;
      vy += 0.22;
      y += vy;
      if (!inGap(footX) && y >= GROUND) {
        y = GROUND;
        vy = 0;
      }
      if (y > H + 20) {
        y = GROUND - 30;
        vy = 0;
      }
    }

    function loop() {
      if (!visible) return;
      update();
      draw();
      raf = requestAnimationFrame(loop);
    }

    draw();
    if (reduce) return;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} width={160} height={90} role="img" aria-label={label} className="block h-full w-full [image-rendering:pixelated]" />;
}
