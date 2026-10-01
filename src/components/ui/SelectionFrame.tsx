"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ease, springPop } from "@/lib/motion";

type Props = {
  children: ReactNode;
  label?: string;
  fill?: string;
  delay?: number;
  className?: string;
  /** Animate when scrolled into view instead of on mount. */
  onView?: boolean;
};

const handles = ["-left-[5px] -top-[5px]", "-right-[5px] -top-[5px]", "-left-[5px] -bottom-[5px]", "-right-[5px] -bottom-[5px]"];

/** Figma-style selection: blue outline draws, handles pop, fill wipes in, content slides up. */
export function SelectionFrame({ children, label, fill = "var(--color-accent)", delay = 0, className = "", onView }: Props) {
  const trigger = onView ? { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.6 } } : { initial: "hidden", animate: "show" };
  return (
    <motion.div className={`relative inline-block ${className}`} {...trigger}>
      <motion.span
        aria-hidden
        className="absolute inset-0"
        style={{ background: fill, transformOrigin: "left" }}
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.45, ease, delay: delay + 0.35 } } }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 border-[1.5px] border-frame"
        style={{ transformOrigin: "top left" }}
        variants={{ hidden: { clipPath: "inset(0 100% 100% 0)" }, show: { clipPath: "inset(0 0% 0% 0)", transition: { duration: 0.4, ease, delay } } }}
      />
      {handles.map((h, i) => (
        <motion.span
          key={h}
          aria-hidden
          className={`absolute z-10 h-[10px] w-[10px] border-[1.5px] border-frame bg-white ${h}`}
          variants={{ hidden: { scale: 0 }, show: { scale: 1, transition: { ...springPop, delay: delay + 0.3 + i * 0.05 } } }}
        />
      ))}
      <span className="relative block overflow-hidden">
        <motion.span
          className="block"
          variants={{ hidden: { y: "105%" }, show: { y: 0, transition: { duration: 0.5, ease, delay: delay + 0.6 } } }}
        >
          {children}
        </motion.span>
      </span>
      {label && (
        <motion.span
          className="absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-[4px] bg-frame px-2 py-[3px] font-mono text-[11px] font-semibold text-white max-sm:hidden"
          variants={{ hidden: { scale: 0, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { ...springPop, delay: delay + 0.9 } } }}
        >
          {label}
        </motion.span>
      )}
    </motion.div>
  );
}
