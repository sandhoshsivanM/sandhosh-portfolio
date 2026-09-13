import type { Metadata } from "next";
import { SectionShell } from "@/components/sections/SectionShell";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = { title: "Contact" };

export default function Page() {
  return (
    <SectionShell view="contact">
      <ContactSection />
    </SectionShell>
  );
}
