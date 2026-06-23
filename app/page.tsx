import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import F1StartLights from "@/components/F1StartLights";

export default function Home() {
  return (
    <main className="site-stage">
      <F1StartLights />
      <Navigation />
      <Hero />
      <Projects />
      <About />
      <Certifications />
      <Contact />
    </main>
  );
}
