import Link from "next/link";
import { socialLinks } from "@/lib/constants";

const elsewhere = [
  { label: "LinkedIn", href: socialLinks.linkedin },
  { label: "GitHub", href: socialLinks.github },
  { label: "Lichess", href: socialLinks.lichess },
  { label: "Letterboxd", href: socialLinks.letterboxd },
  { label: "Résumé", href: socialLinks.resume },
];

export default function Contact() {
  return (
    <footer id="contact" className="relative px-4 pb-12 pt-20 md:px-8 md:pb-16 md:pt-28 lg:px-12">
      <div className="editorial-shell">
        {/* The closing statement is the only element at hero scale below the
            fold — the page opens and closes on the same note. */}
        <div className="contact-close">
          <span className="section-kicker">Contact</span>
          <h2 className="section-heading mt-8 max-w-[18ch]">
            If something here feels aligned, get in touch.
          </h2>

          <p className="section-prose mt-8">
            I&apos;m open to backend, AI/agent, and product engineering roles —
            especially the kind where clarity, ownership, and taste are all part
            of the job.
          </p>

          <p className="mt-10">
            <a
              href={`mailto:${socialLinks.email}`}
              className="button-primary"
              data-cursor-hover
              data-cursor-label="email"
            >
              {socialLinks.email}
            </a>
          </p>
        </div>

        <div className="site-footer">
          <div>
            <p className="label">Sai Uttej Rajoju</p>
            <p className="mt-2 text-sm text-text-secondary">
              Backend and AI/agent engineering. Hyderabad, India.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="label">Pages</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/work" className="footer-link">
                  Work
                </Link>
              </li>
              <li>
                <Link href="/about" className="footer-link">
                  About
                </Link>
              </li>
              <li>
                <a href="#main" className="footer-link">
                  Back to top
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <p className="label">Elsewhere</p>
            <ul className="mt-3 space-y-2">
              {elsewhere.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                    data-cursor-hover
                    data-cursor-label={item.label.toLowerCase()}
                  >
                    {item.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label">Colophon</p>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Set in Instrument Serif and Sora. Built with Next.js. Motion
              respects your reduced-motion setting.
            </p>
          </div>
        </div>

        <p className="label mt-12 border-t border-line pt-6">
          © 2026 Sai Uttej Rajoju
        </p>
      </div>
    </footer>
  );
}
