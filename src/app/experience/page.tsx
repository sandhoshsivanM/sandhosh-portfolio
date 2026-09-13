import type { Metadata } from "next";
import { SectionShell } from "@/components/sections/SectionShell";
import { ExperienceSection } from "@/components/sections/ExperienceSection";

export const metadata: Metadata = { title: "Experience" };

export default function Page() {
  return (
    <SectionShell view="experience">
      <ExperienceSection />
    </SectionShell>
  );
}
