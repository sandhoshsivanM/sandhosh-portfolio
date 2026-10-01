"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { aiTools, certificates, integration, toolbox } from "@/content/toolbox";
import { ease, springPop } from "@/lib/motion";
import { SectionHead } from "@/components/ui/SectionHead";

export function Toolbox() {
  return (
    <section id="toolbox" className="py-20 md:py-[120px]">
      <div className="container-page">
        <SectionHead eyebrow="Toolbox" title="Grouped by what they're for." paper="/assets/paper/torn-blue-grid-sm.webp" />
        <ul className="grid auto-rows-fr gap-x-5 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {toolbox.map((b, i) => (
            <motion.li
              key={b.title}
              className="card relative flex flex-col p-6 pt-14"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
            >
              <div className="absolute -top-6 left-5 flex">
                {(b.game ? ["gamepad"] : b.stickers).map((s, j) => (
                  <motion.div
                    key={s}
                    className="-ml-2 w-14 first:ml-0"
                    initial={{ scale: 1.4, opacity: 0, rotate: 0 }}
                    whileInView={{ scale: 1, opacity: 1, rotate: j % 2 ? 8 : -8 }}
                    viewport={{ once: true }}
                    whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
                    transition={{ ...springPop, delay: 0.3 + i * 0.08 + j * 0.08 }}
                  >
                    <Image src={b.game ? "/assets/game/gamepad.webp" : `/assets/stickers/${s}-sm.webp`} alt={b.game ? "" : s} width={200} height={200} className="h-auto w-full drop-shadow-md" />
                  </motion.div>
                ))}
              </div>
              <h3 className="h3">{b.title}</h3>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {b.tools.map((t) => (
                  <span key={t} className="chip text-ink">
                    {t}
                  </span>
                ))}
              </div>
            </motion.li>
          ))}
        </ul>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
            <div className="flex shrink-0">
              {aiTools.map((t, i) => (
                <motion.div key={t.name} className="-ml-1.5 w-11 first:ml-0" whileHover={{ y: -4, rotate: i % 2 ? 6 : -6 }}>
                  <Image src={t.src} alt={t.name} width={120} height={120} className="h-auto w-full drop-shadow" />
                </motion.div>
              ))}
            </div>
            <div>
              <h3 className="font-display text-[18px] font-bold">My AI pair-programmers</h3>
              <p className="text-[15px] text-ink-2">Claude, Cursor and Copilot. I review every line they write.</p>
            </div>
          </div>
          <div className="card flex flex-col justify-center p-6">
            <h3 className="font-display text-[18px] font-bold">{integration.title}</h3>
            <p className="text-[15px] text-ink-2">
              Enough to wire my APIs into the screens others build: <span className="font-mono text-[13px]">{integration.tools.join(" · ")}</span>
            </p>
          </div>
        </div>

        <ul className="mt-6 flex flex-wrap gap-2">
          {certificates.map((c) => (
            <li key={c} className="chip">
              <span className="text-success">✓</span> {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
