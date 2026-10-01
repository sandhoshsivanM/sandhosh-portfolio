"use client";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const NAV = [
  { id: "about", label: "About" },
  { id: "dream", label: "Dream" },
  { id: "work", label: "Work" },
  { id: "notes", label: "Notes" },
  { id: "contact", label: "Contact" },
];

/** A pencil line drawing across the top edge. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-ink" style={{ scaleX }} />;
}

/** Floating pill nav: appears after the hero; bottom of the screen on phones. */
export function Nav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <motion.nav
      aria-label="Sections"
      className="fixed inset-x-0 z-40 flex justify-center px-4 max-md:bottom-4 md:top-4"
      initial={false}
      animate={visible ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <ul className="sketch-pill flex items-center gap-0.5 bg-[#fffdf7] p-1.5">
        {NAV.map((n) => (
          <li key={n.id}>
            <a href={`#${n.id}`} className="relative flex min-h-11 items-center px-3 text-[14px] font-semibold sm:px-4" aria-current={active === n.id ? "true" : undefined}>
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
  );
}
