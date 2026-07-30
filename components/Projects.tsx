import Link from "next/link";
import { projects } from "@/lib/constants";
import ProjectMedia from "@/components/ProjectMedia";

const [lead, ...rest] = projects;

export default function Projects() {
  return (
    <section id="work" className="relative px-4 py-20 md:px-8 md:py-28 lg:px-12">
      <div className="editorial-shell">
        {/* Full-width header — deliberately not the sticky-label column used by
            the sections further down the page. */}
        <header className="max-w-[52ch] border-t border-line pt-8">
          <span className="section-kicker">Selected work</span>
          <h2 className="section-heading-compact mt-6">
            Four things I built end to end, and what each one had to solve.
          </h2>
        </header>

        {/* Lead project: oversized, image-forward. */}
        <article data-tone={lead.slug} className="group work-lead mt-14 md:mt-20">
          <div className="work-lead__media">
            <ProjectMedia project={lead} index={0} variant="featured" />
          </div>

          <div className="work-lead__body">
            <p className="label tone-text">
              {lead.category} · {lead.year} · {lead.status}
            </p>
            <h3 className="mt-4">
              <Link href={`/work/${lead.slug}`} className="work-title-link">
                {lead.name}
              </Link>
            </h3>
            <p className="mt-5 max-w-[46ch] text-text-secondary">{lead.summary}</p>

            <ul className="mt-7 flex flex-wrap gap-2">
              {lead.stack.slice(0, 5).map((item) => (
                <li key={item} className="data-chip">
                  {item}
                </li>
              ))}
            </ul>

            <dl className="work-lead__metrics">
              {lead.metrics.slice(0, 2).map((metric) => (
                <div key={metric.label}>
                  <dt className="metric-value tone-text">{metric.value}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {metric.label}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-8">
              <Link href={`/work/${lead.slug}`} className="button-secondary">
                Read the case study
              </Link>
            </p>
          </div>
        </article>

        {/* Remaining work: a calmer two-up grid, so the lead keeps its weight. */}
        <div className="work-grid">
          {rest.map((project, index) => (
            <article
              key={project.slug}
              data-tone={project.slug}
              className="group work-card"
            >
              <div className="work-card__media">
                <ProjectMedia project={project} index={index + 1} variant="grid" />
              </div>

              <p className="label tone-text mt-6">
                {project.category} · {project.year}
              </p>
              <h3 className="mt-3">
                <Link href={`/work/${project.slug}`} className="work-title-link">
                  {project.name}
                </Link>
              </h3>
              <p className="mt-4 text-text-secondary">{project.summary}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {project.stack.slice(0, 4).map((item) => (
                  <li key={item} className="data-chip">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="mt-14 border-t border-line pt-8">
          <Link href="/work" className="link-underline label text-text-secondary">
            All work ↗
          </Link>
        </p>
      </div>
    </section>
  );
}
