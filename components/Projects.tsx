import Link from "next/link";
import { projects } from "@/lib/constants";

export default function Projects() {
  return (
    <section id="work" className="relative px-4 py-6 md:px-8 md:py-8 lg:px-12">
      <div className="editorial-shell">
        <div className="grid gap-10 border-t border-line pt-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="section-kicker">Work</span>
            <p className="mt-4 max-w-[16rem] text-[0.95rem] leading-[1.82] text-text-muted">
              A few projects that reflect how I think, build, and follow
              through.
            </p>
          </div>

          <div className="divide-y divide-line">
            {projects.map((project, index) => (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                data-tone={project.slug}
                className="group block py-8 first:pt-0 md:py-10"
                data-cursor-hover
                data-cursor-label="case study"
              >
                <div className="grid gap-5 lg:grid-cols-[110px_minmax(0,1fr)_220px] lg:items-start lg:gap-8">
                  <div className="flex items-baseline gap-3 text-text-dim lg:flex-col lg:gap-2">
                    <span className="font-display text-[1.3rem] leading-none tracking-[0.14em]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.12em]">
                      {project.year}
                    </span>
                  </div>

                  <div>
                    <p className="font-mono text-[10px] tracking-[0.12em] tone-text">
                      {project.category} / {project.tagline}
                    </p>
                    <h3 className="mt-3 font-editorial text-[clamp(1.9rem,3vw,3rem)] leading-[1] tracking-[-0.04em] text-text transition-colors duration-300 group-hover:text-accent">
                      {project.name}
                    </h3>
                    <p className="mt-4 max-w-[38rem] text-[0.97rem] leading-[1.88] text-text-muted">
                      {project.summary}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-text-dim transition-colors duration-300 group-hover:text-accent">
                      <span>Read case study</span>
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>

                  <div className="space-y-3 lg:pt-1">
                    {project.metrics.slice(0, 2).map((metric) => (
                      <div key={metric.label} className="border-t border-line pt-3 first:border-t-0 first:pt-0">
                        <p className="tone-text font-editorial text-[1.2rem] leading-[1.05] tracking-[-0.03em]">
                          {metric.value}
                        </p>
                        <p className="mt-1 text-[0.9rem] leading-[1.7] text-text-muted">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
