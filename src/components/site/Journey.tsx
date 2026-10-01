"use client";
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { journey } from "@/content/journey";
import { springPop } from "@/lib/motion";
import { SectionHead } from "@/components/ui/SectionHead";

export function Journey() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <section id="journey" className="scroll-mt-16 py-12 sm:py-16 md:py-24 lg:py-[120px]">
      <div className="container-page">
        <SectionHead eyebrow="Journey" title="How I got here." paper="/assets/paper/torn-yellow-grid-sm.webp" />
        <ol ref={ref} className="relative grid gap-8 lg:grid-cols-6 lg:gap-4">
          {/* dashed path: vertical on small screens, horizontal on desktop */}
          <svg aria-hidden className="absolute left-[11px] top-2 h-[calc(100%-16px)] w-1 lg:hidden" preserveAspectRatio="none" viewBox="0 0 2 100">
            <line x1="1" y1="0" x2="1" y2="100" stroke="#14121022" strokeWidth="2" strokeDasharray="3 3" />
            <motion.line x1="1" y1="0" x2="1" y2="100" stroke="#141210" strokeWidth="2" strokeDasharray="3 3" style={{ pathLength: progress }} />
          </svg>
          <svg aria-hidden className="absolute left-3 right-3 top-[11px] hidden h-1 w-[calc(100%-24px)] lg:block" preserveAspectRatio="none" viewBox="0 0 100 2">
            <line x1="0" y1="1" x2="100" y2="1" stroke="#14121022" strokeWidth="2" strokeDasharray="1.2 1.2" vectorEffect="non-scaling-stroke" />
            <motion.line x1="0" y1="1" x2="100" y2="1" stroke="#141210" strokeWidth="2" strokeDasharray="1.2 1.2" style={{ pathLength: progress }} />
          </svg>
          {journey.map((s, i) => (
            <li key={s.when} className="relative pl-10 lg:pl-0 lg:pt-10">
              <motion.span
                aria-hidden
                className={`absolute left-0 top-0 grid h-6 w-6 place-items-center rounded-full border-2 ${
                  s.ghost ? "border-dashed border-accent bg-paper shadow-[0_0_18px_4px_rgba(255,91,31,.45)]" : s.now ? "border-ink bg-accent" : "border-ink bg-white"
                }`}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 1 }}
                transition={{ ...springPop, delay: 0.1 + i * 0.12 }}
              >
                {s.now && <motion.span className="absolute inset-0 rounded-full bg-accent" animate={{ scale: [1, 1.9], opacity: [0.6, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />}
              </motion.span>
              <p className={`font-mono text-[12px] font-semibold uppercase tracking-[0.14em] ${s.ghost ? "text-accent" : "text-ink-2"}`}>{s.when}</p>
              <p className={`mt-1 font-display text-[19px] font-bold leading-tight tracking-tight ${s.ghost ? "text-accent" : ""}`}>{s.title}</p>
              <p className="mt-1 text-[15px] text-ink-2">{s.line}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
