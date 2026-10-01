"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { profile } from "@/content/profile";
import { stickerBurst } from "@/lib/confetti";
import { ease } from "@/lib/motion";
import { SelectionFrame } from "@/components/ui/SelectionFrame";

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const copy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      window.location.href = `mailto:${profile.email}`;
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    stickerBurst(r.left + r.width / 2, r.top);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      if (!res.ok) throw new Error();
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="pb-16 pt-20 md:pt-[120px]">
      <div className="container-page">
        <div className="relative flex flex-col items-center text-center">
          <motion.div className="relative" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.8 }}>
            <SelectionFrame onView fill="var(--color-ink)">
              <h2 className="px-[0.14em] py-[0.06em] font-display text-[clamp(48px,9vw,112px)] font-extrabold leading-[0.95] tracking-[-0.035em] text-paper">LET&apos;S BUILD</h2>
            </SelectionFrame>
            <motion.span
              className="absolute -bottom-[0.95em] right-0 -rotate-6 font-sign text-[clamp(34px,5vw,64px)] leading-none text-accent"
              variants={{ hidden: { clipPath: "inset(-20% 100% -20% 0%)" }, show: { clipPath: "inset(-20% 0% -20% 0%)", transition: { duration: 0.8, ease: "easeInOut", delay: 0.9 } } }}
            >
              together!!
            </motion.span>
            {/* waving avatar (fallback: bust + sparkle) */}
            <motion.div
              className="absolute -left-20 -top-16 w-24 md:-left-32 md:w-32 max-sm:hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0, rotate: [0, -6, 5, -4, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease, delay: 0.4 }}
            >
              <Image src="/assets/avatar/boy-sm.webp" alt="" width={366} height={400} className="h-auto w-full" />
              <Image src="/assets/doodles/sparkle-sm.webp" alt="" width={80} height={74} className="absolute -right-3 top-0 w-8" />
            </motion.div>
          </motion.div>

          <p className="mt-16 max-w-[34ch] text-[19px] text-ink-2">Got a hard backend problem, or a game idea? I&apos;d love to hear it.</p>

          <div className="relative mt-8">
            <button type="button" onClick={copy} className="btn btn-ink min-h-14 px-7 font-mono text-[15px] md:text-[17px]">
              {profile.email}
              <span aria-hidden className="rounded-md bg-white/15 px-2 py-0.5 text-[12px]">
                copy
              </span>
            </button>
            <AnimatePresence>
              {copied && (
                <motion.span role="status" className="absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-success px-3 py-1.5 text-[13px] font-semibold text-white" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
                  Copied! Talk soon.
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <p className="mt-3 font-hand text-[19px] text-ink-2">Email is the fastest way to reach me.</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Social href={profile.links.linkedin} src="/assets/icons/linkedin.webp" label="LinkedIn" />
            <Social href={profile.links.github} src="/assets/icons/github.webp" label="GitHub" />
            <a href={profile.links.resume} download className="btn btn-ghost min-h-12">
              Resume <span aria-hidden>↓</span>
            </a>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-[1000px] gap-6 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <form onSubmit={submit} className="card relative flex flex-col gap-4 p-6 md:p-8">
            <h3 className="h3">Or leave a note</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="name" label="Your name" autoComplete="name" />
              <Field name="email" label="Your email" type="email" autoComplete="email" />
            </div>
            <label className="flex flex-col gap-1.5 text-[14px] font-semibold">
              Message
              <textarea name="message" required rows={4} maxLength={4000} className="rounded-xl border border-line bg-white px-4 py-3 text-[16px] font-normal outline-none focus:border-frame" />
            </label>
            <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" disabled={status === "sending"} className="btn btn-ink relative overflow-visible disabled:opacity-60">
                {status === "sending" ? "Sending…" : "Send it"}
                <AnimatePresence>
                  {status === "sent" && (
                    <motion.span aria-hidden className="absolute right-0 top-0" initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }} animate={{ x: 260, y: -160, opacity: 0, rotate: 20 }} transition={{ duration: 1, ease }}>
                      ✈︎
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <p role="status" className="text-[14px]">
                {status === "sent" && <span className="text-success">Sent. I&apos;ll reply soon.</span>}
                {status === "error" && (
                  <span className="text-accent">
                    That didn&apos;t send. Please email me at{" "}
                    <a className="underline" href={`mailto:${profile.email}`}>
                      {profile.email}
                    </a>
                    .
                  </span>
                )}
              </p>
            </div>
          </form>

          <aside className="relative rounded-[6px] bg-note-yellow p-6 shadow-soft md:p-7">
            <span className="tape -top-3 left-1/2 -ml-[52px] rotate-3" />
            <h3 className="font-display text-[20px] font-extrabold">In a hurry?</h3>
            <dl className="mt-4 space-y-3 text-[15px]">
              {profile.hurry.map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <a href={profile.links.resume} download className="btn btn-ink mt-6 w-full">
              Download resume
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Field({ name, label, type = "text", autoComplete }: { name: string; label: string; type?: string; autoComplete?: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-[14px] font-semibold">
      {label}
      <input name={name} type={type} required autoComplete={autoComplete} maxLength={200} className="min-h-12 rounded-xl border border-line bg-white px-4 text-[16px] font-normal outline-none focus:border-frame" />
    </label>
  );
}

function Social({ href, src, label }: { href: string; src: string; label: string }) {
  return (
    <motion.a href={href} target="_blank" rel="noreferrer" className="btn btn-ghost min-h-12 pl-2" whileHover={{ rotate: [0, -3, 3, 0] }}>
      <Image src={src.replace(".webp", "-sm.webp")} alt="" width={64} height={64} className="h-8 w-8" />
      {label}
    </motion.a>
  );
}
