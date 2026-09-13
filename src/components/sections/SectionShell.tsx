import Link from "next/link";
import { VIEW_META } from "@/lib/architecture/views";
import type { ViewId } from "@/lib/architecture/types";

/**
 * Chrome for the standalone routes. These exist for crawlers, no-JS, deep
 * links, and middle-click — the interactive experience lives on `/`.
 */
export function SectionShell({
  view,
  children,
}: {
  view: ViewId;
  children: React.ReactNode;
}) {
  const meta = VIEW_META[view];
  return (
    <main className="mx-auto min-h-dvh max-w-4xl px-4 py-10 sm:px-8">
      <Link
        href="/"
        className="mb-8 inline-flex font-mono text-xs text-muted transition-colors hover:text-accent"
      >
        ← back to the diagram
      </Link>
      <header className="mb-8 border-b border-wire pb-6">
        <p className="font-mono text-xs text-accent">{meta.kicker}</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-fg">{meta.title}</h1>
      </header>
      <div id="content">{children}</div>
    </main>
  );
}
