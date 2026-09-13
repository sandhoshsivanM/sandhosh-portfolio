import type { Metadata } from "next";
import { SectionShell } from "@/components/sections/SectionShell";
import { CaseStudiesSection } from "@/components/sections/CaseStudiesSection";

export const metadata: Metadata = { title: "Case Studies" };

export default function Page() {
  return (
    <SectionShell view="cases">
      <CaseStudiesSection />
    </SectionShell>
  );
}
