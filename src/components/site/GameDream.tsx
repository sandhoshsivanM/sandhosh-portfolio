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
  { src: "coin", cls: "left-[3%] top-[5%] max-md:hidden", r: -10 },
  { src: "pixel-heart", cls: "right-[3%] top-[5%] max-md:hidden", r: 12 },
  { src: "trophy", cls: "left-[3%] bottom-[5%] max-lg:hidden", r: -8 },
  { src: "question-block", cls: "right-[3%] bottom-[5%] max-lg:hidden", r: 8 },
];

export function GameDream() {
  const [joined, setJoined] = useState(false);
  const taps = useRef<number[]>([]);
  const doneCount = dream.quests.filter((q) => q.done).length;

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
    <section id="dream" className="scroll-mt-16 py-6 md:py-14">
      <div className="container-page">
        {/* CRT turn-on. The trigger is the unclipped wrapper: a fully clipped element never counts as in view. */}
        <motion.div initial="off" whileInView="on" viewport={{ once: true, amount: 0.1 }}>
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
                className={`absolute w-8 opacity-80 md:w-10 ${f.cls}`}
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

              <div className="mt-10 grid items-start gap-x-10 lg:items-center gap-y-8 md:mt-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:gap-x-14">
                {/* the console, with me sitting at its corner playing */}
                <div className="relative mx-auto w-full max-w-[640px] pb-16 pr-14 sm:pb-12 sm:pr-24 xl:pr-28">
                  <div
                    className="border-[3px] border-white/90 bg-[#15112b] p-2.5 shadow-[6px_6px_0_rgba(124,242,200,.45),0_0_60px_-10px_rgba(255,79,216,.35)] md:p-3.5"
                    style={{ borderRadius: "26px 22px 28px 20px" }}
                  >
                    <div className="mb-2.5 flex items-center justify-between gap-3 px-1.5 font-pixel text-[8px] md:text-[9px]">
                      <span className="flex items-center gap-2 text-white/90">
                        <span className="blink h-2 w-2 rounded-full bg-neon-pink shadow-[0_0_8px_#ff4fd8]" aria-hidden />
                        {dream.game.toUpperCase()}
                      </span>
                      <span className="text-white/40">CH 02</span>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-[12px] border-2 border-black">
                      <PixelDemo label={`${dream.game}: a small pixel character runs and jumps across platforms collecting coins`} />
                      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(0,0,0,.16)_0_1px,transparent_1px_3px)]" />
                      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,.45))]" />
                    </div>
                    {/* controls sit left: my avatar covers the console's right corner */}
                    <div className="mt-2.5 flex items-center gap-4 px-1.5" aria-hidden>
                      <Image src="/assets/game/dpad-sm.webp" alt="" width={222} height={212} className="h-auto w-6 opacity-90 md:w-7" />
                      <span className="flex gap-1.5">
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-black bg-neon-pink md:h-4 md:w-4" />
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-black bg-neon md:h-4 md:w-4" />
                      </span>
                      <span className="blink font-pixel text-[8px] text-neon md:text-[9px]">PRESS START</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={tapController}
                    aria-label="Me, playing. Tap five times for a secret"
                    className="absolute bottom-0 right-0 w-[clamp(100px,16vw,160px)] transition-transform active:scale-95"
                  >
                    <Image src="/assets/avatar/boy-controller-sm.webp" alt="" width={277} height={400} className="h-auto w-full drop-shadow-[0_8px_12px_rgba(0,0,0,.55)]" />
                  </button>
                </div>

                <div className="flex flex-col">
                  <h3 className="font-display text-[26px] font-extrabold tracking-tight">{dream.game}</h3>
                  <p className="mt-2 text-[17px] leading-relaxed text-white/75">{dream.card}</p>
                  <dl className="mt-5 grid grid-cols-3 gap-2">
                    {dream.stats.map((s) => (
                      <div key={s.k} className="border-2 border-white/15 bg-white/[0.04] px-2.5 py-2 sm:px-3" style={{ borderRadius: "10px 14px 10px 14px" }}>
                        <dt className="font-pixel text-[8px] uppercase tracking-[0.14em] text-neon/80">{s.k}</dt>
                        <dd className="mt-1 whitespace-nowrap text-[13px] font-semibold text-white/90 sm:text-[14px]">{s.v}</dd>
                      </div>
                    ))}
                  </dl>
                  <UnderTheHood items={dream.hood} dark />

                  <div className="mt-3 border-2 border-white/25 bg-white/[0.04] p-5" style={{ borderRadius: "14px 22px 16px 24px / 22px 14px 24px 16px" }}>
                    <div className="mb-2 flex items-baseline justify-between font-pixel text-[10px] uppercase tracking-[0.18em]">
                      <p className="text-neon">Quest log</p>
                      <p className="text-white/50">
                        {doneCount}/{dream.quests.length}
                      </p>
                    </div>
                    <div
                      className="mb-4 h-3 border-2 border-white/40 p-[1px]"
                      role="progressbar"
                      aria-label="Quests complete"
                      aria-valuemin={0}
                      aria-valuemax={dream.quests.length}
                      aria-valuenow={doneCount}
                    >
                      <motion.div
                        className="h-full bg-[repeating-linear-gradient(90deg,#7cf2c8_0_6px,#3fc79a_6px_8px)]"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(doneCount / dream.quests.length) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease, delay: 0.3 }}
                      />
                    </div>
                    <motion.ul
                      className="space-y-2.5"
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.1 }}
                      variants={{ show: { transition: { staggerChildren: 0.2, delayChildren: 0.2 } } }}
                    >
                      {dream.quests.map((q) => (
                        <motion.li key={q.label} className="flex items-center gap-3 text-[15px]" variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}>
                          <span className={`grid h-5 w-5 shrink-0 place-items-center border-2 font-pixel text-[9px] ${q.done ? "border-neon bg-neon text-night" : "border-white/40"}`} aria-hidden>
                            {q.done ? "✓" : ""}
                          </span>
                          <span className={q.done ? "text-white/60 line-through decoration-neon/70" : ""}>{q.label}</span>
                          {q.done && <Image src="/assets/game/star-sm.webp" alt="" width={224} height={234} className="h-auto w-4" aria-hidden />}
                          <span className="sr-only">{q.done ? "(done)" : "(next)"}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                </div>
              </div>

              <div className="mt-12 border-t-2 border-dashed border-white/15 pt-6 text-center">
                <p className="font-pixel text-[9px] uppercase tracking-[0.18em] text-white/60 md:text-[10px]">The games that made me want to make games</p>
                {/* each one a little cartridge */}
                <ul className="mt-5 flex flex-wrap justify-center gap-3">
                  {dream.played.map((g) => (
                    <li key={g} className="relative rounded-t-lg border-2 border-white/35 bg-white/[0.06] px-4 pb-2 pt-4 text-[14px] text-white/85 shadow-[3px_3px_0_rgba(255,79,216,.35)]">
                      <span aria-hidden className="absolute inset-x-3 top-1.5 h-[3px] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.35)_0_2px,transparent_2px_5px)]" />
                      {g}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 font-mono text-[11px] text-white/35 max-md:hidden">psst: ↑ ↑ ↓ ↓ ← → ← → B A</p>
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
