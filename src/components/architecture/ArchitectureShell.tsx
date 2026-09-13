"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";
import { CONTACT, PROFILE } from "@/content/profile";
import { useViewParam } from "@/hooks/useViewParam";
import { isNavNode, type ArchNode } from "@/lib/architecture/types";
import { ArchitectureCanvas } from "./ArchitectureCanvas";
import { MobilePipeline } from "./MobilePipeline";
import { SectionPanel } from "./SectionPanel";

/** Where the panel should fly in from — captured at click time for the FLIP. */
interface FlipOrigin {
  x: number;
  y: number;
}

export function ArchitectureShell() {
  const [view, setView] = useViewParam();
  // State, not a ref: this is read during render to build the enter animation,
  // and it is written in the same handler that opens the view.
  const [origin, setOrigin] = useState<FlipOrigin | null>(null);
  const reduce = useReducedMotion();

  const onOpen = useCallback(
    (node: ArchNode, e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!isNavNode(node)) return;
      // Let the browser handle modified clicks — these are real links.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      // One layout read, in an event handler — never in a frame loop.
      const r = e.currentTarget.getBoundingClientRect();
      setOrigin({
        x: r.left + r.width / 2 - window.innerWidth / 2,
        y: r.top + r.height / 2 - window.innerHeight / 2,
      });
      setView(node.view);
    },
    [setView],
  );

  const onClose = useCallback(() => setView(null), [setView]);

  const initial =
    reduce || !origin
      ? { opacity: 0, scale: 1, x: 0, y: 0 }
      : { opacity: 0, scale: 0.9, x: origin.x, y: origin.y };

  return (
    <main className="relative min-h-dvh overflow-hidden">
      {/* Faint blueprint grid. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-wire) 1px, transparent 1px), linear-gradient(90deg, var(--color-wire) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 45%, #000 40%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto flex min-h-dvh max-w-[1400px] flex-col px-4 py-6 sm:px-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-fg sm:text-2xl">
              {PROFILE.name}
            </h1>
            <p className="font-mono text-xs text-accent sm:text-sm">{PROFILE.title}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
              {PROFILE.tagline}
            </p>
          </div>
          <a
            href={`mailto:${CONTACT.email}`}
            className="rounded-lg border border-wire px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {CONTACT.email}
          </a>
        </header>

        <div className="flex flex-1 items-center py-8">
          {/* Padding lives here, never on .arch-canvas. */}
          <div className="mx-auto hidden w-full max-w-[1180px] lg:block">
            <ArchitectureCanvas openView={view} onOpen={onOpen} />
          </div>
          <div className="w-full lg:hidden">
            <MobilePipeline onOpen={onOpen} />
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-faint">
          <p className="hidden lg:block">hover a node · click to open</p>
          <p className="lg:hidden">tap a service to open</p>
          <p>{PROFILE.subtitle}</p>
        </footer>
      </div>

      <AnimatePresence>
        {view && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <motion.div
              key={view}
              className="w-full max-w-4xl"
              initial={initial}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
              transition={
                reduce ? { duration: 0.15 } : { type: "spring", stiffness: 260, damping: 30 }
              }
            >
              <SectionPanel view={view} onClose={onClose} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
