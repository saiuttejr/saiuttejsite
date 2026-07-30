import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/lib/constants";
import ProjectMedia from "@/components/ProjectMedia";
import SiteHeader from "@/components/SiteHeader";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies across product platforms, backend systems, and tooling — what each project had to solve and how it was built.",
  alternates: { canonical: "/work" },
};

export default function WorkIndexPage() {
  return (
    <main id="main" className="site-stage">
      <SiteHeader />

      <section className="px-4 pb-8 pt-32 md:px-8 md:pt-40 lg:px-12">
        <div className="editorial-shell">
          <span className="section-kicker">Work</span>
          <h1 className="section-heading mt-8 max-w-[16ch]">
            Everything, with the reasoning left in.
          </h1>
          <p className="section-prose mt-8">
            Four projects taken from first commit to something people can
            actually use. Each case study covers the problem, the constraints
            that shaped it, and the decisions worth defending.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20 md:px-8 lg:px-12">
        <div className="editorial-shell">
          <ul className="work-index">
            {projects.map((project, index) => (
              <li
                key={project.slug}
                data-tone={project.slug}
                className="group work-index__item"
              >
                <div className="work-index__media">
                  <ProjectMedia project={project} index={index} variant="grid" />
                </div>

                <div className="work-index__body">
                  <p className="label tone-text">
                    {project.category} · {project.year} · {project.status}
                  </p>
                  <h2 className="mt-4">
                    <Link href={`/work/${project.slug}`} className="work-title-link">
                      {project.name}
                    </Link>
                  </h2>
                  <p className="mt-5 max-w-[58ch] text-text-secondary">
                    {project.summary}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <li key={item} className="data-chip">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Contact />
    </main>
  );
}
