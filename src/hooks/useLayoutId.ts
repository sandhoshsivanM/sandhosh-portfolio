"use client";

import { useSyncExternalStore } from "react";
import type { LayoutId } from "@/lib/architecture/types";

const QUERY = "(min-width: 1024px)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

const getSnapshot = (): LayoutId => (window.matchMedia(QUERY).matches ? "lg" : "md");
const getServerSnapshot = (): LayoutId => "lg";

/**
 * Which desktop layout variant to render. This genuinely needs JS because it
 * changes the viewBox and every coordinate.
 *
 * useSyncExternalStore (rather than useState + useEffect) avoids the React 19
 * hydration error. Tablet users still get one frame of the `lg` layout; the
 * `.arch-canvas-in` fade covers it.
 */
export function useLayoutId(): LayoutId {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
