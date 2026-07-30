import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Approach from "@/components/Approach";
import Timeline from "@/components/Timeline";
import Signals from "@/components/Signals";
import Contact from "@/components/Contact";
import F1StartLights from "@/components/F1StartLights";

export default function Home() {
  return (
    <main id="main" className="site-stage">
      <F1StartLights />
      <Navigation />
      <Hero />
      <Projects />
      <Approach />
      <Timeline />
      <Signals />
      <Contact />
    </main>
  );
}
