"use client";
import { useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * Spring-smoothed offset (px, up to `max`) from an element's centre toward the
 * pointer. Motion values, not React state: the pointer never re-renders the tree.
 */
export function useEyeFollow<T extends HTMLElement>(max = 6) {
  const ref = useRef<T>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 120, damping: 14 });
  const y = useSpring(rawY, { stiffness: 120, damping: 14 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 400);
        rawX.set((dx / d) * max * k);
        rawY.set((dy / d) * max * k);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [max, rawX, rawY]);

  return { ref, x, y };
}
