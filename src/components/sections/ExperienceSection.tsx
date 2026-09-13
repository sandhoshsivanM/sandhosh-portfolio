import { EXPERIENCE, ERP_MODULES } from "@/content/experience";

/** Rendered as a deploy pipeline: stage gates along a trace. */
export function ExperienceSection() {
  return (
    <div className="space-y-12">
      {EXPERIENCE.map((role) => (
        <article key={role.title} className="space-y-6">
          <header className="space-y-1">
            <h3 className="font-display text-xl font-bold text-fg">{role.title}</h3>
            <p className="font-mono text-sm text-accent">{role.company}</p>
            <p className="font-mono text-xs text-muted">{role.client}</p>
            <p className="font-mono text-xs text-faint">
              {role.location} · {role.start} – {role.end}
            </p>
          </header>

          <ul className="flex flex-wrap gap-1.5">
            {role.stack.map((s) => (
              <li
                key={s}
                className="rounded border border-wire px-2 py-0.5 font-mono text-[11px] text-muted"
              >
                {s}
              </li>
            ))}
          </ul>

          <ol className="relative space-y-8 border-l border-wire pl-6">
            {role.stages.map((stage, i) => (
              <li key={stage.name} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[31px] flex h-3 w-3 items-center justify-center rounded-full border-2 border-accent bg-ink"
                />
                <h4 className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
                  {String(i + 1).padStart(2, "0")} · {stage.name}
                </h4>
                <ul className="space-y-2.5">
                  {stage.bullets.map((b) => (
                    <li key={b.slice(0, 32)} className="text-sm leading-relaxed text-muted">
                      {b}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </article>
      ))}

      <div>
        <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-faint">
          Modules owned end-to-end
        </h3>
        <ul className="grid gap-3 sm:grid-cols-2">
          {ERP_MODULES.map((m) => (
            <li key={m.title} className="rounded-lg border border-wire bg-surface p-3">
              <p className="font-display text-sm font-semibold text-fg">{m.title}</p>
              <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted">{m.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
