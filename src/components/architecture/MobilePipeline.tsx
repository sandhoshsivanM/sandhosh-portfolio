"use client";

import Link from "next/link";
import { NODES_IN_ORDER } from "@/lib/architecture/graph";
import { isNavNode, type ArchNode } from "@/lib/architecture/types";

/**
 * Below 768px. A 7-node DAG at 400px is a mess, not a diagram — so the
 * topology is dropped and the metaphor kept: a vertical request pipeline.
 *
 * This is also the plain-list accessibility fallback. Because it and the
 * desktop canvas are display:none-toggled, exactly one <nav> is ever exposed,
 * so there is no duplicate hidden nav to maintain.
 */
export function MobilePipeline({
  onOpen,
}: {
  onOpen: (node: ArchNode, e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const nodes = NODES_IN_ORDER.filter(isNavNode);

  return (
    <nav aria-labelledby="pipe-nav-title">
      <h2 id="pipe-nav-title" className="sr-only">
        Site sections
      </h2>
      <ol className="space-y-0">
        {nodes.map((node, i) => {
          const Icon = node.icon;
          const accent = `var(--color-${node.accent})`;
          return (
            <li key={node.id}>
              <Link
                href={node.href}
                aria-label={node.srHint}
                onClick={(e) => onOpen(node, e)}
                className="flex items-center gap-3 rounded-xl border border-wire bg-surface px-4 py-3 outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 active:border-accent"
                style={{ outlineColor: accent }}
              >
                <Icon aria-hidden="true" className="h-5 w-5 shrink-0" style={{ color: accent }} />
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-sm font-semibold text-fg">
                    {node.label}
                  </span>
                  <span className="block truncate font-mono text-[11px] text-muted">
                    {node.sublabel}
                  </span>
                </span>
                {node.badge && (
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
                    style={{
                      color: accent,
                      background: `color-mix(in oklab, ${accent} 14%, transparent)`,
                    }}
                  >
                    {node.badge}
                  </span>
                )}
              </Link>

              {i < nodes.length - 1 && (
                <div
                  aria-hidden="true"
                  className="relative ml-7 h-10 w-0.5 overflow-hidden bg-wire"
                >
                  <span
                    className="pipe-dot absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
                    style={{ background: accent, animationDelay: `${i * 0.35}s` }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
