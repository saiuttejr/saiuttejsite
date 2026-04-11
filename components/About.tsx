import { experience, education } from "@/lib/constants";

export default function About() {
  return (
    <section id="about" className="relative px-4 py-6 md:px-8 md:py-8 lg:px-12">
      <div className="editorial-shell">
        <div className="grid gap-10 border-t border-line pt-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="section-kicker">Approach</span>
            <p className="mt-4 max-w-[16rem] text-[0.95rem] leading-[1.82] text-text-muted">
              Clear systems, thoughtful product choices, and a preference for
              things that age well.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-14">
            <div>
              <h2 className="section-heading max-w-3xl">
                I like work that stays clear as it grows.
              </h2>

              <p className="section-prose mt-6 max-w-[36rem]">
                The part I usually enjoy most is where engineering quality meets
                product usefulness. I want the system to hold up, but I also
                want it to feel considered when someone actually uses it.
              </p>

              <div className="mt-10 border-t border-line pt-6">
                <p className="font-mono text-[10px] tracking-[0.12em] text-text-dim">
                  Education
                </p>
                <h3 className="mt-3 font-editorial text-[1.3rem] leading-[1.12] tracking-[-0.03em] text-text">
                  {education.degree}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-[1.82] text-text-muted">
                  {education.institution} · {education.period}
                </p>
                <p className="mt-3 font-mono text-[10px] tracking-[0.12em] text-accent">
                  {education.note}
                </p>
              </div>
            </div>

            <div className="divide-y divide-line">
              {experience.map((exp) => (
                <div key={exp.period} className="py-6 first:pt-0 last:pb-0 md:py-7">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="card-heading">{exp.role}</h3>
                    <span className="font-mono text-[10px] tracking-[0.12em] text-text-dim">
                      {exp.period}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-[10px] tracking-[0.12em] text-accent">
                    {exp.company}
                  </p>
                  <p className="mt-4 max-w-[40rem] text-[0.95rem] leading-[1.88] text-text-muted">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
