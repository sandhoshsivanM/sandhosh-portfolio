"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { erpModules, type ErpScreen } from "@/content/erp";
import { ease, springPop } from "@/lib/motion";
import { SectionHead } from "@/components/ui/SectionHead";
import { UnderTheHood } from "@/components/ui/UnderTheHood";

const TILT = [-1, 0.8, -0.6, 1, -0.8, 0.6];

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
        <ul className="grid auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-3">
          {erpModules.map((m, i) => (
            <motion.li
              key={m.title}
              className="relative"
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...springPop, stiffness: 180, delay: (i % 3) * 0.08 }}
              whileHover={{ y: -4 }}
            >
              {/* grid cell stays straight; only the paper layer tilts */}
              <div aria-hidden className="sketch absolute inset-0" style={{ rotate: `${TILT[i]}deg` }} />
              <motion.span
                aria-hidden
                className={`tape tape-${(i % 4) + 1} -top-3 left-1/2 z-10 -ml-[60px]`}
                style={{ rotate: `${-TILT[i] * 3}deg` }}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ ...springPop, delay: 0.35 + (i % 3) * 0.08 }}
              />
              <article className="relative flex h-full flex-col p-3 pb-5">
                <div className="aspect-[16/10] overflow-hidden rounded-[6px] border-[1.5px] border-ink bg-paper">
                  <Screen kind={m.screen} />
                </div>
                <div className="flex flex-1 flex-col px-2 pt-4">
                  <h3 className="h3">{m.title}</h3>
                  <p className="mt-1.5 text-[15px] text-ink-2">{m.line}</p>
                  {m.note && (
                    <a href="#about" className="mt-2 w-fit font-hand text-[19px] text-accent link-draw">
                      ↖ {m.note}
                    </a>
                  )}
                  <UnderTheHood items={[m.hood]} />
                </div>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Frame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col p-3 font-mono text-[10px] text-ink-2">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold uppercase tracking-[0.12em] text-ink">{title}</span>
        <span className="flex gap-1">
          <i className="h-1.5 w-1.5 rounded-full bg-ink/20" />
          <i className="h-1.5 w-1.5 rounded-full bg-ink/20" />
        </span>
      </div>
      <div className="relative flex-1">{children}</div>
    </div>
  );
}

const show = { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.6 } } as const;

function Screen({ kind }: { kind: ErpScreen }) {
  switch (kind) {
    case "calendar":
      return (
        <Frame title="Attendance · Oct">
          <div className="flex h-full gap-3">
            <motion.div className="grid flex-1 grid-cols-7 gap-1" {...show} variants={{ show: { transition: { staggerChildren: 0.025 } } }}>
              {Array.from({ length: 28 }, (_, i) => (
                <motion.i
                  key={i}
                  className={`rounded-[3px] ${i % 7 > 4 ? "bg-ink/10" : i === 17 ? "bg-accent/80" : "bg-success/80"}`}
                  variants={{ hidden: { opacity: 0, scale: 0.4 }, show: { opacity: 1, scale: 1 } }}
                />
              ))}
            </motion.div>
            <div className="flex w-14 flex-col justify-center text-center">
              <span className="font-display text-[22px] font-extrabold text-ink">96%</span>
              <span>present</span>
            </div>
          </div>
        </Frame>
      );
    case "flow":
      return (
        <Frame title="Purchase flow">
          <div className="flex h-full items-center justify-between gap-1">
            {["RFQ", "PO", "GRN", "INV"].map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <motion.span
                  className="grid h-10 w-10 place-items-center rounded-lg border-[1.5px] border-ink bg-white font-bold text-ink md:h-11 md:w-11"
                  {...show}
                  variants={{ hidden: { backgroundColor: "#ffffff" }, show: { backgroundColor: ["#ffffff", "#ffc53d", "#ffffff"], transition: { delay: 0.3 + i * 0.35, duration: 0.6 } } }}
                >
                  {s}
                </motion.span>
                {i < 3 && <span className="text-ink">→</span>}
              </div>
            ))}
          </div>
        </Frame>
      );
    case "ledger":
      return (
        <Frame title="Journal #4821">
          <table className="w-full text-left">
            <thead>
              <tr className="text-ink-3">
                <th className="font-normal">Account</th>
                <th className="text-right font-normal">Dr</th>
                <th className="text-right font-normal">Cr</th>
              </tr>
            </thead>
            <tbody className="text-ink">
              {[["Inventory", "4,200.00", ""], ["VAT input", "210.00", ""], ["Accounts payable", "", "4,410.00"]].map((r) => (
                <tr key={r[0]} className="border-t border-line">
                  <td className="py-1">{r[0]}</td>
                  <td className="text-right">{r[1]}</td>
                  <td className="text-right">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <motion.span
            className="absolute bottom-0 right-0 rounded-full bg-success px-2 py-0.5 font-semibold text-white"
            {...show}
            variants={{ hidden: { scale: 0, rotate: -20 }, show: { scale: 1, rotate: -4, transition: { ...springPop, delay: 0.6 } } }}
          >
            Balanced ✓
          </motion.span>
        </Frame>
      );
    case "workorder":
      return (
        <Frame title="WO-1187 · Chiller 2">
          <p className="text-ink">Planned maintenance</p>
          <p>Assigned · HVAC team · Due Fri</p>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-ink/10">
            <motion.div className="h-full rounded-full bg-frame" {...show} variants={{ hidden: { width: "0%" }, show: { width: "72%", transition: { duration: 1.2, ease, delay: 0.3 } } }} />
          </div>
          <p className="mt-1.5 text-right">72%</p>
        </Frame>
      );
    case "checklist":
      return (
        <Frame title="Hot-work permit">
          <motion.ul className="space-y-1.5 text-ink" {...show} variants={{ show: { transition: { staggerChildren: 0.3, delayChildren: 0.3 } } }}>
            {["Area cleared", "Fire watch assigned", "Gas test passed", "Supervisor sign-off"].map((c) => (
              <motion.li key={c} className="flex items-center gap-2" variants={{ hidden: { opacity: 0.35 }, show: { opacity: 1 } }}>
                <motion.span className="grid h-3.5 w-3.5 place-items-center rounded-[3px] border border-ink text-[9px]" variants={{ hidden: { backgroundColor: "#fff", color: "#fff" }, show: { backgroundColor: "#1e9e6a", color: "#fff" } }}>
                  ✓
                </motion.span>
                {c}
              </motion.li>
            ))}
          </motion.ul>
        </Frame>
      );
    case "ocr":
      return (
        <Frame title="Invoice.pdf → fields">
          <div className="flex h-full gap-3">
            <div className="relative w-[42%] overflow-hidden rounded-[3px] border border-line bg-white p-2">
              {[80, 60, 90, 50, 70, 40].map((w, i) => (
                <i key={i} className="mb-1.5 block h-1 rounded bg-ink/20" style={{ width: `${w}%` }} />
              ))}
              <motion.i
                className="absolute inset-x-0 h-0.5 bg-accent shadow-[0_0_8px_#ff5b1f]"
                initial={{ top: "0%" }}
                whileInView={{ top: ["0%", "100%", "0%"] }}
                viewport={{ once: false }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <ul className="flex-1 space-y-1 text-ink">
              <li>
                <span className="text-ink-3">Vendor</span> Al Noor LLC
              </li>
              <li>
                <span className="text-ink-3">Total</span> AED 4,410
              </li>
              <li>
                <span className="text-ink-3">Date</span> 14 Oct
              </li>
            </ul>
          </div>
        </Frame>
      );
  }
}
