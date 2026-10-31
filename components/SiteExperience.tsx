"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CREDENTIALS,
  PROJECTS,
  SITE_PROFILE,
  type EditorialProject,
} from "@/lib/site-data";

type RoomMode = "work" | "space";

interface PieceInfo {
  side: "w" | "b";
  kind: "k" | "q" | "r" | "p";
  label: string;
}

interface ChessPuzzle {
  id: string;
  prompt: string;
  hint: string;
  winFrom: string;
  winTo: string;
  winText: string;
  pieces: Record<string, PieceInfo>;
}

const PUZZLES: ChessPuzzle[] = [
  {
    id: "qg7",
    prompt: "White to move — mate in one.",
    hint: "The pawn on g6 and king on h5 seal the escape squares.",
    winFrom: "3,0",
    winTo: "1,2",
    winText: "Qg7# — checkmate.",
    pieces: {
      "0,2": { side: "b", kind: "k", label: "Black king on g8" },
      "0,1": { side: "b", kind: "r", label: "Black rook on f8" },
      "1,1": { side: "b", kind: "p", label: "Black pawn on f7" },
      "1,3": { side: "b", kind: "p", label: "Black pawn on h7" },
      "2,2": { side: "w", kind: "p", label: "White pawn on g6" },
      "3,0": { side: "w", kind: "q", label: "White queen on e5" },
      "3,3": { side: "w", kind: "k", label: "White king on h5" },
    },
  },
  {
    id: "re8",
    prompt: "White to move — mate on the back rank.",
    hint: "Black’s own pawns on f7, g7, and h7 trap the king on h8.",
    winFrom: "3,0",
    winTo: "0,0",
    winText: "Re8# — checkmate.",
    pieces: {
      "0,3": { side: "b", kind: "k", label: "Black king on h8" },
      "1,1": { side: "b", kind: "p", label: "Black pawn on f7" },
      "1,2": { side: "b", kind: "p", label: "Black pawn on g7" },
      "1,3": { side: "b", kind: "p", label: "Black pawn on h7" },
      "3,0": { side: "w", kind: "r", label: "White rook on e5" },
      "3,2": { side: "w", kind: "k", label: "White king on g5" },
    },
  },
];

const FILES = ["e", "f", "g", "h"];
const RANKS = ["8", "7", "6", "5"];

function renderPieceSvg(kind: PieceInfo["kind"], side: PieceInfo["side"]) {
  const fill = side === "w" ? "#ffffff" : "#210d07";
  const stroke = "#210d07";
  return (
    <svg
      viewBox="0 0 36 36"
      style={{ width: "80%", height: "80%" }}
      fill={fill}
      stroke={stroke}
      strokeWidth={2}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === "k" && (
        <path d="M18 6v6m-3-3h6M11 29h14l2-11-5 3-4-6-4 6-5-3 2 11Z" />
      )}
      {kind === "q" && (
        <path d="M9 28h18l2-13-5 4-6-8-6 8-5-4 2 13Zm-1 3h20" />
      )}
      {kind === "r" && (
        <path d="M11 29h14l-1-12H12l-1 12Zm0-15h14V9h-3v2h-2V9h-4v2h-2V9h-3v5Z" />
      )}
      {kind === "p" && (
        <path d="M18 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-6 15h12c0-5-2-8-6-9-4 1-6 4-6 9Z" />
      )}
    </svg>
  );
}

