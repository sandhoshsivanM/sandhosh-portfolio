"use client";
import { useSyncExternalStore } from "react";

// The loader runs once per session. An inline script in <head> sets
// html[data-loader] before paint, so returning visitors never see it flash.
export const LOADER_KEY = "sk-loader-seen";
export const LOADER_DONE = "sk:loader-done";

export const loaderBootScript = `try{if(!sessionStorage.getItem("${LOADER_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.loader="1"}catch(e){}`;

const subscribe = (cb: () => void) => {
  window.addEventListener(LOADER_DONE, cb);
  return () => window.removeEventListener(LOADER_DONE, cb);
};

/** True while the first-visit loader still owns the screen. */
export const useLoaderPending = () => useSyncExternalStore(subscribe, () => document.documentElement.dataset.loader === "1", () => false);

/** True once the hero may start its entrance (immediately when there is no loader). */
export const useIntroReady = () => useSyncExternalStore(subscribe, () => document.documentElement.dataset.loader !== "1", () => false);
