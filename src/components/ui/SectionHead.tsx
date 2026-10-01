"use client";
import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

type Props = { eyebrow: string; script?: string; title: string; lead?: string; dark?: boolean; paper?: string };

/** Eyebrow on a torn paper scrap, then the heading with an optional signature word. */
export function SectionHead({ eyebrow, script, title, lead, dark, paper = "/assets/paper/torn-yellow-grid-sm.webp" }: Props) {
  return (
    <div className="mb-7 sm:mb-10 md:mb-14">
      {/* the trigger sits on an unclipped wrapper: a fully clipped element never counts as in view */}
      <motion.div className="mb-4" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.8 }}>
      <motion.div
        className="relative inline-block px-4 py-1.5"
        variants={{ hidden: { clipPath: "inset(0% 100% 0% 0%)", rotate: 0 }, show: { clipPath: "inset(0% 0% 0% 0%)", rotate: -2, transition: { duration: 0.6, ease } } }}
      >
        <span aria-hidden className="absolute inset-0 -z-10 bg-contain bg-center bg-no-repeat opacity-90" style={{ backgroundImage: `url(${paper})`, backgroundSize: "100% 100%" }} />
        <span className="eyebrow text-ink">{eyebrow}</span>
      </motion.div>
      </motion.div>
      <motion.h2
        className={`h2 ${dark ? "text-white" : ""}`}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease, delay: 0.1 }}
      >
        {script && <span className="mr-3 font-sign text-[1.05em] font-normal tracking-normal text-accent">{script}</span>}
        {title}
      </motion.h2>
      {lead && (
        <motion.p
          className={`mt-4 max-w-[60ch] text-[17px] ${dark ? "text-white/70" : "text-ink-2"}`}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
        >
          {lead}
        </motion.p>
      )}
    </div>
  );
}
