import { experience, education } from "@/lib/constants";

export default function Timeline() {
  return (
    <section id="about" className="relative px-4 py-20 md:px-8 md:py-28 lg:px-12">
      <div className="editorial-shell">
        <header className="max-w-[46ch] border-t border-line pt-8">
          <span className="section-kicker">Timeline</span>
          <h2 className="section-heading-compact mt-6">
            Where the work has happened so far.
          </h2>
        </header>

        {/* A single continuous rail rather than a divided list, so this section
            reads as one movement instead of stacked rows. */}
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
  );
}
