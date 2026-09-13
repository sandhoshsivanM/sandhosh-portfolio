import type { Metadata } from "next";
import { SectionShell } from "@/components/sections/SectionShell";
import { AboutSection } from "@/components/sections/AboutSection";

export const metadata: Metadata = { title: "About" };

export default function Page() {
  return (
    <SectionShell view="about">
      <AboutSection />
    </SectionShell>
  );
}
