"use client";

import { useEffect, useMemo, useState } from "react";
import { socialLinks } from "@/lib/constants";

const triggerSequence = "nf3";

function isDarkSquare(index: number) {
  const row = Math.floor(index / 8);
  const col = index % 8;
  return (row + col) % 2 === 1;
}

export default function ChessEasterEgg() {
  const [revealed, setRevealed] = useState(false);
  const boardSquares = useMemo(() => Array.from({ length: 64 }, (_, index) => index), []);

  useEffect(() => {
    let typed = "";
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (event.key.length !== 1) return;

      typed = `${typed}${event.key.toLowerCase()}`.slice(-triggerSequence.length);

      if (typed === triggerSequence) {
        setRevealed(true);
        typed = "";

        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(() => setRevealed(false), 3200);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  if (!revealed) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed right-4 bottom-4 z-30 translate-y-0 opacity-100 transition-all duration-500 ease-[var(--ease-out)]"
    >
      <div className="pointer-events-auto w-[15rem] rounded-[1.4rem] border border-white/10 bg-black/55 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.14em] text-text-dim">
              Chess side quest
            </p>
            <p className="mt-2 text-[0.95rem] leading-[1.6] text-text">
              1. Nf3
            </p>
          </div>
          <a
            href={socialLinks.lichess}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline font-mono text-[10px] tracking-[0.14em] text-text-muted hover:text-text"
          >
            Lichess ↗
          </a>
        </div>

        <div className="mt-4 grid grid-cols-8 overflow-hidden rounded-[0.9rem] border border-white/8">
          {boardSquares.map((square) => (
            <div
              key={square}
              className={`aspect-square ${isDarkSquare(square) ? "bg-white/8" : "bg-white/[0.02]"}`}
            />
          ))}
        </div>

        <p className="mt-3 text-[0.85rem] leading-[1.6] text-text-muted">
          11k+ games, mostly rapid, still hanging pieces sometimes.
        </p>
      </div>
    </div>
  );
}