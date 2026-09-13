import type { Metadata } from "next";
import { SectionShell } from "@/components/sections/SectionShell";
import { ProjectsSection } from "@/components/sections/ProjectsSection";

export const metadata: Metadata = { title: "Projects" };

export default function Page() {
  return (
    <SectionShell view="projects">
      <ProjectsSection />
    </SectionShell>
  );
}
