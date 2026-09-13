import { CASE_STUDIES } from "@/content/caseStudies";

/** Long-form, formatted like an RFC: Problem → Approach → Outcome → Metric. */
export function CaseStudiesSection() {
  return (
    <ol className="space-y-6">
      {CASE_STUDIES.map((cs, i) => (
        <li key={cs.id} className="rounded-xl border border-wire bg-surface p-5">
          <header className="mb-4">
            <p className="font-mono text-xs text-faint">
              CASE {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="font-display text-lg font-bold text-fg">{cs.title}</h3>
            <p className="font-mono text-xs text-muted">{cs.kicker}</p>
            <p className="mt-2 inline-flex rounded-full bg-accent/10 px-2.5 py-1 font-mono text-xs text-accent">
              {cs.metric}
            </p>
          </header>

          <div className="space-y-4">
            <section>
              <h4 className="mb-1 font-mono text-[11px] uppercase tracking-widest text-faint">
                Problem
              </h4>
              <p className="text-sm leading-relaxed text-muted">{cs.problem}</p>
            </section>

            <section>
              <h4 className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-faint">
                Approach
              </h4>
              <ul className="space-y-1.5">
                {cs.approach.map((a) => (
                  <li key={a.slice(0, 28)} className="flex gap-2 text-sm text-muted">
                    <span aria-hidden="true" className="text-accent">
                      ▹
                    </span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h4 className="mb-1 font-mono text-[11px] uppercase tracking-widest text-faint">
                Outcome
              </h4>
              <p className="text-sm leading-relaxed text-muted">{cs.outcome}</p>
            </section>
          </div>

          <ul className="mt-4 flex flex-wrap gap-1.5">
            {cs.stack.map((s) => (
              <li
                key={s}
                className="rounded border border-wire px-2 py-0.5 font-mono text-[11px] text-muted"
              >
                {s}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
