"use client";

import { useCallback, useSyncExternalStore } from "react";
import { isViewId } from "@/lib/architecture/views";
import type { ViewId } from "@/lib/architecture/types";

/**
 * The `?v=` search param is the single source of truth for which panel is
 * open. Subscribing to it (rather than mirroring it into state on mount)
 * removes the cascading-render effect entirely and makes Back/Forward work
 * for free.
 *
 * A search param on the same pathname is deliberate: pushing a real path —
 * and every view also has one, for crawlers — would make Next's own popstate
 * handler race this one and double-mount the panel.
 */
const URL_CHANGE = "arch:urlchange";

function subscribe(cb: () => void) {
  window.addEventListener("popstate", cb);
  window.addEventListener(URL_CHANGE, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(URL_CHANGE, cb);
  };
}

// Returns a primitive, so React's Object.is check settles immediately.
const getSnapshot = (): ViewId | null => {
  const v = new URLSearchParams(window.location.search).get("v");
  return isViewId(v) ? v : null;
};

const getServerSnapshot = (): ViewId | null => null;

export function useViewParam() {
  const view = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setView = useCallback((next: ViewId | null) => {
    window.history.pushState(null, "", next ? `/?v=${next}` : "/");
    // pushState does not fire popstate, so notify subscribers ourselves.
    window.dispatchEvent(new Event(URL_CHANGE));
  }, []);

  return [view, setView] as const;
}
