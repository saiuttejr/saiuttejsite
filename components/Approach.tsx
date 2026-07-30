import { principles } from "@/lib/constants";

export default function Approach() {
  return (
    <section id="approach" className="relative px-4 py-20 md:px-8 md:py-28 lg:px-12">
      {/* Narrow measure and a centred axis — the opposite of the wide, image-led
          work section directly above it. */}
      <div className="approach-shell">
        <span className="section-kicker">Approach</span>

        <blockquote className="pull-quote">
          <p>
            I like work that stays clear as it grows. The interesting part is
            never the framework — it&apos;s deciding what the system is
            actually responsible for.
          </p>
        </blockquote>

        <p className="section-prose mt-10">
          The part I enjoy most is where engineering quality meets product
          usefulness. Lately that means more time in AI and agent tooling —
          making sure the smart layer on top still rests on systems that are
          clear, dependable, and easy to reason about.
        </p>
      </div>

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
    </section>
  );
}
