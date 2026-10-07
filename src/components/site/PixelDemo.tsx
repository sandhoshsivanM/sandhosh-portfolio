"use client";
import { useEffect, useRef } from "react";

const W = 192, H = 108, GROUND = 88, LOOP = 600;

// The hero, 8×12, facing right: k dark, s skin, b hoodie, d hoodie shade, p jeans, w shoes.
const HEAD = ["..kkkkk.", ".kkkkkkk", ".kksssss", ".kssskss", "..sssss."];
const BODY = [".bbbbbb.", "bbbbbbbs", ".dbbbbd."];
const LEGS = {
  runA: [".pppppp.", ".pp..pp.", "pp....pp", "ww....ww"],
  runB: [".pppppp.", "..pppp..", "..pppp..", "..wwww.."],
  jump: [".pppppp.", "pp...pp.", "w.....ww", "........"],
};
const PALETTE: Record<string, string> = { k: "#141210", s: "#f2b48c", b: "#2f7bf5", d: "#1f5ac4", p: "#3a3550", w: "#f4f1ea" };

// 3×5 bitmap font, only the glyphs the HUD needs.
const FONT: Record<string, string> = {
  S: "111100111001111", C: "111100100100111", O: "111101101101111", R: "110101110101101", E: "111100110100111",
  0: "111101101101111", 1: "010110010010111", 2: "111001111100111", 3: "111001111001111", 4: "101101111001001",
  5: "111100111001111", 6: "111100111101111", 7: "111001010010010", 8: "111101111101111", 9: "111101111001111",
};
const HEART = ["11.11", "11111", ".111.", "..1.."];

// gaps in the ground the hero has to jump, as [start, width] in world px
const GAPS = [[130, 18], [250, 22], [360, 16], [490, 24]];
const COINS = [[100, 70], [138, 58], [170, 74], [258, 56], [320, 74], [370, 58], [430, 74], [500, 54], [560, 74]];

/**
 * Stand-in for the Sun of Elegance gameplay clip: a tiny auto-running
 * platformer drawn on a 192×108 canvas. Only runs while visible.
 */
