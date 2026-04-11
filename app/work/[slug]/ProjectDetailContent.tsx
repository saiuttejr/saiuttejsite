"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { projects, type Project } from "@/lib/constants";
import { DURATION, EASE_CINEMATIC, EASE_OUT, clipReveal } from "@/lib/animations";

interface ProjectDetailContentProps {
  project: Project;
}

export default function ProjectDetailContent({ project }: ProjectDetailContentProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const relatedProjects = projects.filter((entry) => entry.slug !== project.slug).slice(0, 2);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const tl = gsap.timeline({ delay: 0.3 });

    const title = headerRef.current?.querySelector(".detail-title");
    if (title) {
      gsap.set(title, { ...clipReveal.from });
      tl.to(title, {
        ...clipReveal.to,
        duration: DURATION.reveal,
        ease: EASE_CINEMATIC,
      });
    }

    const meta = headerRef.current?.querySelectorAll(".detail-meta");
    if (meta) {
      gsap.set(meta, { y: 20, opacity: 0 });
      tl.to(
        meta,
        { y: 0, opacity: 1, duration: DURATION.normal, ease: EASE_OUT, stagger: 0.08 },
        "-=0.6"
      );
    }

    if (contentRef.current?.children) {
      const children = Array.from(contentRef.current.children);
      gsap.set(children, { y: 30, opacity: 0 });
      tl.to(
        children,
        { y: 0, opacity: 1, duration: DURATION.normal, ease: EASE_OUT, stagger: 0.1 },
        "-=0.3"
      );
    }
  }, []);

  return (
    <article className="px-4 pb-8 pt-24 md:px-8 md:pb-10 md:pt-28 lg:px-12">
      <div className="editorial-shell space-y-10 md:space-y-12">
        <header
          ref={headerRef}
          className="grid gap-10 border-b border-line pb-10 lg:grid-cols-[minmax(0,1.05fr)_280px] lg:gap-14"
          data-tone={project.slug}
        >
          <div className="max-w-4xl">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <span className="detail-meta font-mono text-[10px] tracking-[0.12em] tone-text">
                {project.year}
              </span>
              <span className="detail-meta font-mono text-[10px] tracking-[0.12em] text-text-dim">
                {project.category}
              </span>
            </div>

            <h1 className="detail-title mt-5 max-w-3xl font-editorial text-[clamp(2rem,5vw,4rem)] leading-[1.01] tracking-[-0.04em] text-text">
              {project.name}
            </h1>

            <p className="detail-meta mt-4 font-mono text-[10px] tracking-[0.12em] tone-text">
              {project.tagline}
            </p>

            <p className="detail-meta mt-6 max-w-[38rem] text-[0.98rem] leading-[1.92] text-text-muted">
              {project.summary}
            </p>
          </div>

          <div className="detail-meta border-t border-line pt-5 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
            <div className="space-y-6">
              <div>
                <p className="font-mono text-[10px] tracking-[0.12em] text-text-dim">
                  Role
                </p>
                <p className="mt-2 text-[0.96rem] leading-[1.8] text-text-muted">
                  {project.role}
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] tracking-[0.12em] text-text-dim">
                  Stack
                </p>
                <p className="mt-2 text-[0.96rem] leading-[1.8] text-text-muted">
                  {project.tech}
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] tracking-[0.12em] text-text-dim">
                  Outcome
                </p>
                <p className="mt-2 text-[0.96rem] leading-[1.8] text-text-muted">
                  {project.detail.outcome}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div ref={contentRef} className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-14 lg:items-start">
          <div className="space-y-8" data-tone={project.slug}>
            <div>
              <p className="font-mono text-[10px] tracking-[0.12em] tone-text">
                Project brief
              </p>
              <p className="mt-4 max-w-[40rem] text-[0.98rem] leading-[1.92] text-text-muted">
                {project.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.focus.map((item) => (
                  <span key={item} className="data-chip tone-border">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              {project.detail.paragraphs.map((para, index) => (
                <p
                  key={index}
                  className="mt-7 first:mt-0 text-[0.98rem] leading-[1.95] text-text-muted"
                >
                  {para}
                </p>
              ))}

              <div className="mt-14 border-t border-line pt-8">
                <h2 className="detail-heading">Approach</h2>
                <p className="mt-4 text-[0.95rem] leading-[1.88] text-text-muted">
                  {project.detail.approach}
                </p>
              </div>

              <div className="mt-12 border-t border-line pt-8">
                <h2 className="detail-heading">Outcome</h2>
                <p className="mt-4 text-[0.95rem] leading-[1.88] text-text-muted">
                  {project.detail.outcome}
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-8 border-t border-line pt-5 lg:sticky lg:top-32 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0" data-tone={project.slug}>
            <div>
              <p className="font-mono text-[10px] tracking-[0.12em] tone-text">
                Evidence
              </p>
              <div className="mt-5 space-y-4">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="border-t border-line pt-4 first:border-t-0 first:pt-0">
                    <p className="tone-text font-editorial text-[1.45rem] leading-[1] tracking-[-0.03em]">
                      {metric.value}
                    </p>
                    <p className="mt-2 text-[0.93rem] leading-[1.72] text-text-muted">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] tracking-[0.12em] tone-text">
                Why it mattered
              </p>
              <ul className="mt-5 space-y-3">
                {project.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 text-[0.94rem] leading-[1.75] text-text-muted"
                  >
                    <span className="tone-dot mt-1.5 h-2 w-2 shrink-0 rounded-full" aria-hidden="true" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="button-secondary w-full justify-between"
              data-cursor-hover
              data-cursor-label="open"
            >
              <span>Visit {project.name}</span>
              <span aria-hidden="true">↗</span>
            </a>
          </aside>
        </div>

        {relatedProjects.length > 0 && (
          <section className="border-t border-line pt-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="section-kicker">Continue reading</span>
                <h2 className="section-heading-compact mt-4 max-w-2xl">
                  More work in a similar range.
                </h2>
              </div>
              <Link
                href="/"
                className="link-underline font-mono text-[10px] tracking-[0.12em] text-text-muted transition-colors duration-300 hover:text-text"
                data-cursor-hover
              >
                Back to homepage
              </Link>
            </div>

            <div className="mt-8 divide-y divide-line">
              {relatedProjects.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/work/${entry.slug}`}
                  className="group block py-6 first:pt-0 last:pb-0"
                  data-tone={entry.slug}
                  data-cursor-hover
                  data-cursor-label="open"
                >
                  <div className="grid gap-4 md:grid-cols-[140px_minmax(0,1fr)] md:gap-6">
                    <div className="font-mono text-[10px] tracking-[0.12em] text-text-dim">
                      {entry.year} / {entry.category}
                    </div>

                    <div>
                      <h3 className="font-editorial text-[clamp(1.5rem,2.6vw,2.1rem)] leading-[1.04] tracking-[-0.03em] text-text transition-colors duration-300 group-hover:text-accent">
                        {entry.name}
                      </h3>
                      <p className="mt-3 max-w-[34rem] text-[0.95rem] leading-[1.84] text-text-muted">
                        {entry.summary}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
