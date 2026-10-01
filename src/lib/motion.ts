import type { Transition, Variants } from "framer-motion";

// Motion tokens (build guide 4.0).
export const dur = { fast: 0.15, base: 0.3, slow: 0.6, story: 1.2 };
export const ease = [0.22, 1, 0.36, 1] as const;
export const springPop: Transition = { type: "spring", stiffness: 260, damping: 18 };
export const stagger = 0.08;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: dur.slow, ease } },
};

export const list = (gap = stagger, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

export const slap: Variants = {
  hidden: { opacity: 0, scale: 1.35, rotate: 0 },
  show: (r: number = 0) => ({ opacity: 1, scale: 1, rotate: r, transition: springPop }),
};

export const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.25 } } as const;
