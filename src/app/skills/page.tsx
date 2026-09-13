import type { Metadata } from "next";
import { SectionShell } from "@/components/sections/SectionShell";
import { SkillsSection } from "@/components/sections/SkillsSection";

export const metadata: Metadata = { title: "Skills" };

export default function Page() {
  return (
    <SectionShell view="skills">
      <SkillsSection />
    </SectionShell>
  );
}
