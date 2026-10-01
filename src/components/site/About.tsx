"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { heart, hobbies, letter, stats } from "@/content/about";
import { ease, inView, list, springPop } from "@/lib/motion";
import { Counter } from "@/components/ui/Counter";
import { SectionHead } from "@/components/ui/SectionHead";

export function About() {
  return (
    <section id="about" className="py-20 md:py-[120px]">
      <div className="container-page">
        <SectionHead eyebrow="About" script="Hi," title="I'm Sandhosh." />

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Work side: the taped letter */}
          <motion.article
            className="relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease }}
          >
            <div aria-hidden className="sketch absolute inset-0 -rotate-1" />
            <motion.span
              aria-hidden
              className="tape -top-3 left-10 z-10 -rotate-6"
              initial={{ scale: 0.6, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ ...springPop, delay: 0.4 }}
            />
            <div className="relative space-y-4 p-7 font-hand text-[22px] leading-[1.35] text-ink md:p-10 md:text-[25px]">
              {letter.map((p, i) => (
                <p key={i}>{i === 1 ? <Highlight text={p} mark="only backend engineer" /> : p}</p>
              ))}
              <div className="flex items-end justify-between pt-2">
                <span className="font-sign text-[34px] text-accent">Sandhosh</span>
                <motion.div
                  className="w-12"
                  initial={{ filter: "grayscale(1) brightness(.9)", rotate: 0 }}
                  whileInView={{ filter: "grayscale(0) brightness(1)", rotate: [0, -8, 6, 0] }}
                  viewport={{ once: true, amount: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                >
                  <Image src="/assets/doodles/bulb-sm.webp" alt="" width={290} height={400} />
                </motion.div>
              </div>
            </div>
          </motion.article>

          {/* Stats 2×2 */}
          <div className="flex flex-col">
            <motion.ul className="grid flex-1 auto-rows-fr grid-cols-2 gap-4" {...inView} variants={list(0.08)}>
              {stats.map((s) => (
                <motion.li key={s.label} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }} className="card flex flex-col p-5 md:p-6">
                  <span className="font-display text-[clamp(36px,4.6vw,54px)] font-extrabold leading-none tracking-tight">
                    <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                  </span>
                  <Squiggle />
                  <span className="mt-2 text-[15px] font-medium">{s.label}</span>
                  <span className="mt-auto pt-3 font-mono text-[11px] leading-snug text-ink-3">{s.hood}</span>
                </motion.li>
              ))}
            </motion.ul>
            <p className="mt-3 font-hand text-[19px] text-ink-2">for Adeeb Group, Abu Dhabi ↑</p>
          </div>
        </div>

        {/* Heart side */}
        <div className="mt-16 grid items-start gap-10 md:mt-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <motion.figure
            className="relative mx-auto w-full max-w-[340px]"
            initial={{ opacity: 0, y: -40, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ ...springPop, stiffness: 160 }}
          >
            <div className="sketch relative -rotate-2 p-3 pb-14">
              <span className="tape tape-3 -top-4 left-1/2 -ml-[60px] rotate-2" />
              <div className="aspect-square overflow-hidden border-2 border-ink bg-[linear-gradient(140deg,#ffd2bc,#d6e2ff)]">
                <Image src="/assets/avatar/boy.webp" alt="Illustrated portrait of Sandhosh" width={936} height={1024} className="mx-auto mt-6 h-auto w-[86%]" />
              </div>
              <figcaption className="absolute inset-x-0 bottom-3 text-center font-hand text-[24px]">me, off the clock</figcaption>
            </div>
            <Image src="/assets/game/gamepad.webp" alt="" width={438} height={318} className="absolute -left-3 top-6 w-20 -rotate-12 drop-shadow-md sm:-left-8" />
            <Image src="/assets/game/star.webp" alt="" width={224} height={234} className="absolute -right-2 top-1/3 w-12 rotate-12 drop-shadow-md sm:-right-6" />
            <Image src="/assets/doodles/sparkle-sm.webp" alt="" width={400} height={371} className="absolute -bottom-4 right-4 w-10 drop-shadow-md" />
          </motion.figure>

          <div>
            <p className="eyebrow mb-3">Outside work</p>
            <div className="space-y-4 text-[18px] leading-[1.65] text-ink md:text-[19px]">
              {heart.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="mb-4 mt-10 eyebrow">Things I&apos;m into</p>
            <motion.ul className="grid auto-rows-fr gap-4 sm:grid-cols-2" {...inView} variants={list(0.1)}>
              {hobbies.map((h) => (
                <motion.li
                  key={h.title}
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }}
                  className="relative flex flex-col border-2 border-ink p-5 shadow-[3px_4px_0_#141210] rounded-[14px_22px_16px_24px/22px_14px_24px_16px]"
                  style={{ background: h.tint }}
                >
                  <Image src={h.sticker} alt="" width={200} height={200} className="absolute -right-3 -top-5 w-14 rotate-12 drop-shadow-md" />
                  <span className="h3 pr-10">{h.title}</span>
                  <span className="mt-2 text-[15px] text-ink-2">{h.line}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Highlight({ text, mark }: { text: string; mark: string }) {
  const [a, b] = text.split(mark);
  return (
    <>
      {a}
      <span className="relative whitespace-nowrap">
        <motion.span
          aria-hidden
          className="absolute -inset-x-1 bottom-[0.08em] top-[0.45em] -z-0 bg-sun/70"
          style={{ transformOrigin: "left" }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.5 }}
        />
        <span className="relative">{mark}</span>
      </span>
      {b}
    </>
  );
}

function Squiggle() {
  return (
    <svg viewBox="0 0 80 10" className="mt-2 h-2.5 w-20 text-accent" aria-hidden>
      <motion.path
        d="M2 6 Q 10 1 18 6 T 34 6 T 50 6 T 66 6 T 78 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease, delay: 0.3 }}
      />
    </svg>
  );
}