export function SiteExperience({ initialRoom }: { initialRoom: RoomMode }) {
  const [room, setRoom] = useState<RoomMode>(initialRoom);
  const [veilActive, setVeilActive] = useState(false);

  // Scroll-parting cover progress (0 -> 1)
  const [coverProgress, setCoverProgress] = useState(0);
  const coverTrackRef = useRef<HTMLElement | null>(null);

  // Work room: active project in the 4-project spread
  const [activeProject, setActiveProject] = useState<EditorialProject>(
    PROJECTS[0]
  );
  const [eatensityLive, setEatensityLive] = useState(false);

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

  // ---------- F1 Start Lights State ----------
  const [f1State, setF1State] = useState<
    "idle" | "sequence" | "holding" | "out" | "done"
  >("idle");
  const [litCount, setLitCount] = useState(0);
  const [goFlash, setGoFlash] = useState(false);
  const [f1Readout, setF1Readout] = useState("Lights out");
  const [f1Note, setF1Note] = useState("Tap to start the grid sequence.");
  const f1T0Ref = useRef(0);
  const f1TimersRef = useRef<number[]>([]);

  const clearF1Timers = useCallback(() => {
    f1TimersRef.current.forEach((id) => window.clearTimeout(id));
    f1TimersRef.current = [];
  }, []);

  const startF1Sequence = useCallback(() => {
    clearF1Timers();
    setF1State("sequence");
    setLitCount(0);
    setGoFlash(false);
    setF1Readout("Watch…");
    setF1Note("Hold until lights out.");

    for (let i = 1; i <= 5; i++) {
      const id = window.setTimeout(() => {
        setLitCount(i);
        if (i === 5) {
          setF1State("holding");
          const wait = 900 + Math.random() * 1900;
          const outId = window.setTimeout(() => {
            setLitCount(0);
            setGoFlash(true);
            setF1State("out");
            f1T0Ref.current = performance.now();
            setF1Readout("Lights out!");
            setF1Note("Tap now!");
          }, wait);
          f1TimersRef.current.push(outId);
        }
      }, i * 640);
      f1TimersRef.current.push(id);
    }
  }, [clearF1Timers]);

  useEffect(() => {
    const onEasterEgg = () => {
      if (room !== "space") {
        switchRoom("space");
      }
      window.setTimeout(() => startF1Sequence(), 350);
    };
    window.addEventListener("sai:lights-out", onEasterEgg);
    return () => {
      window.removeEventListener("sai:lights-out", onEasterEgg);
      clearF1Timers();
    };
  }, [room, switchRoom, startF1Sequence, clearF1Timers]);

  const handleF1Tap = () => {
    if (f1State === "idle" || f1State === "done") {
      startF1Sequence();
      return;
    }
    if (f1State === "sequence" || f1State === "holding") {
      clearF1Timers();
      setF1State("done");
      setLitCount(5);
      setGoFlash(false);
      setF1Readout("Jump start");
      setF1Note("Triggered before lights out — tap to try again.");
      return;
    }
    if (f1State === "out") {
      const ms = Math.max(1, Math.round(performance.now() - f1T0Ref.current));
      setF1State("done");
      setGoFlash(false);
      setF1Readout(`${ms} ms`);
      setF1Note(
        ms < 220
          ? "Front-row F1 reflex. Tap to run again."
          : "Clean launch off the line. Tap to run again."
      );
    }
  };

  // ---------- Chess State ----------
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const puzzle = PUZZLES[puzzleIdx];
  const [pieces, setPieces] = useState<Record<string, PieceInfo>>(
    puzzle.pieces
  );
  const [selectedSq, setSelectedSq] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [chessStatus, setChessStatus] = useState(puzzle.prompt);

  const selectPuzzle = (idx: number) => {
    const next = PUZZLES[idx];
    setPuzzleIdx(idx);
    setPieces(next.pieces);
    setSelectedSq(null);
    setSolved(false);
    setChessStatus(next.prompt);
  };

  const handleSquareClick = (key: string) => {
    if (solved) return;
    const p = pieces[key];
    if (p && p.side === "w") {
      const nextSel = selectedSq === key ? null : key;
      setSelectedSq(nextSel);
      setChessStatus(
        nextSel ? `${p.label} — tap destination square.` : puzzle.prompt
      );
      return;
    }
    if (!selectedSq) {
      setChessStatus("Tap a white piece first.");
      return;
    }
    if (selectedSq === puzzle.winFrom && key === puzzle.winTo) {
      const moving = pieces[selectedSq];
      const nextPieces = { ...pieces };
      delete nextPieces[selectedSq];
      nextPieces[key] = moving;
      setPieces(nextPieces);
      setSelectedSq(null);
      setSolved(true);
      setChessStatus(puzzle.winText);
      return;
    }
    setSelectedSq(null);
    setChessStatus(puzzle.hint);
  };

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
              style={{
                backgroundColor: room === "work" ? "#ffffff" : "#1447e6",
              }}
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
              style={{
                backgroundColor: room === "space" ? "#ffffff" : "#e03516",
              }}
              aria-hidden="true"
            />
            <span>After Hours</span>
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

            <div className="works-spread">
              {/* Left: All 4 projects visible simultaneously, zero boxes */}
              <div
                className="works-index"
                data-reveal
                style={{ ["--i" as string]: 1 }}
              >
                {PROJECTS.map((proj) => {
                  const isActive = activeProject.id === proj.id;
                  return (
                    <article
                      key={proj.id}
                      className={`work-row${isActive ? " is-active" : ""}`}
                    >
                      <span className="work-num">{proj.numeral}.</span>
                      <div className="work-main">
                        <div className="work-title-bar">
                          <h3 className="work-title">
                            <button
                              type="button"
                              onMouseEnter={() => setActiveProject(proj)}
                              onFocus={() => setActiveProject(proj)}
                              onClick={() => setActiveProject(proj)}
                              aria-pressed={isActive}
                            >
                              {proj.title}
                            </button>
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
                  );
                })}
              </div>

              {/* Right: Frameless editorial visual stage */}
              <div
                className="works-stage"
                data-reveal
                style={{ ["--i" as string]: 2 }}
              >
                <div className="stage-caption-top">
                  <span style={{ fontWeight: 650 }}>
                    {activeProject.numeral}. {activeProject.title}
                  </span>

                  {activeProject.liveIframe ? (
                    <button
                      type="button"
                      className="ed-link ed-link-accent"
                      onClick={() => setEatensityLive((v) => !v)}
                    >
                      <span>
                        {eatensityLive
                          ? "Show still preview"
                          : "Interact live inside page →"}
                      </span>
                    </button>
                  ) : (
                    <a
                      href={activeProject.primaryHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ed-link ed-link-accent"
                    >
                      <span>{activeProject.primaryLabel}</span>
                    </a>
                  )}
                </div>

                <div className="stage-canvas">
                  {activeProject.id === "eatensity" && eatensityLive ? (
                    <iframe
                      src="https://eatensity.com"
                      title="Eatensity live application"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      sandbox="allow-scripts allow-same-origin allow-forms"
                    />
                  ) : activeProject.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={activeProject.image}
                      width={1200}
                      height={800}
                      alt={`${activeProject.title} preview`}
                    />
                  ) : (
                    <div className="stage-poster-sheet">
                      <span className="beat-numeral" style={{ marginBottom: 0 }}>
                        {activeProject.numeral} / {activeProject.title}
                      </span>
                      <p className="stage-pullquote">
                        {activeProject.pullQuote}
                      </p>
                      <div>
                        <p className="work-stack">{activeProject.stack}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
                <span>Flip to After Hours →</span>
              </button>
            </div>
          </section>
        </main>
      ) : (
        /* ==================== PERSONAL SITE ("AFTER HOURS" — WARM ORANGE-RED & PAPER) ==================== */
        <main id="main" tabIndex={-1}>
          {/* SPREAD 01: WARM AFTER-HOURS INTRO */}
          <section className="personal-hero" aria-label="After hours introduction">
            <div data-reveal style={{ ["--i" as string]: 0 }}>
              <p className="beat-numeral">After hours · Hyderabad</p>
              <h1 className="personal-title">Off the clock.</h1>
              <p className="personal-lead">
                Formula 1 Sundays, a quick chess endgame, a film, or a book.
              </p>
            </div>

            <div
              className="personal-photo-frame"
              data-reveal
              style={{ ["--i" as string]: 1 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/sai-palace.jpg"
                width={1021}
                height={768}
                alt="Sai Uttej Rajoju"
              />
            </div>
          </section>

          {/* SPREAD 02: FRAMELESS F1 LIGHTS & CHESS */}
          <section
            id="play"
            className="afterhours-play"
            aria-label="F1 start lights and chess puzzle"
          >
            {/* Left: Sunday Lights Out */}
            <div className="play-column">
              <div>
                <p className="beat-numeral" style={{ marginBottom: "0.4rem" }}>
                  I — Race Sunday
                </p>
                <h2 className="play-title">Five red lights.</h2>
              </div>

              <button
                type="button"
                className="f1-open-surface"
                onClick={handleF1Tap}
                aria-label="F1 start lights reaction test"
              >
                <div className="f1-lights-row">
                  {[0, 1, 2, 3, 4].map((idx) => {
                    const state = goFlash
                      ? "go"
                      : idx < litCount
                        ? "red"
                        : "off";
                    return (
                      <span
                        key={idx}
                        className="f1-bulb"
                        data-lit={state}
                      />
                    );
                  })}
                </div>

                <div className="f1-readout-large" aria-live="polite">
                  {f1Readout}
                </div>
              </button>

              <p style={{ color: "var(--ink-muted)", maxWidth: "38ch" }}>
                {f1Note}
              </p>
            </div>

            {/* Right: Mate in One */}
            <div className="play-column">
              <div>
                <p className="beat-numeral" style={{ marginBottom: "0.4rem" }}>
                  II — Endgame Corner
                </p>
                <h2 className="play-title">Mate in one.</h2>
              </div>

              <div className="chess-open-wrap">
                <div
                  className="chess-board-4x4"
                  aria-label="Chess board corner e5 to h8"
                >
                  {[0, 1, 2, 3].map((r) =>
                    [0, 1, 2, 3].map((c) => {
                      const key = `${r},${c}`;
                      const piece = pieces[key];
                      const coord = `${FILES[c]}${RANKS[r]}`;
                      const isDark = (r + c) % 2 === 1;
                      return (
                        <button
                          key={key}
                          type="button"
                          className={`chess-cell ${
                            isDark ? "chess-cell--dark" : "chess-cell--light"
                          }`}
                          data-selected={selectedSq === key}
                          data-mate={solved && key === puzzle.winTo}
                          onClick={() => handleSquareClick(key)}
                          aria-label={
                            piece
                              ? `${piece.label} (${coord})`
                              : `Square ${coord}`
                          }
                        >
                          {piece && renderPieceSvg(piece.kind, piece.side)}
                          {c === 0 && (
                            <span
                              className="chess-coord chess-coord--r"
                              aria-hidden="true"
                            >
                              {RANKS[r]}
                            </span>
                          )}
                          {r === 3 && (
                            <span
                              className="chess-coord chess-coord--f"
                              aria-hidden="true"
                            >
                              {FILES[c]}
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.85rem",
                    maxWidth: "24ch",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontSize: "1.25rem",
                    }}
                    aria-live="polite"
                  >
                    {chessStatus}
                  </p>
                  <div className="editorial-links">
                    <button
                      type="button"
                      className="ed-link ed-link-accent"
                      onClick={() => selectPuzzle(puzzleIdx)}
                    >
                      <span>Reset</span>
                    </button>
                    <button
                      type="button"
                      className="ed-link"
                      onClick={() =>
                        selectPuzzle((puzzleIdx + 1) % PUZZLES.length)
                      }
                    >
                      <span>Switch puzzle →</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* QUIET FOOTER WITH PROFILE LINKS ONLY */}
          <footer className="quiet-footer">
            <div className="editorial-links">
              <a
                href={SITE_PROFILE.links.letterboxd}
                target="_blank"
                rel="noopener noreferrer"
                className="ed-link"
              >
                <span>Letterboxd</span>
                <span aria-hidden="true">↗</span>
              </a>
              <a
                href={SITE_PROFILE.links.myanimelist}
                target="_blank"
                rel="noopener noreferrer"
                className="ed-link"
              >
                <span>MyAnimeList</span>
                <span aria-hidden="true">↗</span>
              </a>
              <a
                href={SITE_PROFILE.links.goodreads}
                target="_blank"
                rel="noopener noreferrer"
                className="ed-link"
              >
                <span>Goodreads</span>
                <span aria-hidden="true">↗</span>
              </a>
              <a href={SITE_PROFILE.links.email} className="ed-link">
                <span>{SITE_PROFILE.links.emailAddress}</span>
              </a>
            </div>

            <button
              type="button"
              className="ed-link ed-link-accent"
              onClick={() => switchRoom("work")}
            >
              <span>← Back to Work</span>
            </button>
          </footer>
        </main>
      )}
    </div>
  );
}
