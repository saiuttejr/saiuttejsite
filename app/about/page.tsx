import type { Metadata } from "next";
import { certifications, education, experience, principles } from "@/lib/constants";
import SiteHeader from "@/components/SiteHeader";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "About",
  description:
    "Backend and AI/agent engineer in Hyderabad. How I work, where I have worked, and the credentials behind it.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main id="main" className="site-stage">
      <SiteHeader label="About" />

      <section className="px-4 pb-8 pt-32 md:px-8 md:pt-40 lg:px-12">
        <div className="editorial-shell">
          <span className="section-kicker">About</span>
          <h1 className="section-heading mt-8 max-w-[17ch]">
            An engineer who cares how it ages.
          </h1>

          <div className="about-prose">
            <p>
              I write backend services for a living and build products on the
              side, and I have stopped treating those as separate skills. The
              same instinct drives both: work out what the system is actually
              responsible for, then make that boundary obvious to whoever reads
              the code next.
            </p>
            <p>
              At MAQ Software I work in C# and .NET on ingestion and reporting
              workflows, with a growing amount of my day spent building
              alongside Copilot and MCP tooling rather than around it. Away from
              the day job I have shipped a nutrition data platform, a hundred
              free calculators, a finance tracker, and a social app built
              mainly to find out what I did not know.
            </p>
            <p>
              What I am looking for is work where the engineering quality and
              the product decision are the same conversation — small enough
              teams that owning a system means owning what it is for.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-8 md:py-20 lg:px-12">
        <div className="editorial-shell">
          <h2 className="section-heading-compact border-t border-line pt-8">
            How I work
          </h2>
          <ol className="principles">
            {principles.map((principle, index) => (
              <li key={principle.title} className="principle">
                <span className="principle__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="card-heading mt-5">{principle.title}</h3>
                <p className="mt-4 text-text-secondary">{principle.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 py-16 md:px-8 md:py-20 lg:px-12">
        <div className="editorial-shell">
          <h2 className="section-heading-compact border-t border-line pt-8">
            Timeline
          </h2>
          <ol className="timeline">
            {experience.map((exp) => (
              <li key={exp.period} className="timeline__item">
                <p className="label">{exp.period}</p>
                <h3 className="card-heading mt-3">{exp.role}</h3>
                <p className="label label-accent mt-2">{exp.company}</p>
                <p className="mt-4 max-w-[62ch] text-text-secondary">
                  {exp.description}
                </p>
              </li>
            ))}
            <li className="timeline__item">
              <p className="label">{education.period}</p>
              <h3 className="card-heading mt-3">{education.degree}</h3>
              <p className="label label-accent mt-2">{education.institution}</p>
              <p className="mt-4 max-w-[62ch] text-text-secondary">
                {education.note}
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="px-4 py-16 md:px-8 md:py-20 lg:px-12">
        <div className="editorial-shell">
          <h2 className="section-heading-compact border-t border-line pt-8">
            Credentials
          </h2>
          <ul className="credentials">
            {certifications.map((cert) => (
              <li key={cert.name} className="credential">
                <h3 className="card-heading">{cert.name}</h3>
                <p className="label label-accent mt-3">
                  {cert.issuer}
                  {cert.exam ? ` · ${cert.exam}` : ""} · {cert.date}
                </p>
                <p className="mt-5">
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline label text-text-secondary"
                    data-cursor-hover
                    data-cursor-label="verify"
                  >
                    Verify credential ↗
                  </a>
                </p>
              </li>
            ))}
          </ul>

          <dl className="about-facts">
            <div>
              <dt className="label">Also on record</dt>
              <dd className="mt-3 text-text-secondary">
                GATE CSE 2024 — top 8% nationwide · 550+ data structures and
                algorithms problems solved · EF SET C2 English proficiency
              </dd>
            </div>
            <div>
              <dt className="label">Away from work</dt>
              <dd className="mt-3 text-text-secondary">
                Chess, anime, F1 weekends, and anything with two or four wheels.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <Contact />
    </main>
  );
}