export function PixelDemo({ label }: { label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // fixed star field, seeded so it doesn't reshuffle between renders
    let seed = 7;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const stars = Array.from({ length: 28 }, () => [Math.floor(rnd() * W), Math.floor(rnd() * 44), Math.floor(rnd() * 60)]);

    let camera = 0, y = GROUND, vy = 0, frame = 0, score = 0, visible = false, raf = 0;
    const taken = new Set<string>();
    let pops: { x: number; y: number; t: number }[] = [];
    const PX = 44;

    const wrap = (x: number) => ((x % LOOP) + LOOP) % LOOP;
    const inGap = (x: number) => GAPS.some(([s, w]) => wrap(x) > s && wrap(x) < s + w);

    const rect = (c: string, x: number, yy: number, w: number, h: number) => {
      ctx.fillStyle = c;
      ctx.fillRect(Math.round(x), Math.round(yy), w, h);
    };
    const sprite = (rows: string[], x: number, yy: number, color?: string) =>
      rows.forEach((r, j) => [...r].forEach((c, i) => c !== "." && rect(color ?? PALETTE[c], x + i, yy + j, 1, 1)));
    const text = (str: string, x: number, yy: number, color: string) =>
      [...str].forEach((ch, n) => {
        const g = FONT[ch];
        if (!g) return;
        for (let i = 0; i < 15; i++) if (g[i] === "1") {
          rect("#0e0b1f", x + n * 4 + (i % 3) + 1, yy + Math.floor(i / 3) + 1, 1, 1);
          rect(color, x + n * 4 + (i % 3), yy + Math.floor(i / 3), 1, 1);
        }
      });

    function draw() {
      // sky
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#1a1240");
      g.addColorStop(0.55, "#5b2a7a");
      g.addColorStop(1, "#ff7a59");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      // stars twinkle on their own phase
      for (const [sx, sy, ph] of stars) if ((frame + ph) % 60 > 8) rect(sy < 20 ? "#fff" : "#cbbcff", sx, sy, 1, 1);
      // sun
      rect("#ffc53d", 140, 24, 22, 22);
      rect("#ffe88a", 145, 29, 12, 12);
      // clouds
      for (let i = -1; i < 4; i++) {
        const cx = i * 80 - ((camera * 0.12) % 80) + 20;
        rect("rgba(255,214,235,.35)", cx, 36 + (i % 2) * 6, 22, 3);
        rect("rgba(255,214,235,.35)", cx + 5, 33 + (i % 2) * 6, 12, 3);
      }
      // far hills, then near hills (two parallax layers)
      for (let i = -1; i < 7; i++) {
        const hx = i * 40 - ((camera * 0.25) % 40);
        rect("#4b2a7a", hx, 66, 30, 22);
        rect("#4b2a7a", hx + 7, 58, 16, 8);
      }
      for (let i = -1; i < 6; i++) {
        const hx = i * 56 - ((camera * 0.55) % 56);
        rect("#33205e", hx, 74, 40, 14);
        rect("#33205e", hx + 10, 68, 20, 6);
      }
      // ground tiles
      for (let sx = 0; sx < W; sx += 4) {
        const wx = sx + camera;
        if (inGap(wx)) continue;
        rect("#7cf2c8", sx, GROUND, 4, 3);
        rect(Math.floor(wx / 8) % 2 === 0 ? "#1e1440" : "#24184d", sx, GROUND + 3, 4, H - GROUND);
      }
      // coins not yet collected this lap
      const lap = Math.floor(camera / LOOP);
      for (const k of [lap, lap + 1])
        COINS.forEach(([cx, cy], i) => {
          if (taken.has(`${k}:${i}`)) return;
          const sx = cx + k * LOOP - camera;
          if (sx < -4 || sx > W) return;
          const spin = Math.floor((frame + i * 3) / 8) % 3;
          rect("#ffc53d", sx + (spin === 1 ? 1 : 0), cy, spin === 1 ? 2 : 4, 5);
          if (spin !== 1) rect("#fff2b0", sx + 1, cy + 1, 1, 2);
        });
      // pickup sparkles
      for (const p of pops) {
        const sx = p.x - camera, r = 2 + p.t / 3;
        rect("#fff", sx - r, p.y, 1, 1);
        rect("#fff", sx + r, p.y, 1, 1);
        rect("#fff", sx, p.y - r, 1, 1);
        rect("#fff", sx, p.y + r, 1, 1);
      }
      // hero
      const py = Math.round(y) - 12;
      const legs = y < GROUND ? LEGS.jump : Math.floor(frame / 5) % 2 ? LEGS.runA : LEGS.runB;
      sprite([...HEAD, ...BODY, ...legs], PX, py);
      // HUD
      text("SCORE", 5, 5, "#7cf2c8");
      text(String(score).padStart(6, "0"), 27, 5, "#fff");
      for (let i = 0; i < 3; i++) sprite(HEART, W - 26 + i * 7, 5, "#ff4fd8");
    }

    function update() {
      frame++;
      camera += 1.1;
      const footX = camera + PX + 4;
      const onGround = y >= GROUND && !inGap(footX);
      // jump just before a gap
      if (onGround && inGap(footX + 16)) vy = -3.4;
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
      // collect coins the hero touches
      const lap = Math.floor(camera / LOOP);
      for (const k of [lap, lap + 1])
        COINS.forEach(([cx, cy], i) => {
          const wx = cx + k * LOOP, key = `${k}:${i}`;
          if (taken.has(key)) return;
          if (wx + 4 > camera + PX && wx < camera + PX + 8 && cy + 5 > y - 12 && cy < y) {
            taken.add(key);
            score += 10;
            pops.push({ x: wx + 2, y: cy + 2, t: 0 });
          }
        });
      for (const key of taken) if (+key.split(":")[0] < lap) taken.delete(key);
      pops = pops.filter((p) => ++p.t < 10);
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

  return <canvas ref={ref} width={W} height={H} role="img" aria-label={label} className="block h-full w-full [image-rendering:pixelated]" />;
}
