import Link from "next/link";
import { projects } from "@/lib/constants";
import ProjectCover from "@/components/ProjectCover";

export default function Projects() {
  return (
    <section id="work" className="relative px-4 py-6 md:px-8 md:py-8 lg:px-12">
      <div className="editorial-shell">
        <div className="grid gap-10 border-t border-line pt-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="section-kicker">Work</span>
            <p className="mt-4 max-w-[16rem] text-[0.95rem] leading-[1.82] text-text-muted">
              A few things I&apos;ve built end to end — how I think, ship, and
              follow through.
            </p>
          </div>

          <div className="divide-y divide-line">
            {projects.map((project, index) => (
              <div
                key={project.slug}
                data-tone={project.slug}
                className="group py-8 first:pt-0 md:py-10"
              >
                <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_180px] lg:items-start lg:gap-8">
                  <Link
                    href={`/work/${project.slug}`}
                    aria-label={`View ${project.name} case study`}
                    className="block"
                    data-cursor-hover
                    data-cursor-label="case study"
                  >
                    <ProjectCover project={project} index={index} />
                  </Link>

                  <div>
                    <p className="font-mono text-xs tracking-[0.08em] tone-text">
                      {project.category} / {project.tagline}
                    </p>
                    <h3 className="mt-3 font-editorial text-[clamp(1.9rem,3vw,3rem)] leading-[1] tracking-[-0.04em] text-text transition-colors duration-300 group-hover:text-accent">
                      {project.name}
                    </h3>
                    <p className="mt-4 max-w-[38rem] text-[0.97rem] leading-[1.88] text-text-muted">
                      {project.summary}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                      <Link
                        href={`/work/${project.slug}`}
                        className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.08em] text-text-dim transition-colors duration-300 hover:text-accent"
                        data-cursor-hover
                        data-cursor-label="case study"
                      >
                        <span>Read case study</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.08em] text-text-dim transition-colors duration-300 hover:text-accent"
                        >
                          <span>Visit site</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.08em] text-text-dim transition-colors duration-300 hover:text-accent"
                        >
                          <span>GitHub</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      )}
                      {project.feedbackUrl && (
                        <a
                          href={project.feedbackUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.08em] text-text-dim transition-colors duration-300 hover:text-accent"
                        >
                          <span>Feedback</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </div>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
