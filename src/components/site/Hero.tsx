"use client";
import Image from "next/image";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { profile } from "@/content/profile";
import { useEyeFollow } from "@/hooks/useEyeFollow";
import { useIntroReady } from "@/lib/intro";
import { ease, springPop } from "@/lib/motion";
import { NamedCursor } from "@/components/ui/NamedCursor";
import { SelectionFrame } from "@/components/ui/SelectionFrame";
import { Sticker } from "@/components/ui/Sticker";

const WELCOME = "WELCOME TO MY";

// Stickers on the wall. `phone` ones stay on small screens, `tablet` from md.
const STICKERS = [
  { src: "csharp", alt: "C#", cls: "left-[4%] top-[52%] max-md:left-[3%] max-md:top-[6%]", r: -10, d: 0.7, show: "all" },
  { src: "dotnet", alt: ".NET", cls: "left-[30%] top-[6%]", r: 8, d: 0.79, show: "tablet" },
  { src: "sql", alt: "SQL Server", cls: "right-[4%] top-[50%] max-md:right-[3%] max-md:top-[6%]", r: 9, d: 0.88, show: "all" },
  { src: "redis", alt: "Redis", cls: "right-[30%] top-[5%]", r: -7, d: 0.97, show: "tablet" },
  { src: "docker", alt: "Docker", cls: "left-[15%] bottom-[8%]", r: 6, d: 1.06, show: "desktop" },
  { src: "azure", alt: "Azure", cls: "right-[15%] bottom-[10%]", r: -6, d: 1.15, show: "desktop" },
] as const;

const WALL_H = "clamp(240px, 30vw, 360px)";
// The anchor is wider than the boy so the hands can rest beside his shoulders.
const BOY_W = "clamp(290px, 40vw, 440px)";

const showClass = { all: "", tablet: "max-md:hidden", desktop: "max-lg:hidden" } as const;

