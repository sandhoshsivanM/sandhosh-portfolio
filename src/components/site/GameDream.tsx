"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { dream } from "@/content/dream";
import { useKonami } from "@/hooks/useKonami";
import { pixelBurst } from "@/lib/confetti";
import { ease, springPop } from "@/lib/motion";
import { UnderTheHood } from "@/components/ui/UnderTheHood";
import { PixelDemo } from "./PixelDemo";

// Pinned to the panel's four corners, same inset each, so they frame the content.
const FLOATERS = [
  { src: "coin", cls: "left-[3%] top-[5%]", r: -10 },
  { src: "pixel-heart", cls: "right-[3%] top-[5%]", r: 12 },
  { src: "trophy", cls: "left-[3%] bottom-[5%] max-lg:hidden", r: -8 },
  { src: "question-block", cls: "right-[3%] bottom-[5%] max-lg:hidden", r: 8 },
];

export function GameDream() {
  const [joined, setJoined] = useState(false);
  const taps = useRef<number[]>([]);

  const unlock = useCallback(() => {
    pixelBurst();
    setJoined(true);
    window.setTimeout(() => setJoined(false), 3200);
  }, []);
  useKonami(unlock);

  const tapController = () => {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < 2000), now];
    if (taps.current.length >= 5) {
      taps.current = [];
      unlock();
    }
  };

  return (
    <section id="dream" className="py-10 md:py-14">
      <div className="container-page">
        {/* CRT turn-on. The trigger is the unclipped wrapper: a fully clipped element never counts as in view. */}
        <motion.div initial="off" whileInView="on" viewport={{ once: true, amount: 0.2 }}>
          <motion.div
            className="scanlines relative overflow-hidden border-[2.5px] border-ink bg-night px-5 py-10 text-white shadow-[5px_6px_0_#141210] md:px-14 md:py-12"
            style={{ borderRadius: "28px 34px 26px 32px / 32px 26px 34px 28px" }}
            variants={{
              off: { clipPath: "inset(49.5% 0% 49.5% 0% round 26px)" },
              on: { clipPath: "inset(0% 0% 0% 0% round 26px)", transition: { duration: 0.6, ease } },
            }}
          >
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(255,79,216,.18),transparent_55%),radial-gradient(ellipse_at_90%_100%,rgba(124,242,200,.14),transparent_55%)]" />
            {FLOATERS.map((f, i) => (
              <motion.div
                key={f.src}
                aria-hidden
                className={`absolute w-10 md:w-12 ${f.cls}`}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1, rotate: f.r }}
                viewport={{ once: true }}
                transition={{ ...springPop, delay: 0.5 + i * 0.08 }}
              >
                <div className="float-y" style={{ animationDelay: `${-i * 0.9}s` }}>
                  <Image src={`/assets/game/${f.src}.webp`} alt="" width={200} height={200} className="h-auto w-full" />
                </div>
              </motion.div>
            ))}

            <div className="relative">
              <p className="mb-4 text-center font-pixel text-[10px] uppercase tracking-[0.2em] text-neon md:text-[12px]">Player 2 · the dream</p>
              <h2 className="mx-auto max-w-[30ch] text-center font-pixel text-[clamp(16px,2.6vw,30px)] leading-[1.6] max-sm:px-6">
                <TypeLine text={dream.headline[0]} delay={0.5} />
                <br />
                <span className="text-neon-pink">
                  <TypeLine text={dream.headline[1]} delay={1.1} />
                </span>
              </h2>
              <p className="mx-auto mt-4 w-fit border-2 border-neon px-3 py-1.5 font-pixel text-[9px] text-neon md:text-[10px]">{dream.rookie}</p>

              <div className="mt-8 grid items-center gap-x-10 gap-y-14 md:mt-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
                {/* hand-drawn TV, with me sitting at its corner playing */}
                <div className="relative mx-auto w-full max-w-[600px] lg:pr-16">
                  <div className="border-[3px] border-white/90 bg-[#1b1636] p-3 shadow-[6px_6px_0_rgba(124,242,200,.5)] md:p-4" style={{ borderRadius: "30px 24px 32px 22px" }}>
                    <div className="relative aspect-video overflow-hidden rounded-[14px] border-2 border-black">
                      <PixelDemo label={`${dream.game}: a small pixel character runs and jumps across platforms collecting coins`} />
                      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(0,0,0,.18)_0_1px,transparent_1px_3px)]" />
                      <span className="absolute left-3 top-2 font-pixel text-[8px] text-white/90 md:text-[10px]">{dream.game.toUpperCase()}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-3 px-1">
                      <span className="h-2 w-2 rounded-full bg-neon" />
                      <span className="h-2 w-2 rounded-full bg-neon-pink" />
                      <span className="font-pixel text-[8px] text-white/50 max-sm:hidden">demo loop · real clip coming</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={tapController}
                    aria-label="Me, playing. Tap five times for a secret"
                    className="absolute -bottom-12 -right-2 w-[clamp(110px,20vw,170px)] transition-transform active:scale-95 lg:-right-14"
                  >
                    <Image src="/assets/avatar/boy-controller-sm.webp" alt="" width={277} height={400} className="h-auto w-full drop-shadow-[0_8px_12px_rgba(0,0,0,.55)]" />
                  </button>
                </div>

                <div className="flex flex-col">
                  <h3 className="font-display text-[26px] font-extrabold tracking-tight">{dream.game}</h3>
                  <p className="mt-2 text-[17px] leading-relaxed text-white/75">{dream.card}</p>
                  <UnderTheHood items={dream.hood} dark />

                  <div className="mt-5 border-2 border-white/25 bg-white/[0.04] p-5" style={{ borderRadius: "14px 22px 16px 24px / 22px 14px 24px 16px" }}>
                    <p className="mb-3 font-pixel text-[10px] uppercase tracking-[0.18em] text-neon">Quest log</p>
                    <motion.ul
                      className="space-y-2.5"
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.6 }}
                      variants={{ show: { transition: { staggerChildren: 0.2, delayChildren: 0.2 } } }}
                    >
                      {dream.quests.map((q) => (
                        <motion.li key={q.label} className="flex items-center gap-3 text-[15px]" variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}>
                          <span className={`grid h-5 w-5 shrink-0 place-items-center border-2 font-pixel text-[9px] ${q.done ? "border-neon bg-neon text-night" : "border-white/40"}`} aria-hidden>
                            {q.done ? "✓" : ""}
                          </span>
                          <span className={q.done ? "text-white/60 line-through decoration-neon/70" : ""}>{q.label}</span>
                          <span className="sr-only">{q.done ? "(done)" : "(next)"}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                </div>
              </div>

              <div className="mt-14 border-t-2 border-dashed border-white/15 pt-6 text-center md:mt-12">
                <p className="font-pixel text-[9px] uppercase tracking-[0.18em] text-white/60 md:text-[10px]">The games that made me want to make games</p>
                <ul className="mt-4 flex flex-wrap justify-center gap-2">
                  {dream.played.map((g) => (
                    <li key={g} className="border-2 border-white/30 px-3 py-1 text-[14px] text-white/85" style={{ borderRadius: "255px 18px 225px 18px / 18px 225px 18px 255px" }}>
                      {g}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 font-mono text-[11px] text-white/35 max-md:hidden">psst: ↑ ↑ ↓ ↓ ← → ← → B A</p>
              </div>
            </div>

            <AnimatePresence>
              {joined && (
                <motion.div
                  role="status"
                  className="absolute left-1/2 top-6 z-10 -translate-x-1/2 rounded-md border-2 border-neon bg-night px-4 py-3 font-pixel text-[11px] text-neon shadow-[4px_4px_0_#ff4fd8]"
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                >
                  Player 2 has joined!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function TypeLine({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.span initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.03, delayChildren: delay } } }} aria-label={text}>
      {text.split("").map((c, i) => (
        <motion.span key={i} aria-hidden variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0 } } }}>
          {c}
        </motion.span>
      ))}
    </motion.span>
  );
}
