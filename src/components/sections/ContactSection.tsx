"use client";

import { useState } from "react";
import { CONTACT } from "@/content/profile";

type Status = "idle" | "sending" | "success" | "error";

const FIELDS = [
  { name: "name", label: "name", type: "text", maxLength: 100 },
  { name: "email", label: "email", type: "email", maxLength: 200 },
  { name: "subject", label: "subject", type: "text", maxLength: 150 },
] as const;

/** Styled as a request builder — POST /hello. */
export function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Failed to send");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
      <ul className="space-y-3 font-mono text-sm">
        <li>
          <span className="block text-[11px] uppercase tracking-widest text-faint">email</span>
          <a href={`mailto:${CONTACT.email}`} className="text-accent hover:underline">
            {CONTACT.email}
          </a>
        </li>
        <li>
          <span className="block text-[11px] uppercase tracking-widest text-faint">phone</span>
          <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="text-muted hover:text-fg">
            {CONTACT.phone}
          </a>
        </li>
        <li>
          <span className="block text-[11px] uppercase tracking-widest text-faint">linkedin</span>
          <a
            href={CONTACT.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted hover:text-fg"
          >
            {CONTACT.linkedinLabel}
          </a>
        </li>
        <li>
          <span className="block text-[11px] uppercase tracking-widest text-faint">github</span>
          <a
            href={CONTACT.github}
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted hover:text-fg"
          >
            {CONTACT.githubLabel}
          </a>
        </li>
      </ul>

      <form onSubmit={onSubmit} className="space-y-4">
        {FIELDS.map((f) => (
          <div key={f.name}>
            <label
              htmlFor={f.name}
              className="mb-1 block font-mono text-[11px] uppercase tracking-widest text-faint"
            >
              {f.label}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              required
              maxLength={f.maxLength}
              className="w-full rounded-lg border border-wire bg-surface px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-accent"
            />
          </div>
        ))}

        <div>
          <label
            htmlFor="message"
            className="mb-1 block font-mono text-[11px] uppercase tracking-widest text-faint"
          >
            message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            maxLength={5000}
            className="w-full resize-y rounded-lg border border-wire bg-surface px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-accent"
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-lg border border-accent px-4 py-2 font-mono text-sm text-accent transition-colors hover:bg-accent hover:text-ink disabled:opacity-50"
        >
          {status === "sending" ? "sending…" : "POST /hello"}
        </button>

        <p aria-live="polite" className="font-mono text-xs">
          {status === "success" && (
            <span className="text-accent">202 Accepted — thanks, I&rsquo;ll be in touch.</span>
          )}
          {status === "error" && <span className="text-async">{error}</span>}
        </p>
      </form>
    </div>
  );
}
