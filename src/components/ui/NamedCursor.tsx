"use client";
import { motion } from "framer-motion";
import { springPop } from "@/lib/motion";

type Props = { name: string; color: string; tip?: string; className?: string; delay?: number; from?: { x: number; y: number }; flip?: boolean };

/** Coloured arrow + name pill. Flies in, then drifts. Hidden on phones. */
export function NamedCursor({ name, color, tip, className = "", delay = 0, from = { x: -120, y: -60 }, flip }: Props) {
  return (
    <motion.div
      className={`group absolute z-20 max-md:hidden ${className}`}
      initial={{ opacity: 0, x: from.x, y: from.y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ ...springPop, stiffness: 120, delay }}
    >
      <div className={`drift flex items-start ${flip ? "flex-row-reverse" : ""}`} style={{ animationDelay: `${-delay * 3}s` }}>
        <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden className={flip ? "-scale-x-100" : ""}>
          <path d="M2 2 L17 10 L10 12 L7 19 Z" fill={color} stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <span className="mt-4 rounded-full px-2.5 py-1 text-[12px] font-semibold text-white shadow-md" style={{ background: color }}>
          {name}
        </span>
      </div>
      {tip && (
        <span className="pointer-events-none absolute left-6 top-12 w-max max-w-56 rounded-lg bg-ink px-2.5 py-1.5 text-[12px] text-paper opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          {tip}
        </span>
      )}
    </motion.div>
  );
}
