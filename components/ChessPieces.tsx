"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const PIECE_CHARS = ["♔", "♕", "♘", "♗", "♜", "♟"];
const PIECE_COUNT = 6;
const HIT_RADIUS = 34;
const IMPULSE_STRENGTH = 14;
const FRICTION = 0.95;
const SETTLE_THRESHOLD = 0.4;
const EDGE_MARGIN = 60;
const POP_DURATION = 320; // ms

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Piece {
  id: number;
  char: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hits: number;
  popping: boolean;
  popStart: number;
}

/* Immutable snapshot for rendering */
interface PieceSnapshot {
  id: number;
  char: string;
  x: number;
  y: number;
  hits: number;
  popping: boolean;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function generatePieces(): Piece[] {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const docH = document.documentElement.scrollHeight;
  const pieces: Piece[] = [];

  for (let i = 0; i < PIECE_COUNT; i++) {
    let x: number, y: number;
    let attempts = 0;

    do {
      x = randomBetween(EDGE_MARGIN, vw - EDGE_MARGIN);
      y = randomBetween(vh * 0.3, Math.max(docH - EDGE_MARGIN, vh * 2));
      attempts++;
    } while (
      attempts < 30 &&
      pieces.some((p) => Math.hypot(p.x - x, p.y - y) < 120)
    );

    pieces.push({
      id: i,
      char: PIECE_CHARS[Math.floor(Math.random() * PIECE_CHARS.length)],
      x, y,
      vx: 0, vy: 0,
      hits: 0,
      popping: false,
      popStart: 0,
    });
  }

  return pieces;
}

function snapshot(pieces: Piece[]): PieceSnapshot[] {
  return pieces.map((p) => ({
    id: p.id, char: p.char,
    x: p.x, y: p.y,
    hits: p.hits, popping: p.popping,
  }));
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ChessPieces() {
  const [activated, setActivated] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem("chess-pieces-active") === "1";
    } catch {
      return false;
    }
  });
  const [visiblePieces, setVisiblePieces] = useState<PieceSnapshot[]>([]);
  const piecesRef = useRef<Piece[]>([]);
  const rafRef = useRef(0);
  const activatedRef = useRef(activated);

  // Listen for activation event from Lichess hover
  useEffect(() => {
    activatedRef.current = activated;
  }, [activated]);

  useEffect(() => {
    const handler = () => {
      if (activatedRef.current) return;
      activatedRef.current = true;
      setActivated(true);
      try { sessionStorage.setItem("chess-pieces-active", "1"); } catch { /* ignore */ }
    };

    window.addEventListener("chess-pieces-activate", handler);
    return () => window.removeEventListener("chess-pieces-activate", handler);
  }, []);

  // Generate pieces on activation
  useEffect(() => {
    if (!activated || piecesRef.current.length > 0) return;
    piecesRef.current = generatePieces();
    setVisiblePieces(snapshot(piecesRef.current));
  }, [activated]);

  // Physics + collision loop
  useEffect(() => {
    if (!activated) return;

    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const cursor = window.__cursorPos;
      const scrollY = window.scrollY;
      let needsRender = false;
      const pieces = piecesRef.current;

      for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];

        if (p.popping) {
          if (now - p.popStart > POP_DURATION) {
            pieces.splice(i, 1);
            needsRender = true;
          }
          continue;
        }

        if (cursor) {
          const dx = p.x - cursor.x;
          const dy = (p.y - scrollY) - cursor.y;
          const dist = Math.hypot(dx, dy);

          if (dist < HIT_RADIUS && dist > 0) {
            const nx = dx / dist;
            const ny = dy / dist;

            if (p.hits === 0) {
              p.vx += nx * IMPULSE_STRENGTH;
              p.vy += ny * IMPULSE_STRENGTH;
              p.hits = 1;
              needsRender = true;
            } else if (p.hits === 1 && Math.abs(p.vx) < 2 && Math.abs(p.vy) < 2) {
              p.popping = true;
              p.popStart = now;
              needsRender = true;
            }
          }
        }

        if (Math.abs(p.vx) > SETTLE_THRESHOLD || Math.abs(p.vy) > SETTLE_THRESHOLD) {
          p.x += p.vx * dt * 60;
          p.y += p.vy * dt * 60;
          p.vx *= Math.pow(FRICTION, dt * 60);
          p.vy *= Math.pow(FRICTION, dt * 60);

          const vw = window.innerWidth;
          if (p.x < EDGE_MARGIN) { p.x = EDGE_MARGIN; p.vx = Math.abs(p.vx) * 0.5; }
          if (p.x > vw - EDGE_MARGIN) { p.x = vw - EDGE_MARGIN; p.vx = -Math.abs(p.vx) * 0.5; }

          needsRender = true;
        } else {
          p.vx = 0;
          p.vy = 0;
        }
      }

      if (needsRender) setVisiblePieces(snapshot(pieces));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [activated]);

  if (!activated || visiblePieces.length === 0) return null;

  return (
    <div className="chess-pieces-layer" aria-hidden="true">
      {visiblePieces.map((p) => (
        <span
          key={p.id}
          className={`chess-piece${p.hits > 0 ? " chess-piece-hit" : ""}${p.popping ? " chess-piece-pop" : ""}`}
          style={{ transform: `translate3d(${p.x}px, ${p.y}px, 0)` }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
}
