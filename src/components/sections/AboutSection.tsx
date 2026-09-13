import Image from "next/image";
import { EDUCATION } from "@/content/experience";
import { CONTACT, METRICS, PROFILE, STACK } from "@/content/profile";

export function AboutSection() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="relative aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-xl border border-wire">
          <Image
            src="/profile.jpg"
            alt={`Portrait of ${PROFILE.name}`}
            fill
            sizes="(max-width: 1024px) 60vw, 280px"
            className="object-cover"
            priority
          />
        </div>
        <dl className="space-y-2 font-mono text-xs">
          <div className="flex gap-2">
            <dt className="text-faint">location</dt>
            <dd className="text-muted">{PROFILE.location}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-faint">status</dt>
            <dd className="text-accent">{PROFILE.availability}</dd>
          </div>
        </dl>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          {PROFILE.bio.map((p) => (
            <p key={p.slice(0, 24)} className="leading-relaxed text-muted">
              {p}
            </p>
          ))}
        </div>

        <div>
          <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-faint">Stack</h3>
          <ul className="flex flex-wrap gap-2">
            {STACK.map((s) => (
              <li
                key={s}
                className="rounded-md border border-wire px-2.5 py-1 font-mono text-xs text-muted"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-faint">
            By the numbers
          </h3>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {METRICS.map((m) => (
              <div key={m.label} className="rounded-lg border border-wire bg-surface p-3">
                <dt className="font-display text-xl font-bold text-accent">{m.value}</dt>
                <dd className="mt-0.5 font-mono text-[11px] leading-snug text-muted">{m.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-faint">
            Education & certification
          </h3>
          <ul className="space-y-3">
            {EDUCATION.map((e) => (
              <li key={e.title} className="border-l-2 border-wire pl-4">
                <p className="font-display font-semibold text-fg">{e.title}</p>
                <p className="font-mono text-xs text-muted">{e.org}</p>
                <p className="font-mono text-xs text-faint">{e.detail}</p>
              </li>
            ))}
          </ul>
        </div>

        <a
          href={CONTACT.resume}
          className="inline-flex rounded-lg border border-accent px-4 py-2 font-mono text-sm text-accent transition-colors hover:bg-accent hover:text-ink"
        >
          Download résumé (PDF)
        </a>
      </div>
    </div>
  );
}
