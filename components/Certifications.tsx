import { certifications } from "@/lib/constants";

export default function Certifications() {
  return (
    <section
      id="certifications"
      className="relative px-4 py-6 md:px-8 md:py-8 lg:px-12"
    >
      <div className="editorial-shell">
        <div className="grid gap-10 border-t border-line pt-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="section-kicker">Credentials</span>
            <p className="mt-4 max-w-[16rem] text-[0.95rem] leading-[1.82] text-text-muted">
              Verified certifications, kept current.
            </p>
          </div>

          <div className="divide-y divide-line">
            {certifications.map((cert) => (
              <div
                key={cert.credentialId}
                className="py-6 first:pt-0 last:pb-0 md:py-7"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="card-heading">{cert.name}</h3>
                  <span className="font-mono text-[10px] tracking-[0.12em] text-text-dim">
                    {cert.date}
                  </span>
                </div>
                <p className="mt-2 font-mono text-[10px] tracking-[0.12em] text-accent">
                  {cert.issuer}
                </p>
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline mt-4 inline-block font-mono text-[10px] tracking-[0.12em] text-text-muted transition-colors duration-300 hover:text-text"
                  data-cursor-hover
                  data-cursor-label="verify"
                >
                  Verify ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
