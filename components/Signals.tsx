import Link from "next/link";
import { signals } from "@/lib/constants";

export default function Signals() {
  return (
    <section
      id="signals"
      className="relative px-4 py-16 md:px-8 md:py-20 lg:px-12"
    >
      <div className="editorial-shell">
        {/* A compact horizontal band — the shortest section on the page, and the
            only one that runs as a single row. */}
        <div className="signals">
          <dl className="signals__list">
            {signals.map((signal) => (
              <div key={signal.label} className="signals__item">
                <dt className="signals__value">{signal.value}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {signal.label}
                </dd>
              </div>
            ))}
          </dl>

          <p className="signals__link">
            <Link href="/about" className="link-underline label text-text-secondary">
              Credentials and the longer story ↗
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