export function Hero() {
  const ready = useIntroReady();
  const reduce = useReducedMotion();
  const { ref: faceRef, x: eyeX, y: eyeY } = useEyeFollow<HTMLDivElement>(9);
  const tilt = useTransform(eyeX, (v) => v * 0.5);
  const state = ready ? "show" : "hidden";

  return (
    <section id="top" className="relative pb-16 pt-10 md:pt-14">
      <div className="container-page">
        {/* WELCOME TO MY */}
        <motion.p
          aria-label={WELCOME}
          className="mb-5 flex justify-center gap-[0.12em] font-display text-[13px] font-bold tracking-[0.42em] md:mb-6 md:text-[15px]"
          initial="hidden"
          animate={state}
          variants={{ show: { transition: { staggerChildren: 0.03 } } }}
        >
          {WELCOME.split("").map((c, i) => (
            <motion.span key={i} aria-hidden variants={{ hidden: { opacity: 0, y: -12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease } } }}>
              {c === " " ? " " : c}
            </motion.span>
          ))}
        </motion.p>

        {/* The wall */}
        <div className="relative mx-auto max-w-[1160px]">
          <motion.div
            className="relative overflow-hidden border-[2.5px] border-ink shadow-[5px_6px_0_#141210]"
            style={{ height: WALL_H, background: "var(--wall)", transformOrigin: "bottom", borderRadius: "28px 34px 26px 32px / 32px 26px 34px 28px" }}
            initial={{ scaleY: 0.85, opacity: 0 }}
            animate={ready ? { scaleY: 1, opacity: 1 } : undefined}
            transition={{ duration: 0.5, ease, delay: 0.2 }}
          >
            {/* brick grid */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage: "linear-gradient(rgb(0 0 0 / .5) 1px, transparent 1px), linear-gradient(90deg, rgb(0 0 0 / .5) 1px, transparent 1px)",
                backgroundSize: "88px 44px",
              }}
            />
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,.28),transparent_60%)]" />
            {/* chalk code */}
            <Chalk className="left-[3.5%] top-[9%] max-md:hidden" lines={["var me = new Developer();", 'me.Build("ERP", modules: 28);', "await me.ShipAsync();"]} ready={ready} delay={0.4} />
            <Chalk
              className="right-[3.5%] top-[9%] text-right max-lg:hidden"
              lines={["SELECT * FROM Ideas", "WHERE Coffee > 0;", "-- 104 GB scan? add an index"]}
              ready={ready}
              delay={0.55}
            />
          </motion.div>

          {/* Stickers sit on top of the wall but outside its clip so they can overhang. */}
          <div className="pointer-events-none absolute inset-0 [&>*]:pointer-events-auto">
            {ready &&
              STICKERS.map((s) => (
                <Sticker
                  key={s.src}
                  src={`/assets/stickers/${s.src}-sm.webp`}
                  alt={s.alt}
                  size="clamp(54px, 7.6vw, 96px)"
                  rotate={s.r}
                  delay={s.d}
                  className={`${s.cls} ${showClass[s.show]}`}
                />
              ))}
            {ready && (
              <>
                <NamedCursor name="Recruiter" color="#2f7bf5" tip="Recruiter is reading your CV…" className="left-[24%] top-[30%]" delay={1.5} from={{ x: -260, y: 40 }} />
                <NamedCursor name="Tech lead" color="#1e9e6a" tip="Tech lead is checking the query plans…" className="right-[25%] top-[34%]" delay={1.6} from={{ x: 260, y: -40 }} />
              </>
            )}
          </div>

          {/* The boy and his hands share one anchor at the ledge, so they scale and line up together. */}
          <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: BOY_W }}>
            {/* window: everything below the ledge is cut off */}
            <div className="absolute inset-x-[-15%] bottom-0 overflow-hidden" style={{ height: `calc(${WALL_H} + 40px)` }}>
              <motion.div
                ref={faceRef}
                className="absolute bottom-0 left-[28.85%] w-[42.3%]"
                initial={{ y: "70%" }}
                animate={ready ? { y: "40%" } : undefined}
                transition={{ type: "spring", stiffness: 140, damping: 16, delay: 0.5 }}
              >
                <motion.div style={reduce ? undefined : { x: eyeX, y: eyeY, rotate: tilt }}>
                  <Image src="/assets/avatar/boy.webp" alt="Illustrated portrait of Sandhosh" width={936} height={1024} priority className="h-auto w-full" />
                </motion.div>
              </motion.div>
            </div>
            {/* hands grip the ledge: half above, half below the edge */}
            {(["left", "right"] as const).map((side, i) => (
              <motion.div
                key={side}
                aria-hidden
                className="absolute bottom-0 w-[26%]"
                style={side === "left" ? { left: "8%" } : { right: "8%" }}
                initial={{ y: "-60%", opacity: 0 }}
                animate={ready ? { y: "42%", opacity: 1 } : undefined}
                transition={{ ...springPop, delay: 0.95 + i * 0.08 }}
              >
                <Image src="/assets/avatar/hand-sm.webp" alt="" width={400} height={177} className={`h-auto w-full ${side === "left" ? "" : "-scale-x-100"}`} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sandhoshsivan / DEVELOPER. */}
        <div className="relative mx-auto mt-20 flex w-fit flex-col items-center md:mt-32">
          <motion.span
            aria-hidden
            className="absolute -left-[0.2em] -top-[0.95em] z-10 -rotate-[6deg] whitespace-nowrap font-sign text-[clamp(40px,6.6vw,88px)] leading-none text-ink"
            initial={{ clipPath: "inset(-30% 100% -30% 0%)" }}
            animate={ready ? { clipPath: "inset(-30% 0% -30% 0%)" } : undefined}
            transition={{ duration: 0.9, ease: "easeInOut", delay: 0.9 }}
          >
            {profile.signature}
          </motion.span>
          {ready ? (
            <SelectionFrame label={profile.sizeLabel} delay={1.0}>
              <h1 className="h-hero px-[0.14em] pb-[0.06em] pt-[0.1em] text-white">
                <span className="sr-only">{profile.name}, </span>DEVELOPER.
              </h1>
            </SelectionFrame>
          ) : (
            <h1 className="h-hero invisible px-[0.14em] pb-[0.06em] pt-[0.1em]">DEVELOPER.</h1>
          )}
          {ready && <NamedCursor name="You" color="#ff5b1f" className="-right-12 -bottom-12" delay={1.6} from={{ x: 120, y: 80 }} flip />}
          {ready && (
            <motion.div
              aria-hidden
              className="absolute -right-10 -top-8 w-10 max-sm:hidden"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1], rotate: [0, 20, 0] }}
              transition={{ delay: 1.7, duration: 0.6 }}
            >
              <Image src="/assets/doodles/sparkle-sm.webp" alt="" width={80} height={74} />
            </motion.div>
          )}
        </div>

        <motion.div
          className="mx-auto mt-16 max-w-[640px] text-center"
          initial={{ opacity: 0, y: 14 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, ease, delay: 1.7 }}
        >
          <p className="font-display text-[clamp(20px,2.4vw,26px)] font-bold leading-snug tracking-tight">{profile.headline}</p>
          <p className="mt-2 font-hand text-[24px] text-ink-2">{profile.subline}</p>
        </motion.div>
      </div>

      <Ticker ready={ready} />

      <motion.div
        className="container-page mt-10 flex flex-wrap items-center justify-center gap-3"
        initial={{ opacity: 0, y: 14 }}
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, ease, delay: 1.85 }}
      >
        <a href="#work" className="btn btn-ink">
          See what I built <span aria-hidden>→</span>
        </a>
        <a href={profile.links.resume} className="btn btn-ghost" download>
          Get my resume
        </a>
        <a href="#contact" className="btn btn-ghost">
          Say hello
        </a>
      </motion.div>
    </section>
  );
}

function Chalk({ lines, className, ready, delay }: { lines: string[]; className: string; ready: boolean; delay: number }) {
  return (
    <div aria-hidden className={`absolute font-mono text-[12px] leading-6 text-white/85 lg:text-[13px] ${className}`}>
      {lines.map((l, i) => (
        <motion.div
          key={l}
          className={`whitespace-pre ${i === lines.length - 1 ? "caret text-white/55" : ""}`}
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={ready ? { clipPath: "inset(0 0% 0 0)" } : undefined}
          transition={{ duration: 0.35, ease: "linear", delay: delay + i * 0.28 }}
        >
          {l}
        </motion.div>
      ))}
    </div>
  );
}

function Ticker({ ready }: { ready: boolean }) {
  const items = [...profile.ticker, ...profile.ticker];
  return (
    <div className="mt-12 overflow-hidden border-y-[1.5px] border-ink bg-sun py-3.5" aria-label={profile.ticker.join(", ")}>
      <div className="ticker-track flex w-max" style={{ animationPlayState: ready ? "running" : "paused" }} aria-hidden>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0">
            {items.map((t, i) => (
              <span key={`${k}-${i}`} className="flex items-center whitespace-nowrap font-display text-[13px] font-bold uppercase tracking-[0.22em] md:text-[14px]">
                <span className="px-6">{t}</span>
                <span className="text-accent">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
