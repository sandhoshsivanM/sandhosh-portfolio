"use client";
import { motion } from "framer-motion";
import { projects } from "@/content/projects";
import { ease } from "@/lib/motion";
import { AppWindow } from "@/components/ui/AppWindow";
import { SectionHead } from "@/components/ui/SectionHead";
import { UnderTheHood } from "@/components/ui/UnderTheHood";

export function Projects() {
  return (
    <section id="projects" className="py-20 md:py-[120px]">
      <div className="container-page">
        <SectionHead eyebrow="After hours" title="Things I build for fun." paper="/assets/paper/torn-purple-sm.webp" />
        <ul className="grid auto-rows-fr gap-8 lg:grid-cols-2">
          {projects.map((p, i) => (
            <motion.li
              key={p.name}
              className="flex"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease, delay: i * 0.1 }}
            >
              <AppWindow title={p.file} className="w-full">
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <h3 className="font-display text-[30px] font-extrabold tracking-tight">{p.name}</h3>
                  <p className="mt-1 text-[18px] font-semibold">{p.pitch}</p>
                  {p.why && (
                    <a href="#about" className="mt-2 font-hand text-[21px] leading-snug text-accent">
                      {p.why}
                    </a>
                  )}
                  <ul className="mt-5 space-y-2.5">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex gap-3 text-[16px]">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <UnderTheHood items={p.hood} />
                  <div className="mt-5 flex flex-wrap gap-3">
                    {p.links.map((l, j) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={`btn ${j === 0 ? "btn-ink" : "btn-ghost"} min-h-11 text-[14px]`}>
                        {l.label} <span aria-hidden>↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              </AppWindow>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
