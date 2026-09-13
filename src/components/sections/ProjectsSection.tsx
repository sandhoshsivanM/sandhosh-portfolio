import { PROJECTS } from "@/content/projects";

export function ProjectsSection() {
  return (
    <ul className="space-y-5">
      {PROJECTS.map((p) => (
        <li key={p.id} className="rounded-xl border border-wire bg-surface p-5">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-bold text-fg">{p.title}</h3>
              <p className="font-mono text-xs text-accent">{p.kicker}</p>
            </div>
            <span className="font-mono text-xs text-faint">{p.year}</span>
          </div>

          <p className="mb-4 text-sm leading-relaxed text-muted">{p.description}</p>

          <ul className="mb-4 space-y-1.5">
            {p.highlights.map((h) => (
              <li key={h.slice(0, 28)} className="flex gap-2 text-sm text-muted">
                <span aria-hidden="true" className="text-accent">
                  ▹
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ul>

          <ul className="flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <li
                key={t}
                className="rounded border border-wire px-2 py-0.5 font-mono text-[11px] text-muted"
              >
                {t}
              </li>
            ))}
          </ul>

          {p.link && (
            <a
              href={p.link.url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-flex font-mono text-xs text-accent underline underline-offset-4 hover:no-underline"
            >
              {p.link.label} ↗
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
