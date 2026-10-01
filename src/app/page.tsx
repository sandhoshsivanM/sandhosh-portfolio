import { About } from "@/components/site/About";
import { CaseNotes } from "@/components/site/CaseNotes";
import { Nav, ScrollProgress } from "@/components/site/Chrome";
import { Contact } from "@/components/site/Contact";
import { ErpModules } from "@/components/site/ErpModules";
import { Footer } from "@/components/site/Footer";
import { GameDream } from "@/components/site/GameDream";
import { Hero } from "@/components/site/Hero";
import { Journey } from "@/components/site/Journey";
import { Loader } from "@/components/site/Loader";
import { Projects } from "@/components/site/Projects";
import { Toolbox } from "@/components/site/Toolbox";

export default function Home() {
  return (
    <>
      <Loader />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <About />
        <GameDream />
        <ErpModules />
        <CaseNotes />
        <Projects />
        <Journey />
        <Toolbox />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
