"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { profile } from "@/content/profile";
import { stickerBurst } from "@/lib/confetti";
import { ease } from "@/lib/motion";

type Status = "idle" | "sent";

const pop = {
  hidden: { opacity: 0, y: 18, scale: 0.85 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 16 } },
};

/** Clipboard API first; the hidden-textarea fallback covers browsers and contexts where it is unavailable. */
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    Object.assign(ta.style, { position: "fixed", top: "0", left: "0", opacity: "0" });
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {}
    ta.remove();
    return ok;
  }
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const notes = useRef<HTMLDivElement>(null);
  const [alive, setAlive] = useState(false);

  // The idle loops below run only while the note cards are on screen.
  useEffect(() => {
    const el = notes.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setAlive(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const copy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (!(await copyText(profile.email))) {
      window.location.href = `mailto:${profile.email}`;
      return;
    }
    stickerBurst(r.left + r.width / 2, r.top);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  // No mail server: the note opens as a Gmail draft addressed to me, already filled in.
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const from = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const params = new URLSearchParams({
      view: "cm",
      fs: "1",
      to: profile.email,
      su: `Hello from ${name}`,
      body: `${message}\n\n— ${name}\n${from}`,
    });
    const tab = window.open(`https://mail.google.com/mail/?${params}`, "_blank", "noopener");
    if (!tab) {
      // pop-up blocked: fall back to the visitor's default mail app
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`Hello from ${name}`)}&body=${encodeURIComponent(`${message}\n\n— ${name}\n${from}`)}`;
    }
    setStatus("sent");
  };

  return (
    <section id="contact" className="scroll-mt-16 pb-12 pt-12 sm:pt-16 md:pt-24 lg:pt-[120px]">
      <div className="container-page">
        <div className="relative flex flex-col items-center text-center">
          {/* Banner composition, drawn to the "Let's build" mockup */}
          <motion.div className="relative mt-16 w-[min(760px,100%)] sm:mt-24 md:mt-32" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
            <h2 className="sr-only">Let&apos;s build together</h2>
            <div aria-hidden className="absolute inset-x-[8%] -bottom-[10%] h-[22%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(60,30,10,0.22),transparent)]" />
            <motion.div
              aria-hidden
              className="relative"
              variants={{ hidden: { opacity: 0, scale: 1.25, rotate: -6 }, show: { opacity: 1, scale: 1, rotate: -2, transition: { type: "spring", stiffness: 220, damping: 16 } } }}
            >
              <Image src="/assets/contact/lets-build.webp" alt="" width={1024} height={378} className="h-auto w-full [filter:drop-shadow(6px_8px_0_rgba(20,18,16,0.9))_drop-shadow(0_26px_28px_rgba(60,30,10,0.35))]" />
              {/* The boy leans over the banner. He lives inside the banner's layer so he tilts with it:
                  his hoodie edge (row 345 of 440) sits on the paper's top edge (24% down the banner,
                  sloping ~3deg), and his hands and pointing finger fall in front of it. */}
              <motion.div
                className="absolute left-[27%] top-[-55.7%] w-[46%]"
                style={{ rotate: -3, transformOrigin: "50% 78%" }}
                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 150, damping: 15, delay: 0.35 } } }}
              >
                <Image src="/assets/contact/boy-point.webp" alt="" width={540} height={440} className="h-auto w-full [filter:drop-shadow(0_10px_10px_rgba(20,18,16,0.38))]" />
              </motion.div>
            </motion.div>
            <motion.div
              aria-hidden
              className="absolute -bottom-[18%] right-0 w-[38%] lg:-right-[4%]"
              variants={{ hidden: { clipPath: "inset(-10% 100% -10% 0%)" }, show: { clipPath: "inset(-10% 0% -10% 0%)", transition: { duration: 0.7, ease: "easeInOut", delay: 0.8 } } }}
            >
              <Image src="/assets/contact/together.webp" alt="" width={585} height={297} className="h-auto w-full [filter:drop-shadow(3px_5px_0_rgba(20,18,16,0.85))_drop-shadow(0_12px_14px_rgba(60,30,10,0.3))]" />
            </motion.div>
            <motion.div
              aria-hidden
              className="absolute -top-[4%] right-[12%] w-[7%]"
              variants={{ hidden: { scale: 0 }, show: { scale: 1, rotate: 15, transition: { type: "spring", stiffness: 260, damping: 12, delay: 1 } } }}
            >
              <Image src="/assets/contact/sparkle.webp" alt="" width={123} height={129} className="h-auto w-full [filter:drop-shadow(2px_3px_0_rgba(20,18,16,0.8))]" />
            </motion.div>
          </motion.div>

          <p className="mt-20 max-w-[34ch] text-[19px] text-ink-2 md:mt-24">Got a hard backend problem, or a game idea? I&apos;d love to hear it.</p>

          <div className="relative mt-8">
            {/* handwritten pointer, desktop only */}
            <p aria-hidden className="absolute right-full top-1/2 mr-6 hidden w-36 -translate-y-1/2 -rotate-6 text-left font-hand text-[19px] leading-tight text-ink lg:block">
              Email is the fastest way to reach me.
              <svg viewBox="0 0 70 30" className="absolute -right-14 top-1 h-7 w-16">
                <path d="M2 20 C 20 2, 45 2, 64 14" fill="none" stroke="#141210" strokeWidth="2" strokeLinecap="round" />
                <path d="M56 8 L65 14 L56 20" fill="none" stroke="#141210" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </p>
            <button
              type="button"
              onClick={copy}
              className="flex min-h-14 max-w-full items-center gap-2 rounded-[14px] border-2 border-ink bg-[#1a1d24] py-2 pl-2 pr-2 font-mono text-[12.5px] text-white min-[380px]:gap-3 min-[380px]:text-[14px] shadow-[4px_5px_0_var(--color-accent)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 md:text-[17px]"
            >
              <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-white/10 max-[379px]:hidden">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </span>
              <span className="px-1">{profile.email}</span>
              <span aria-hidden className="rounded-[8px] bg-white/10 px-3 py-2 text-[13px]">
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
          <p className="mt-3 font-hand text-[19px] text-ink-2 lg:hidden">Email is the fastest way to reach me.</p>

          <motion.div className="mt-8 flex flex-wrap justify-center gap-4" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
            <Social href={profile.links.linkedin} src="/assets/icons/linkedin.webp" label="LinkedIn" />
            <Social href={profile.links.github} src="/assets/icons/github.webp" label="GitHub" />
            <motion.a variants={pop} whileHover={{ rotate: [0, -3, 3, 0] }} href={profile.links.resume} download className="btn btn-ghost min-h-14 rounded-[12px] pl-3 font-mono">
              <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2h9l5 5v15H6z" />
                <path d="M14 2v6h6M9 13h7M9 17h7" />
              </svg>
              Resume <span aria-hidden>↗</span>
            </motion.a>
          </motion.div>
        </div>

        <div ref={notes} data-alive={alive} className="notes mx-auto mt-12 grid max-w-[1000px] gap-8 sm:mt-16 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-6">
          <motion.form
            onSubmit={submit}
            className="card relative flex flex-col gap-4 p-6 md:p-8"
            initial={{ opacity: 0, x: -40, rotate: -3 }}
            whileInView={{ opacity: 1, x: 0, rotate: -0.6 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ type: "spring", stiffness: 140, damping: 16 }}
          >
            {/* The pencil writes a squiggle under the heading, rests, and does it again. */}
            <div className="relative w-fit pb-3">
              <h3 className="h3">Or leave a note</h3>
              <svg aria-hidden viewBox="0 0 240 14" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-3.5 w-full overflow-visible text-accent">
                <path className="loop scribble" d="M2 9 C 22 2, 38 13, 58 7 S 96 3, 118 8 S 160 13, 182 6 S 222 4, 238 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" pathLength={100} />
              </svg>
              <motion.div
                aria-hidden
                className="absolute bottom-[2px] left-0 w-full"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.5 }}
              >
                {/* the image's tip is its bottom-left corner, so that corner rides the line */}
                <div className="loop pencil-ride absolute inset-x-0 bottom-0">
                  <div className="absolute bottom-0 left-0 w-24 sm:w-28">
                    <Image src="/assets/doodles/pencil-sm.webp" alt="" width={400} height={262} className="h-auto w-full drop-shadow-md" />
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="name" label="Your name" autoComplete="name" typing={alive ? "Recruiter at Acme…" : undefined} />
              <Field name="email" label="Your email" type="email" autoComplete="email" />
            </div>
            <label className="flex flex-col gap-1.5 text-[14px] font-semibold">
              Message
              <textarea name="message" required rows={4} maxLength={4000} className="field rounded-xl border-[1.5px] border-ink bg-white px-4 py-3 text-[16px] font-normal outline-none" />
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" className="btn btn-ink relative overflow-visible">
                Open in Gmail <span aria-hidden className="loop hop inline-block">✈︎</span>
                <AnimatePresence>
                  {status === "sent" && (
                    <motion.span aria-hidden className="absolute right-0 top-0" initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }} animate={{ x: 260, y: -160, opacity: 0, rotate: 20 }} transition={{ duration: 1, ease }}>
                      ✈︎
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <p role="status" className="text-[14px] text-ink-2">
                {status === "sent" ? <span className="text-success">Your draft is open in Gmail. Hit send there.</span> : "Opens a ready-to-send draft to me in Gmail."}
              </p>
            </div>
          </motion.form>

          <div className="loop sway origin-top">
          <motion.aside
            className="relative border-2 border-ink bg-note-yellow p-6 shadow-[3px_4px_0_#141210] md:p-7 rounded-[14px_22px_16px_24px/22px_14px_24px_16px]"
            initial={{ opacity: 0, x: 40, y: -20, rotate: 6 }}
            whileInView={{ opacity: 1, x: 0, y: 0, rotate: 1.2 }}
            whileHover={{ rotate: 0, y: -3 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.1 }}
          >
            <span aria-hidden className="loop tape-lift absolute -top-4 left-1/2 -ml-[60px] block h-[34px] w-[120px] origin-left">
            <motion.span
              aria-hidden
              className="tape tape-2 left-0 top-0"
              initial={{ scale: 1.5, opacity: 0, rotate: -12 }}
              whileInView={{ scale: 1, opacity: 1, rotate: 3 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.55 }}
            />
            </span>
            <h3 className="font-display text-[20px] font-extrabold">In a hurry?</h3>
            <motion.dl
              className="mt-4 space-y-3 text-[15px]"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } } }}
            >
              {profile.hurry.map(([k, v]) => (
                <motion.div key={k} variants={{ hidden: { opacity: 0, x: 14 }, show: { opacity: 1, x: 0, transition: { duration: 0.35, ease } } }}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </motion.div>
              ))}
            </motion.dl>
            <a href={profile.links.resume} download className="btn btn-ink group mt-6 w-full">
              Download resume <span aria-hidden className="loop bob inline-block">↓</span>
            </a>
          </motion.aside>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ name, label, type = "text", autoComplete, typing }: { name: string; label: string; type?: string; autoComplete?: string; typing?: string }) {
  const placeholder = useTypedPlaceholder(typing);
  return (
    <label className="flex flex-col gap-1.5 text-[14px] font-semibold">
      {label}
      <input
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        maxLength={200}
        placeholder={placeholder}
        className="field min-h-12 rounded-xl border-[1.5px] border-ink bg-white px-4 text-[16px] font-normal outline-none placeholder:text-ink-3 focus:placeholder:text-transparent"
      />
    </label>
  );
}

/** Types `text` out as a placeholder with a blinking caret, pauses, erases, repeats. Off when `text` is undefined or motion is reduced. */
function useTypedPlaceholder(text?: string) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    if (!text || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    let dir = 1;
    let hold = 0;
    let caret = true;
    const t = window.setInterval(() => {
      caret = !caret;
      if (hold > 0) {
        hold--;
      } else {
        i += dir;
        if (i >= text.length) {
          dir = -1;
          hold = 14;
        } else if (i <= 0) {
          dir = 1;
          hold = 6;
        }
      }
      setShown(text.slice(0, i) + (caret || hold === 0 ? "|" : ""));
    }, 110);
    return () => window.clearInterval(t);
  }, [text]);
  return text ? shown : "";
}

function Social({ href, src, label }: { href: string; src: string; label: string }) {
  return (
    <motion.a variants={pop} href={href} target="_blank" rel="noreferrer" className="btn btn-ghost min-h-14 rounded-[12px] pl-2.5 font-mono" whileHover={{ rotate: [0, -3, 3, 0] }}>
      <Image src={src.replace(".webp", "-sm.webp")} alt="" width={64} height={64} className="h-8 w-8" />
      {label}
    </motion.a>
  );
}
