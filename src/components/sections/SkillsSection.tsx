import { SKILL_LAYERS } from "@/content/skills";

/**
 * Rendered as a layered architecture stack. Deliberately no proficiency bars —
 * the previous version invented percentages that measured nothing.
 */
export function SkillsSection() {
  return (
    <ol className="space-y-4">
      {SKILL_LAYERS.map((layer, i) => (
        <li
          key={layer.id}
          className="rounded-xl border border-wire bg-surface p-5 transition-colors hover:border-accent/50"
        >
          <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-xs text-faint">
              L{SKILL_LAYERS.length - i}
            </span>
            <h3 className="font-display text-lg font-bold text-fg">{layer.title}</h3>
            <p className="font-mono text-xs text-muted">{layer.blurb}</p>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            {layer.groups.map((g) => (
              <div key={g.name}>
                <dt className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-accent">
                  {g.name}
                </dt>
                <dd>
                  <ul className="flex flex-wrap gap-1.5">
                    {g.items.map((item) => (
                      <li
                        key={item}
                        className="rounded border border-wire px-2 py-0.5 font-mono text-[11px] text-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ol>
  );
}
