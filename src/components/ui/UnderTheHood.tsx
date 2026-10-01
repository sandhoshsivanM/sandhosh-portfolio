/** The "dig" layer: exact stack for engineers, folded away for everyone else. */
export function UnderTheHood({ items, dark }: { items: string[]; dark?: boolean }) {
  return (
    <details className="group mt-auto pt-4">
      <summary
        className={`flex min-h-11 cursor-pointer list-none items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] ${dark ? "text-neon" : "text-ink-2"} [&::-webkit-details-marker]:hidden`}
      >
        <span className="inline-block transition-transform duration-300 group-open:rotate-90">▸</span>
        Under the hood
      </summary>
      <div className="flex flex-wrap gap-1.5 pb-1">
        {items.map((t) => (
          <span key={t} className={`chip max-w-full !whitespace-normal ${dark ? "border-white/15 bg-white/5 text-white/80" : ""}`}>
            {t}
          </span>
        ))}
      </div>
    </details>
  );
}
