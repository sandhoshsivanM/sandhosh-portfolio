"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { VIEW_META } from "@/lib/architecture/views";
import type { ViewId } from "@/lib/architecture/types";
import { AboutSection } from "@/components/sections/AboutSection";
import { CaseStudiesSection } from "@/components/sections/CaseStudiesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";

function Body({ view }: { view: ViewId }) {
  switch (view) {
    case "about":
      return <AboutSection />;
    case "experience":
      return <ExperienceSection />;
    case "skills":
      return <SkillsSection />;
    case "projects":
      return <ProjectsSection />;
    case "cases":
      return <CaseStudiesSection />;
    case "contact":
      return <ContactSection />;
  }
}

export function SectionPanel({ view, onClose }: { view: ViewId; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const meta = VIEW_META[view];

  useFocusTrap(ref, true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${view}-title`}
      className="custom-scrollbar max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-wire bg-ink/95 shadow-2xl backdrop-blur-xl"
    >
      <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-wire bg-ink/95 px-6 py-4 backdrop-blur-xl">
        <div>
          <p className="font-mono text-xs text-accent">{meta.kicker}</p>
          <h2
            id={`${view}-title`}
            data-autofocus
            tabIndex={-1}
            className="font-display text-2xl font-bold tracking-tight text-fg outline-none"
          >
            {meta.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close section"
          className="rounded-lg border border-wire p-2 text-muted transition-colors hover:border-accent hover:text-accent"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </header>

      <div id="content" className="px-6 py-6">
        <Body view={view} />
      </div>
    </div>
  );
}
