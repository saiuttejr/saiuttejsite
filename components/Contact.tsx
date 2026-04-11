"use client";

import { useRef, useState, useCallback } from "react";
import { socialLinks } from "@/lib/constants";

export default function Contact() {
  const [badgeVisible, setBadgeVisible] = useState(false);
  const badgeLoaded = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const showBadge = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setBadgeVisible(true);

    if (!badgeLoaded.current) {
      badgeLoaded.current = true;
      const script = document.createElement("script");
      script.src = "https://platform.linkedin.com/badges/js/profile.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  const hideBadge = useCallback(() => {
    hideTimer.current = setTimeout(() => setBadgeVisible(false), 200);
  }, []);

  return (
    <footer id="contact" className="relative px-4 py-6 md:px-8 md:py-10 lg:px-12">
      <div className="editorial-shell pb-8 md:pb-10">
        <div className="relative grid gap-10 border-t border-line pt-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
          <div className="absolute left-[10%] top-0 h-[14rem] w-[14rem] bg-[radial-gradient(circle,_rgba(240,91,43,0.12),_transparent_64%)] blur-3xl" aria-hidden="true" />

          <div className="relative">
            <span className="section-kicker">Contact</span>

            <h2 className="section-heading mt-4 max-w-4xl">
              If something here feels aligned, get in touch.
            </h2>

            <p className="section-prose mt-6 max-w-[36rem]">
              I&apos;m open to backend and product engineering roles, especially the
              kind where clarity, ownership, and taste are all part of the job.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={`mailto:${socialLinks.email}`}
                className="button-primary"
                data-cursor-hover
                data-cursor-label="email"
              >
                Email
              </a>
              <span
                className="relative"
                onMouseEnter={showBadge}
                onMouseLeave={hideBadge}
              >
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline font-mono text-[10px] tracking-[0.12em] text-text-muted transition-colors duration-300 hover:text-text"
                  data-cursor-hover
                  data-cursor-label="linkedin"
                >
                  LinkedIn ↗
                </a>
                {badgeVisible && (
                  <div
                    className="absolute bottom-full left-1/2 z-50 mb-3 -translate-x-1/2 rounded-xl border border-line bg-bg-elevated p-2 shadow-2xl"
                    onMouseEnter={showBadge}
                    onMouseLeave={hideBadge}
                  >
                    <div
                      className="badge-base LI-profile-badge"
                      data-locale="en_US"
                      data-size="large"
                      data-theme="dark"
                      data-type="HORIZONTAL"
                      data-vanity="sai-uttej-r"
                      data-version="v1"
                    >
                      <a
                        className="badge-base__link LI-simple-link"
                        href="https://in.linkedin.com/in/sai-uttej-r?trk=profile-badge"
                      >
                        Sai Uttej R
                      </a>
                    </div>
                  </div>
                )}
              </span>
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline font-mono text-[10px] tracking-[0.12em] text-text-muted transition-colors duration-300 hover:text-text"
                data-cursor-hover
                data-cursor-label="github"
              >
                GitHub ↗
              </a>
              <a
                href={socialLinks.lichess}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline font-mono text-[10px] tracking-[0.12em] text-text-muted transition-colors duration-300 hover:text-text"
                data-cursor-hover
                data-cursor-label="lichess"
                onMouseEnter={() => window.dispatchEvent(new Event("chess-pieces-activate"))}
              >
                Lichess ↗
              </a>
            </div>
          </div>

          <div className="space-y-6 border-t border-line pt-5 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
            <div>
              <p className="font-mono text-[10px] tracking-[0.12em] text-text-dim">
                Based in
              </p>
              <p className="mt-2 text-[0.98rem] leading-[1.78] text-text">
                Hyderabad, India
              </p>
            </div>

            <div>
              <p className="font-mono text-[10px] tracking-[0.12em] text-text-dim">
                Working at
              </p>
              <p className="mt-2 text-[0.98rem] leading-[1.78] text-text-muted">
                MAQ Software
              </p>
            </div>

            <div>
              <p className="font-mono text-[10px] tracking-[0.12em] text-text-dim">
                Best fit
              </p>
              <p className="mt-2 text-[0.98rem] leading-[1.78] text-text-muted">
                Backend engineering, product engineering, and small-team
                ownership.
              </p>
            </div>

            <div>
              <p className="font-mono text-[10px] tracking-[0.12em] text-text-dim">
                Off the clock
              </p>
              <p className="mt-2 text-[0.98rem] leading-[1.78] text-text-muted">
                Chess, anime, F1, and time around bikes and cars.
              </p>
            </div>

            <div className="border-t border-line pt-4">
              <span className="font-mono text-[10px] tracking-[0.12em] text-text-dim">
                © 2026 Sai Uttej Rajoju
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
