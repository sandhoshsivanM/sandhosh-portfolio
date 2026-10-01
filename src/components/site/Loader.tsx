"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { LOADER_DONE, LOADER_KEY, useLoaderPending } from "@/lib/intro";
import { ease } from "@/lib/motion";

const LINES = [
  ["> dotnet build Sandhoshsivan.Portfolio", ""],
  ["  Restoring coffee…", "done"],
  ["  Compiling 28 modules…", "done"],
  ["  Loading dreams: game-dev.dll", "done"],
];

/** "The build log": first visit per session only, ≈1.7 s, hard cap 2.5 s, any key or tap skips. */
export function Loader() {
  const pending = useLoaderPending();
  const [closing, setClosing] = useState(false);
  const active = pending && !closing;
  const [shown, setShown] = useState(0);
  const [progress, setProgress] = useState(0.1);
  const [signed, setSigned] = useState(false);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    try {
      sessionStorage.setItem(LOADER_KEY, "1");
    } catch {}
    setClosing(true);
    window.setTimeout(() => {
      delete document.documentElement.dataset.loader;
      window.dispatchEvent(new Event(LOADER_DONE));
    }, 380);
  }, []);

  useEffect(() => {
    if (!pending) return;
    const timers = [
      ...[0, 1, 2, 3, 4].map((i) => window.setTimeout(() => setShown(i + 1), 100 + i * 160)),
      window.setTimeout(() => setSigned(true), 950),
      window.setTimeout(finish, 2500), // hard cap
    ];
    // progress tracks real loading: fonts + the avatar image
    let done = 0;
    const tick = () => setProgress(Math.min(1, 0.15 + (++done / 2) * 0.85));
    document.fonts.ready.then(tick);
    const img = new window.Image();
    img.onload = img.onerror = tick;
    img.src = "/assets/avatar/boy.webp";
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [pending, finish]);

  useEffect(() => {
    if (active && signed && progress >= 1) {
      const t = window.setTimeout(finish, 650);
      return () => clearTimeout(t);
    }
  }, [active, signed, progress, finish]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="loader"
          className="loader fixed inset-0 z-[90] grid place-items-center bg-paper"
          style={{
            backgroundImage: "linear-gradient(rgb(20 18 16 / .055) 1px, transparent 1px), linear-gradient(90deg, rgb(20 18 16 / .055) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          exit={{ y: "-105%", rotate: -2, transition: { duration: 0.45, ease } }}
          aria-label="Loading"
          role="status"
        >
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }} className="relative w-[min(440px,calc(100vw-32px))]">
            <span className="tape -top-4 left-1/2 -ml-[60px] rotate-[-3deg]" />
            <div className="rounded-2xl bg-[#1a1714] p-5 font-mono text-[13px] leading-7 text-[#e9e4d8] shadow-[0_24px_50px_-20px_rgba(20,18,16,.6)]">
              {LINES.slice(0, shown).map(([l, r]) => (
                <div key={l} className="flex justify-between gap-4 whitespace-pre">
                  <span className="truncate">{l}</span>
                  <span className="text-[#9a948a]">{r}</span>
                </div>
              ))}
              {shown >= 5 && (
                <div className="relative text-neon">
                  {"  Build succeeded. 0 warnings, 0 errors ✓"}
                  <motion.span initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} className="absolute -right-2 -top-3 w-6">
                    <Image src="/assets/doodles/sparkle-sm.webp" alt="" width={48} height={48} />
                  </motion.span>
                </div>
              )}
              {shown < 5 && <span className="caret" />}
              <div className="mt-4 h-[3px] overflow-hidden rounded bg-white/10">
                <motion.div className="h-full bg-accent" animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.3 }} />
              </div>
            </div>
            <div className="relative mt-4 h-16">
              <motion.p
                className="absolute inset-x-0 text-center font-sign text-5xl text-ink"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={signed ? { clipPath: "inset(0 0% 0 0)" } : undefined}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                Sandhosh
              </motion.p>
              <motion.div
                className="absolute top-0 w-24"
                initial={{ left: "18%", opacity: 0 }}
                animate={signed ? { left: ["18%", "72%"], opacity: [1, 1, 0] } : undefined}
                transition={{ duration: 0.55, ease: "easeInOut" }}
              >
                <Image src="/assets/doodles/pencil-sm.webp" alt="" width={200} height={131} className="-scale-x-100" />
              </motion.div>
            </div>
            <p className="mt-1 text-center font-mono text-[11px] text-ink-3">press any key to skip</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
