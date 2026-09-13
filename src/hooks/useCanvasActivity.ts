"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Whether the packet RAF loop should run at all.
 *
 * Every condition must hold: the canvas is on screen, the tab is visible, the
 * viewport is at least tablet-sized, and the user has not asked for reduced
 * motion. Mobile therefore never pays for the animation.
 */
export function useCanvasActivity(ref: RefObject<Element | null>): boolean {
  const [onScreen, setOnScreen] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [wideEnough, setWideEnough] = useState(false);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setWideEnough(wide.matches);
      setReduced(motion.matches);
    };
    sync();
    wide.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  return onScreen && tabVisible && wideEnough && !reduced;
}
