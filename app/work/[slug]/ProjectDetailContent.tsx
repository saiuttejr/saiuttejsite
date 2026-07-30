"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { projects, type Project } from "@/lib/constants";
import ProjectMedia from "@/components/ProjectMedia";
import { DURATION, EASE_CINEMATIC, EASE_OUT, clipReveal } from "@/lib/animations";

interface ProjectDetailContentProps {
  project: Project;
}

export default function ProjectDetailContent({ project }: ProjectDetailContentProps) {
  const rootRef = useRef<HTMLElement>(null);
  const index = projects.findIndex((entry) => entry.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  useEffect(() => {
    if (!rootRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".detail-title",
        { ...clipReveal.from },
        {
          ...clipReveal.to,
          duration: DURATION.reveal,
          ease: EASE_CINEMATIC,
          delay: 0.15,
        }
      );

      gsap.fromTo(
        ".detail-meta",
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DURATION.normal,
          ease: EASE_OUT,
          stagger: 0.07,
          delay: 0.3,
        }
      );
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <article
      ref={rootRef}
      data-tone={project.slug}
      className="px-4 pb-8 pt-32 md:px-8 md:pt-40 lg:px-12"
    >
      <div className="editorial-shell">
        <header>
          <p className="detail-meta label tone-text">
            {project.category} · {project.year} · {project.status}
          </p>
          <h1 className="detail-title section-heading mt-6 max-w-[14ch]">
            {project.name}
          </h1>
          <p className="detail-meta case-tagline mt-6">{project.tagline}</p>
        </header>

        <div className="case-cover">
          <ProjectMedia project={project} index={index} variant="featured" />
        </div>

        <dl className="case-facts">
          <div>
            <dt className="label">Role</dt>
            <dd className="mt-3 text-text-secondary">{project.role}</dd>
          </div>
          <div>
            <dt className="label">Stack</dt>
            <dd className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span key={item} className="data-chip">
                  {item}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="label">Links</dt>
            <dd className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-text-secondary"
                >
                  Live site ↗
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-text-secondary"
                >
                  GitHub ↗
                </a>
              )}
              {project.feedbackUrl && (
                <a
                  href={project.feedbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-text-secondary"
                >
                  Feedback ↗
                </a>
              )}
            </dd>
          </div>
        </dl>

        {/* The problem carries the most typographic weight on the page — it is
            what makes every decision below it legible. */}
        <section className="case-section">
          <h2 className="case-section__label">The problem</h2>
          <p className="case-lede">{project.detail.problem}</p>
        </section>

        <section className="case-section">
          <h2 className="case-section__label">Constraints</h2>
          <ul className="case-constraints">
            {project.detail.constraints.map((constraint) => (
              <li key={constraint}>{constraint}</li>
            ))}
          </ul>
        </section>

        <section className="case-section">
          <h2 className="case-section__label">What I built</h2>
          <div className="case-prose">
            {project.detail.paragraphs.map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </div>

          {project.gallery?.length ? (
            <div className="case-gallery">
              {project.gallery.map((figure) => (
                <figure key={figure.src}>
                  <ProjectMedia
                    project={{ ...project, cover: figure }}
                    index={index}
                    variant="grid"
                  />
                  {figure.caption && (
                    <figcaption className="label mt-3">{figure.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          ) : null}
        </section>

        <section className="case-section">
          <h2 className="case-section__label">Decisions</h2>
          <ol className="case-decisions">
            {project.detail.decisions.map((decision, i) => (
              <li key={decision.title} className="case-decision">
                <span className="principle__index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="card-heading mt-4">{decision.title}</h3>
                <p className="mt-4 text-text-secondary">{decision.rationale}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="case-section">
          <h2 className="case-section__label">Outcome</h2>
          <p className="case-lede">{project.detail.outcome}</p>

          <dl className="case-metrics">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="metric-value tone-text">{metric.value}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {metric.label}
                </dd>
              </div>
            ))}
          </dl>

          <ul className="case-highlights">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </section>

        <nav className="case-next" aria-label="More work">
          <p className="label">Next</p>
          <p className="mt-4">
            <Link href={`/work/${next.slug}`} className="work-title-link">
              {next.name}
            </Link>
          </p>
          <p className="mt-5 max-w-[46ch] text-text-secondary">{next.tagline}</p>
          <p className="mt-8">
            <Link href="/work" className="link-underline label text-text-secondary">
              All work ↗
            </Link>
          </p>
        </nav>
      </div>
    </article>
  );
}
