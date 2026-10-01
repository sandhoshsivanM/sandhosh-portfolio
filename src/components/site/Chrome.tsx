"use client";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const NAV = [
  { id: "about", label: "About" },
  { id: "dream", label: "Dream" },
  { id: "work", label: "Work" },
  { id: "notes", label: "Notes" },
  { id: "contact", label: "Contact" },
];

// The phone menu has room for every section.
const MENU = [
  { id: "about", label: "About" },
  { id: "dream", label: "The dream" },
  { id: "work", label: "Work" },
  { id: "notes", label: "Case notes" },
  { id: "projects", label: "Projects" },
  { id: "journey", label: "Journey" },
  { id: "toolbox", label: "Toolbox" },
  { id: "contact", label: "Contact" },
];

/** A pencil line drawing across the top edge. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-ink" style={{ scaleX }} />;
}

/** Desktop: floating pill after the hero. Phones/tablets: a slim top bar that hides
 *  while scrolling down, shows on scroll-up, and opens a full-screen menu. */
export function Nav() {
  const [visible, setVisible] = useState(false);
  const [barShown, setBarShown] = useState(true);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y > window.innerHeight * 0.75);
      if (Math.abs(y - lastY) > 6) setBarShown(y < lastY || y < 80);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    MENU.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  // full-screen menu: lock page scroll, close on Escape
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* desktop pill */}
      <motion.nav
        aria-label="Sections"
        className="fixed inset-x-0 top-4 z-40 hidden justify-center px-4 lg:flex"
        initial={false}
        animate={visible ? { y: 0, opacity: 1 } : { y: -24, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: visible ? "auto" : "none" }}
      >
        <ul className="sketch-pill flex items-center gap-0.5 bg-[#fffdf7] p-1.5">
          {NAV.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} className="relative flex min-h-11 items-center px-4 text-[14px] font-semibold" aria-current={active === n.id ? "true" : undefined}>
                {n.label}
                {active === n.id && (
                  <motion.svg layoutId="nav-squiggle" viewBox="0 0 60 8" className="absolute inset-x-2 bottom-1.5 h-2 w-[calc(100%-16px)] text-accent" preserveAspectRatio="none" aria-hidden>
                    <path d="M1 5 Q 8 1 15 5 T 30 5 T 45 5 T 59 4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </motion.svg>
                )}
              </a>
            </li>
          ))}
        </ul>
      </motion.nav>

      {/* phone/tablet top bar */}
      <motion.div
        className="fixed inset-x-0 top-0 z-40 px-3 pt-2 lg:hidden"
        initial={false}
        animate={visible && barShown ? { y: 0, opacity: 1 } : { y: "-110%", opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{ pointerEvents: visible && barShown ? "auto" : "none" }}
      >
        <div className="sketch-pill flex items-center justify-between bg-[#fffdf7] py-1 pl-1.5 pr-1">
          <a href="#top" className="flex min-h-11 items-center gap-2 pr-2" aria-label="Back to top">
            <Image src="/icon.png" alt="" width={36} height={36} className="h-9 w-9" />
            <span className="font-sign text-[24px] leading-none">Sandhoshsivan</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-[14px] font-semibold text-paper"
          >
            Menu
            <svg viewBox="0 0 20 14" className="h-3 w-4" aria-hidden>
              <path d="M1 2h18M1 7h18M1 12h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[60] flex flex-col bg-paper px-6 pb-8 pt-4 lg:hidden"
            style={{
              backgroundImage: "linear-gradient(rgb(20 18 16 / .055) 1px, transparent 1px), linear-gradient(90deg, rgb(20 18 16 / .055) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
            initial={{ clipPath: "circle(0% at 92% 4%)" }}
            animate={{ clipPath: "circle(150% at 92% 4%)" }}
            exit={{ clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between">
              <span className="font-sign text-[30px]">Sandhoshsivan</span>
              <button type="button" onClick={() => setOpen(false)} className="flex min-h-11 items-center rounded-full border-2 border-ink px-4 text-[14px] font-semibold" autoFocus>
                Close ✕
              </button>
            </div>
            <motion.ul
              className="mt-8 flex flex-1 flex-col justify-center gap-1"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }}
            >
              {MENU.map((n, i) => (
                <motion.li key={n.id} variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0 } }}>
                  <a
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    className="flex min-h-14 items-baseline gap-4 border-b-2 border-dashed border-ink/15 py-2 font-display text-[clamp(30px,9vw,44px)] font-extrabold tracking-tight"
                  >
                    <span className="font-mono text-[13px] font-semibold text-ink-3">0{i + 1}</span>
                    <span className={active === n.id ? "text-accent" : ""}>{n.label}</span>
                  </a>
                </motion.li>
              ))}
            </motion.ul>
            <div className="mt-6 flex gap-3">
              <a href="/resume.pdf" download className="btn btn-ink flex-1">
                Resume ↓
              </a>
              <a href="#contact" onClick={() => setOpen(false)} className="btn btn-ghost flex-1">
                Say hello
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
