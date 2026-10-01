"use client";
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** With prefers-reduced-motion, framer-motion skips every transform animation site-wide. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
