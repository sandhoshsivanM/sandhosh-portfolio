"use client";
import { useEffect, useState, type RefObject } from "react";

/** Phone-only position dots for a horizontal scroll-snap list. Tapping a dot scrolls to that card. */
export function SwipeDots({ list, count, label }: { list: RefObject<HTMLElement | null>; count: number; label: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const items = Array.from(el.children) as HTMLElement[];
        const mid = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        items.forEach((it, i) => {
          if (Math.abs(it.offsetLeft + it.offsetWidth / 2 - mid) < Math.abs(items[best].offsetLeft + items[best].offsetWidth / 2 - mid)) best = i;
        });
        setActive(best);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, [list]);

  const go = (i: number) => {
    const el = list.current;
    const it = el?.children[i] as HTMLElement | undefined;
    if (el && it) el.scrollTo({ left: it.offsetLeft - (el.clientWidth - it.offsetWidth) / 2, behavior: "smooth" });
  };

  return (
    <div className="mt-2 flex items-center justify-center gap-1 md:hidden" role="group" aria-label={`${label}: card ${active + 1} of ${count}`}>
      {Array.from({ length: count }, (_, i) => (
        <button key={i} type="button" onClick={() => go(i)} aria-label={`Show card ${i + 1}`} className="grid h-11 w-7 place-items-center">
          <span className={`block h-2.5 rounded-full border-[1.5px] border-ink transition-all duration-300 ${i === active ? "w-6 bg-accent" : "w-2.5 bg-transparent"}`} />
        </button>
      ))}
    </div>
  );
}
