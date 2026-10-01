"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { erpModules, type ErpScreen } from "@/content/erp";
import { ease, springPop } from "@/lib/motion";
import { SectionHead } from "@/components/ui/SectionHead";
import { UnderTheHood } from "@/components/ui/UnderTheHood";

const TILT = [-1.6, 1.2, -0.8, 1.4, -1.2, 0.9];
const show = { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.5 } } as const;

export function ErpModules() {
  return (
    <section id="work" className="py-20 md:py-[120px]">
      <div className="container-page">
        <SectionHead
          eyebrow="What I built"
          title="One ERP, six worlds."
          lead="HR, buying, money, buildings, safety and paperwork for a 2,000-person company. I built the backend for all of it."
          paper="/assets/paper/torn-blue-grid-sm.webp"
        />
        <ul className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {erpModules.map((m, i) => (
            <motion.li
              key={m.title}
              className="relative flex"
              initial={{ opacity: 0, y: -30, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: TILT[i] }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...springPop, stiffness: 170, delay: (i % 3) * 0.08 }}
            >
              <article className="erp-card relative flex w-full flex-col px-6 pb-5 pt-7">
                <motion.span
                  aria-hidden
                  className={`tape tape-${(i % 4) + 1} -top-5 left-1/2 z-10 -ml-[70px] !h-[40px] !w-[140px]`}
                  style={{ rotate: `${-TILT[i] * 1.5}deg` }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ ...springPop, delay: 0.35 + (i % 3) * 0.08 }}
                />
                <span aria-hidden className="absolute right-5 top-4 flex gap-1.5">
                  <i className="h-3 w-3 rounded-full bg-[#a3a7ae]" />
                  <i className="h-3 w-3 rounded-full bg-[#4b5160]" />
                  <i className="h-3 w-3 rounded-full bg-[#1d2433]" />
                </span>

                <div className="min-h-[178px]">
                  <Screen kind={m.screen} />
                </div>

                <hr className="my-4 border-t-[1.5px] border-[#1d2433]/30" />

                <h3 className="font-display text-[23px] font-extrabold leading-tight tracking-tight">
                  <Highlight>{m.title}</Highlight>
                </h3>
                <p className="mt-2 font-print text-[19px] leading-snug text-ink">{m.line}</p>
                {m.note && (
                  <a href="#about" className="mt-1 w-fit font-hand text-[20px] text-accent link-draw">
                    ↖ {m.note}
                  </a>
                )}
                <UnderTheHood items={[m.hood]} />
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Yellow highlighter stroke under a heading. */
function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline">
      <motion.span
        aria-hidden
        className="absolute -inset-x-1 bottom-[-0.08em] h-[0.3em] rounded-full bg-sun/90"
        style={{ transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 0.5, ease, delay: 0.5 }}
      />
      <span className="relative">{children}</span>
    </span>
  );
}

/** Hand-drawn emphasis ticks, like the ones around the mockups. */
function Ticks({ className = "", color = "#ffc53d", flip }: { className?: string; color?: string; flip?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 24 30" className={`absolute h-8 w-6 ${flip ? "-scale-x-100" : ""} ${className}`}>
      <g stroke={color} strokeWidth="3.2" strokeLinecap="round">
        <path d="M20 4 L12 11" />
        <path d="M22 15 L11 15" />
        <path d="M20 26 L12 19" />
      </g>
    </svg>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="pr-16 font-mono text-[13px] font-semibold uppercase tracking-[0.12em] text-[#1d2433]">{children}</p>;
}

const box = "border-[1.5px] border-[#1d2433]";

function Screen({ kind }: { kind: ErpScreen }) {
  switch (kind) {
    case "calendar":
      return (
        <>
          <Label>Attendance · Oct</Label>
          <div className="relative mt-3 flex items-center gap-4">
            <Ticks className="-left-6 top-6" color="#1e9e6a" />
            <motion.div className="grid flex-1 grid-cols-7 gap-1.5" {...show} variants={{ show: { transition: { staggerChildren: 0.02 } } }}>
              {Array.from({ length: 28 }, (_, i) => (
                <motion.i
                  key={i}
                  className={`aspect-square rounded-[5px] ${box} ${i % 7 > 4 ? "bg-[#dcd8cf]" : i === 17 ? "bg-accent" : i % 3 ? "bg-[#2fae6e]" : "bg-[#5cc184]"}`}
                  variants={{ hidden: { opacity: 0, scale: 0.4 }, show: { opacity: 1, scale: 1 } }}
                />
              ))}
            </motion.div>
            <div className="relative w-[72px] text-center">
              <Ticks className="-right-4 -top-5" />
              <span className="block font-display text-[30px] font-extrabold leading-none">
                <Highlight>96%</Highlight>
              </span>
              <span className="mt-1 block font-print text-[18px]">present</span>
            </div>
          </div>
        </>
      );
    case "flow":
      return (
        <>
          <Label>Purchase flow</Label>
          <div className="relative mt-9 flex items-center justify-between gap-1">
            <Ticks className="-left-6 -top-3" flip />
            <Ticks className="-right-6 -top-3" />
            {[
              ["RFQ", "#8fc3f5"],
              ["PO", "#ffd75e"],
              ["GRN", "#93d6a9"],
              ["INV", "#f7a594"],
            ].map(([s, c], i) => (
              <div key={s} className="flex items-center gap-1">
                <motion.span
                  className={`grid h-12 w-12 place-items-center rounded-[10px] font-mono text-[13px] font-bold text-[#1d2433] ${box}`}
                  style={{ background: c }}
                  {...show}
                  variants={{ hidden: { y: 0 }, show: { y: [0, -8, 0], transition: { delay: 0.3 + i * 0.3, duration: 0.45 } } }}
                >
                  {s}
                </motion.span>
                {i < 3 && <span className="text-[18px] font-bold text-[#1d2433]">→</span>}
              </div>
            ))}
          </div>
        </>
      );
    case "ledger":
      return (
        <>
          <Label>Journal #4821</Label>
          <table className="mt-3 w-full text-left font-mono text-[12px] text-[#1d2433]">
            <thead>
              <tr className="text-ink-3">
                <th className="pb-1 font-normal">Account</th>
                <th className="pb-1 text-right font-normal">Dr</th>
                <th className="pb-1 text-right font-normal">Cr</th>
              </tr>
            </thead>
            <tbody>
              {[["Inventory", "4,200.00", ""], ["VAT input", "210.00", ""], ["Payables", "", "4,410.00"]].map((r) => (
                <tr key={r[0]} className="border-t border-dashed border-[#1d2433]/30">
                  <td className="py-1.5">{r[0]}</td>
                  <td className="text-right">{r[1]}</td>
                  <td className="text-right">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <motion.span
            className={`mt-3 ml-auto block w-fit rounded-full bg-[#2fae6e] px-3 py-1 font-mono text-[12px] font-bold text-white ${box}`}
            {...show}
            variants={{ hidden: { scale: 0, rotate: -20 }, show: { scale: 1, rotate: -5, transition: { ...springPop, delay: 0.6 } } }}
          >
            Balanced ✓
          </motion.span>
        </>
      );
    case "workorder":
      return (
        <>
          <Label>WO-1187 · Chiller 2</Label>
          <p className="mt-3 font-mono text-[13px] text-[#1d2433]">Planned maintenance</p>
          <p className="font-mono text-[12px] text-[#5a6377]">Assigned · HVAC team · Due Fri</p>
          <div className="relative mt-5">
            <Ticks className="-left-6 -top-2" flip />
            <Ticks className="-right-6 -top-2" />
            <div className={`h-5 overflow-hidden rounded-full bg-[#dcd8cf] ${box}`}>
              <motion.div className="h-full rounded-full bg-frame" {...show} variants={{ hidden: { width: "0%" }, show: { width: "72%", transition: { duration: 1.2, ease, delay: 0.3 } } }} />
            </div>
            <p className="mt-1.5 text-right font-mono text-[14px] font-bold text-[#1d2433]">72%</p>
          </div>
        </>
      );
    case "checklist":
      return (
        <>
          <Label>Hot-work permit</Label>
          <motion.ul className="relative mt-3 space-y-2 font-mono text-[13px] text-[#1d2433]" {...show} variants={{ show: { transition: { staggerChildren: 0.25, delayChildren: 0.3 } } }}>
            <Ticks className="-right-1 -top-1" color="#1e9e6a" />
            {["Area cleared", "Fire watch assigned", "Gas test passed", "Supervisor sign-off"].map((c) => (
              <motion.li key={c} className="flex items-center gap-3" variants={{ hidden: { opacity: 0.35 }, show: { opacity: 1 } }}>
                <motion.span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-[6px] text-[13px] font-bold ${box}`}
                  variants={{ hidden: { backgroundColor: "#fbf6ea", color: "#fbf6ea" }, show: { backgroundColor: "#1e9e6a", color: "#ffffff" } }}
                >
                  ✓
                </motion.span>
                {c}
              </motion.li>
            ))}
          </motion.ul>
        </>
      );
    case "ocr":
      return (
        <>
          <Label>Invoice.pdf → fields</Label>
          <div className="relative mt-3 flex gap-4 rounded-[10px] border-[1.5px] border-[#1d2433]/25 bg-[#ecebe6] p-3">
            <Ticks className="-left-6 top-6" flip />
            <Ticks className="-right-6 top-6" />
            <div className="relative w-[44%] overflow-hidden rounded-[6px] border border-[#1d2433]/20 bg-white p-2.5 shadow-[2px_2px_0_rgba(29,36,51,.12)] [clip-path:polygon(0_0,100%_0,100%_86%,86%_100%,0_100%)]">
              {[70, 90, 60, 80, 50, 65, 45].map((w, i) => (
                <i key={i} className={`mb-1.5 block h-1.5 rounded ${i === 1 ? "bg-accent" : "bg-[#c4c6cc]"}`} style={{ width: `${w}%` }} />
              ))}
              <i className="scan absolute inset-x-0 top-0 h-0.5 bg-accent shadow-[0_0_8px_#ff5b1f] [--scan-h:96px]" />
            </div>
            <dl className="flex-1 space-y-2 self-center font-mono text-[12px] text-[#1d2433]">
              {[["Vendor", "Al Noor LLC"], ["Total", "AED 4,410"], ["Date", "14 Oct"]].map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <dt className="w-12 shrink-0 text-[#6b7280]">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </>
      );
  }
}
