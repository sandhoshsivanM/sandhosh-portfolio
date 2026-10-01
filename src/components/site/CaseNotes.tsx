"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { caseNotes } from "@/content/caseNotes";
import { ease, springPop } from "@/lib/motion";
import { SectionHead } from "@/components/ui/SectionHead";
import { UnderTheHood } from "@/components/ui/UnderTheHood";

export function CaseNotes() {
  return (
    <section id="notes" className="py-20 md:py-[120px]">
      <div className="container-page">
        <SectionHead eyebrow="Case notes" title="Hard problems, solved." lead="Big result first. Then what went wrong, what I did, and the exact stack if you want it." paper="/assets/paper/torn-orange-sm.webp" />
        <ul className="grid auto-rows-fr gap-6 md:grid-cols-2" style={{ perspective: 1200 }}>
          {caseNotes.map((n, i) => (
            <motion.li
              key={n.result}
              className="relative flex"
              style={{ transformOrigin: "top" }}
              initial={{ rotateX: -18, opacity: 0, y: -16 }}
              whileInView={{ rotateX: 0, opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.6, ease, delay: (i % 2) * 0.08 }}
            >
              <article className="relative flex w-full flex-col border-2 border-ink p-6 shadow-[3px_4px_0_#141210] md:p-8 rounded-[14px_22px_16px_24px/22px_14px_24px_16px]" style={{ background: n.tint }}>
                <span className={`tape tape-${(i % 3) + 2} -top-4 left-6 -rotate-3`} />
                <motion.div
                  aria-hidden
                  className="absolute -right-3 -top-5 w-16 md:w-20"
                  initial={{ scale: 0, rotate: -30 }}
                  whileInView={{ scale: 1, rotate: 8 }}
                  viewport={{ once: true }}
                  transition={{ ...springPop, delay: 0.5 }}
                >
                  <Image src={n.doodle.replace(".webp", "-sm.webp")} alt="" width={200} height={200} className="h-auto w-full drop-shadow-md" />
                </motion.div>
                <div className="flex items-start gap-2 pr-12">
                  <Image src="/assets/doodles/star-sm.webp" alt="" width={40} height={38} className="mt-1 w-6 shrink-0" />
                  <h3 className="font-display text-[clamp(26px,3vw,36px)] font-extrabold leading-[1.05] tracking-tight">{n.result}</h3>
                </div>
                <p className="mt-4 text-[17px] leading-relaxed text-ink">{n.story}</p>
                <UnderTheHood items={n.hood.split(", ")} />
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
