"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SpaceExperience } from "@/components/SpaceExperience";
import { CREDENTIALS, PROJECTS, SITE_PROFILE } from "@/lib/site-data";

type RoomMode = "work" | "space";

export function SiteExperience({ initialRoom }: { initialRoom: RoomMode }) {
  const [room, setRoom] = useState<RoomMode>(initialRoom);
  const [veilActive, setVeilActive] = useState(false);

  // Scroll-parting cover progress (0 -> 1)
  const [coverProgress, setCoverProgress] = useState(0);
  const coverTrackRef = useRef<HTMLElement | null>(null);

  // Sync document data-room attribute
  useEffect(() => {
    document.documentElement.dataset.room = room;
  }, [room]);

  // Listen to browser back/forward navigation
  useEffect(() => {
    const onPopState = () => {
      const next: RoomMode = window.location.pathname.startsWith("/space")
        ? "space"
        : "work";
      setRoom(next);
      document.documentElement.dataset.room = next;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Scroll-parting cover effect
  useEffect(() => {
    if (room !== "work") return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let raf = 0;
    const update = () => {
      const el = coverTrackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalScroll = Math.max(1, el.offsetHeight - window.innerHeight);
      const raw = Math.min(1, Math.max(0, -rect.top / totalScroll));
      setCoverProgress(raw);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [room]);

  // Smooth room morph switch
  const switchRoom = useCallback(
    (nextRoom: RoomMode) => {
      if (nextRoom === room) return;
      const targetPath = nextRoom === "space" ? "/space" : "/";

      const applySwitch = () => {
        setRoom(nextRoom);
        document.documentElement.dataset.room = nextRoom;
        try {
          window.history.pushState({}, "", targetPath);
        } catch {
          /* ignore */
        }
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      };

      const docWithVt = document as Document & {
        startViewTransition?: (cb: () => void) => void;
      };

      setVeilActive(true);
      window.setTimeout(() => setVeilActive(false), 360);

      if (typeof docWithVt.startViewTransition === "function") {
        docWithVt.startViewTransition(applySwitch);
      } else {
        applySwitch();
      }
    },
    [room]
  );

  const leftShift = -coverProgress * 110;
  const rightShift = coverProgress * 110;
  const coverFade = Math.max(0.12, 1 - coverProgress * 0.88);

  return (
    <div data-room={room}>
      <div
        className={`room-veil${veilActive ? " is-active" : ""}`}
        aria-hidden="true"
      />

      {/* ==================== PERSISTENT FLOATING MASTHEAD ==================== */}
      <header className="masthead-bar">
        <button
          type="button"
          className="masthead-sig"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
        >
          <span>{SITE_PROFILE.shortName}</span>
          <span className="masthead-dot" aria-hidden="true" />
        </button>

        <nav className="mode-toggle" aria-label="Switch site mode">
          <button
            type="button"
            className="mode-btn"
            aria-pressed={room === "work"}
            onClick={() => switchRoom("work")}
          >
            <span
              className="mode-swatch"
              style={room === "work" ? { backgroundColor: "#ffffff" } : undefined}
              aria-hidden="true"
            />
            <span>Work</span>
          </button>
          <button
            type="button"
            className="mode-btn"
            aria-pressed={room === "space"}
            onClick={() => switchRoom("space")}
          >
            <span
              className="mode-swatch"
              style={room === "work" ? { backgroundColor: "#e03516" } : undefined}
              aria-hidden="true"
            />
            <span>Space</span>
          </button>
        </nav>
      </header>

      {room === "work" ? (
        /* ==================== WORK WALKTHROUGH (BLUE & WHITE) ==================== */
        <main id="main" tabIndex={-1}>
          {/* BEAT 01: SCROLL-PARTING EDITORIAL COVER */}
          <section
            ref={coverTrackRef}
            className="cover-track"
            aria-label="Opening cover"
          >
            <div className="cover-sticky">
              <div className="cover-stage">
                <div
                  className="cover-type-wing"
                  style={{
                    transform: `translate3d(${leftShift}px, ${-coverProgress * 24}px, 0)`,
                    opacity: coverFade,
                  }}
                >
                  <p className="cover-kicker">
                    Software Engineer · Hyderabad, India
                  </p>
                  <h1 className="cover-display">
                    Hey, I’m{" "}
                    <span className="cover-display-serif">Sai.</span>
                  </h1>
                  <p className="cover-subline">
                    I build AI agents and web software — scroll to walk through
                    what I do and what I’ve shipped.
                  </p>
                </div>

                <div
                  className="cover-photo-wing"
                  style={{
                    transform: `translate3d(${rightShift}px, ${-coverProgress * 18}px, 0) scale(${1 + coverProgress * 0.04})`,
                    opacity: coverFade,
                  }}
                >
                  <div className="cover-photo-composition">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="cover-photo-main"
                      src="/images/sai-pergola.jpg"
                      width={700}
                      height={1243}
                      alt="Sai Uttej Rajoju walking under a sunlit stone pergola"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="cover-photo-inset"
                      src="/images/sai-palace.jpg"
                      width={1021}
                      height={768}
                      alt="Sai Uttej Rajoju smiling in front of Bangalore Palace"
                    />
                  </div>
                </div>
              </div>

              <div className="cover-foot">
                <div className="editorial-links">
                  <a
                    href={SITE_PROFILE.links.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ed-link ed-link-accent"
                  >
                    <span>Resume PDF</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                  <a
                    href={SITE_PROFILE.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ed-link"
                  >
                    <span>GitHub</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                  <a
                    href={SITE_PROFILE.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ed-link"
                  >
                    <span>LinkedIn</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                  <a href={SITE_PROFILE.links.email} className="ed-link">
                    <span>{SITE_PROFILE.links.emailAddress}</span>
                  </a>
                </div>

                <span className="scroll-cue">Scroll to walk through ↓</span>
              </div>
            </div>
          </section>

          {/* BEAT 02: SHORT "WHAT I DO" */}
          <section className="editorial-beat" aria-label="What I do">
            <p className="beat-numeral" data-reveal style={{ ["--i" as string]: 0 }}>
              01 — What I do
            </p>
            <h2
              className="statement-huge"
              data-reveal
              style={{ ["--i" as string]: 1 }}
            >
              I’m a software engineer at{" "}
              <span className="serif-em">MAQ Software</span> in Hyderabad —
              part of the development team running a live enterprise AI support
              agent, and building my own web products after hours.
            </h2>

            <div
              className="open-meta-columns"
              data-reveal
              style={{ ["--i" as string]: 2 }}
            >
              <div>
                <p className="meta-heading">Experience</p>
                <div className="meta-line-list">
                  <p>
                    <strong>Software Engineer I</strong> · MAQ Software · Sept
                    2025 – Present
                  </p>
                  <p style={{ color: "var(--ink-muted)" }}>
                    <strong>Associate Software Engineer</strong> · MAQ Software
                    · Aug 2024 – Aug 2025
                  </p>
                </div>
              </div>

              <div>
                <p className="meta-heading">Credentials &amp; Education</p>
                <div className="meta-line-list">
                  <p className="editorial-links">
                    {CREDENTIALS.map((cert) => (
                      <a
                        key={cert.code}
                        href={cert.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ed-link"
                      >
                        <span>
                          Microsoft {cert.code} ({cert.title})
                        </span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </p>
                  <p style={{ color: "var(--ink-muted)" }}>
                    B.Tech CSE · CVR College of Engineering, Hyderabad
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* BEAT 03: ALL 4 PROJECTS VISIBLE AT ONCE (OPEN MAGAZINE SPREAD) */}
          <section className="editorial-beat" aria-label="Selected work">
            <p className="beat-numeral" data-reveal style={{ ["--i" as string]: 0 }}>
              02 — Selected work
            </p>

            <div
              className="works-index"
              data-reveal
              style={{ ["--i" as string]: 1 }}
            >
              {PROJECTS.map((proj) => (
                <article key={proj.id} className="work-row">
                  <span className="work-num">{proj.numeral}.</span>
                  <div className="work-main">
                    <div className="work-title-bar">
                      <h3 className="work-title">
                        <a
                          href={proj.primaryHref}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {proj.title}
                        </a>
                      </h3>
                      <div className="editorial-links">
                        <a
                          href={proj.primaryHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ed-link ed-link-accent"
                        >
                          <span>{proj.primaryLabel}</span>
                        </a>
                        {proj.secondaryHref && proj.secondaryLabel && (
                          <a
                            href={proj.secondaryHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ed-link"
                          >
                            <span>{proj.secondaryLabel}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="work-desc">{proj.line}</p>
                    <p className="work-stack">{proj.stack}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* BEAT 04: SAY HI */}
          <section className="editorial-beat" aria-label="Say hi">
            <p className="beat-numeral" data-reveal style={{ ["--i" as string]: 0 }}>
              03 — Say hi
            </p>
            <h2
              className="statement-huge"
              data-reveal
              style={{ ["--i" as string]: 1 }}
            >
              If you’re hiring or just want to talk about something I built,
              drop me a line.
            </h2>

            <div data-reveal style={{ ["--i" as string]: 2 }}>
              <a href={SITE_PROFILE.links.email} className="hello-email">
                {SITE_PROFILE.links.emailAddress}
              </a>
            </div>

            <div
              className="cover-foot"
              data-reveal
              style={{ marginInline: 0, ["--i" as string]: 3 }}
            >
              <div className="editorial-links">
                <a
                  href={SITE_PROFILE.links.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ed-link ed-link-accent"
                >
                  <span>Resume PDF</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <a
                  href={SITE_PROFILE.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ed-link"
                >
                  <span>GitHub</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <a
                  href={SITE_PROFILE.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ed-link"
                >
                  <span>LinkedIn</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>

              <button
                type="button"
                className="ed-link ed-link-accent"
                onClick={() => switchRoom("space")}
              >
                <span>Enter Space →</span>
              </button>
            </div>
          </section>
        </main>
      ) : (
        <SpaceExperience onBackToWork={() => switchRoom("work")} />
      )}
    </div>
  );
}
