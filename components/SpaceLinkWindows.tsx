import type { ReactElement } from "react";
import type { SpaceWindowId } from "@/lib/space-data";

const Frame = () => (
  <rect x="4" y="4" width="192" height="132" rx="11" fill="none" stroke="#1b2554" strokeWidth="8" />
);

function Letterboxd() {
  return (
    <>
      <rect width="200" height="140" rx="14" fill="#1a2760" />
      <rect x="102" y="22" width="84" height="54" rx="4" fill="#dce8ff" />
      <circle cx="128" cy="49" r="10" fill="#ff8000" />
      <circle cx="144" cy="49" r="10" fill="#00e054" fillOpacity=".92" />
      <circle cx="160" cy="49" r="10" fill="#40bcf4" fillOpacity=".92" />
      <rect x="112" y="78" width="64" height="5" rx="2.5" fill="#0a0f2c" />
      <rect x="8" y="104" width="104" height="36" rx="12" fill="#0a0f2c" />
      <circle cx="42" cy="94" r="12" fill="#0a0f2c" />
      <circle cx="76" cy="96" r="11" fill="#0a0f2c" />
      <path d="M28,108 q14,-12 28,0 z M62,109 q14,-11 28,0 z" fill="#0a0f2c" />
    </>
  );
}

function boardSquares() {
  const squares: ReactElement[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 0) continue;
      const y0 = 96 - r * 8;
      const y1 = 96 - (r + 1) * 8;
      const h0 = 54 - r * 3;
      const h1 = 54 - (r + 1) * 3;
      const a = 100 - h0 + (c * 2 * h0) / 8;
      const b = 100 - h0 + ((c + 1) * 2 * h0) / 8;
      const d = 100 - h1 + (c * 2 * h1) / 8;
      const e = 100 - h1 + ((c + 1) * 2 * h1) / 8;
      squares.push(
        <polygon
          key={`${r}-${c}`}
          points={`${a.toFixed(1)},${y0} ${b.toFixed(1)},${y0} ${e.toFixed(1)},${y1} ${d.toFixed(1)},${y1}`}
          fill="#5a3a2a"
        />
      );
    }
  }
  return squares;
}

function Lichess() {
  return (
    <>
      <rect width="200" height="140" rx="14" fill="#f2c15f" />
      <rect y="100" width="200" height="40" fill="#d6963a" />
      <rect x="34" y="98" width="132" height="8" rx="3" fill="#7a4a22" />
      <rect x="48" y="106" width="7" height="34" fill="#7a4a22" />
      <rect x="145" y="106" width="7" height="34" fill="#7a4a22" />
      <polygon points="46,96 154,96 142,64 58,64" fill="#f3e6c8" />
      {boardSquares()}
      <g fill="#fff7e8">
        <rect x="80" y="48" width="9" height="15" rx="1" />
        <rect x="78" y="45" width="13" height="5" rx="1" />
      </g>
      <g fill="#241a2a">
        <circle cx="118" cy="50" r="4" />
        <path d="M112,66 h12 l-2,-12 h-8 z" />
      </g>
      <path d="M178,98 L178,62 L158,46" stroke="#3a2412" strokeWidth="3" fill="none" />
      <polygon points="146,40 168,40 172,52 142,52" fill="#3a2412" />
      <polygon points="144,52 170,52 192,98 128,98" fill="#fff0b8" opacity=".2" />
    </>
  );
}

function MyAnimeList() {
  return (
    <>
      <rect width="200" height="140" rx="14" fill="#35275a" />
      <rect x="22" y="20" width="96" height="60" rx="5" fill="#2b3f80" />
      <circle cx="98" cy="38" r="7" fill="#fff3d6" />
      <path d="M22,80 V62 Q50,48 72,62 T118,58 V80 Z" fill="#161d47" />
      <g fill="#ffb4d0">
        <ellipse cx="40" cy="36" rx="3" ry="1.8" />
        <ellipse cx="58" cy="48" rx="3" ry="1.8" />
        <ellipse cx="76" cy="30" rx="3" ry="1.8" />
        <ellipse cx="88" cy="52" rx="3" ry="1.8" />
      </g>
      <rect x="62" y="82" width="12" height="10" fill="#1d1535" />
      <rect x="44" y="92" width="48" height="4" rx="2" fill="#1d1535" />
      <rect x="0" y="108" width="200" height="32" fill="#1d1535" />
      <circle cx="152" cy="84" r="16" fill="#1d1535" />
      <path d="M137,84 a15,15 0 0 1 30,0" fill="none" stroke="#e8c0ff" strokeWidth="3" />
      <circle cx="137" cy="87" r="5" fill="#e8c0ff" />
      <circle cx="167" cy="87" r="5" fill="#e8c0ff" />
      <path d="M132,108 q20,-18 40,0 v6 h-40z" fill="#1d1535" />
    </>
  );
}

const SPINES = ["#b8473a", "#e8c36a", "#3f6b8a", "#6b8f5a", "#8a5a9a", "#d9824a"];

function bookSpines() {
  const books: ReactElement[] = [];
  for (let r = 0; r < 3; r++) {
    let x = 24;
    for (let i = 0; i < 7; i++) {
      const w = 7 + ((i * 5 + r * 3) % 5);
      const h = 24 + ((i * 7 + r * 5) % 10);
      books.push(
        <rect
          key={`${r}-${i}`}
          x={x}
          y={50 + r * 30 - h + 6}
          width={w}
          height={h}
          fill={SPINES[(i + r * 2) % 6]}
        />
      );
      x += w + 2;
    }
  }
  return books;
}

function Goodreads() {
  return (
    <>
      <rect width="200" height="140" rx="14" fill="#e7a850" />
      <rect x="14" y="12" width="98" height="116" rx="4" fill="#7a4a2a" />
      <rect x="20" y="18" width="86" height="104" fill="#4a2c18" />
      {bookSpines()}
      <rect x="20" y="56" width="86" height="3" fill="#7a4a2a" />
      <rect x="20" y="86" width="86" height="3" fill="#7a4a2a" />
      <rect x="20" y="116" width="86" height="3" fill="#7a4a2a" />
      <rect x="124" y="86" width="56" height="42" rx="10" fill="#7b3b2a" />
      <rect x="118" y="72" width="20" height="56" rx="8" fill="#6a3224" />
      <circle cx="146" cy="74" r="8" fill="#3a1d12" />
      <rect x="140" y="80" width="14" height="12" rx="3" fill="#3a1d12" />
      <path d="M186,128 V56" stroke="#3a2412" strokeWidth="3" />
      <polygon points="174,44 198,44 194,58 178,58" fill="#fff0b8" />
    </>
  );
}

function Mail() {
  return (
    <>
      <rect width="200" height="140" rx="14" fill="#1f4a46" />
      <polygon points="26,26 84,18 84,64 26,64" fill="#2b6a63" opacity=".55" />
      <rect x="0" y="100" width="200" height="40" fill="#102b29" />
      <rect x="68" y="70" width="64" height="40" rx="3" fill="#f4efe2" />
      <path d="M68,70 L100,92 L132,70" fill="none" stroke="#d6cdb8" strokeWidth="2" />
      <path d="M28,100 L40,64 L18,50" stroke="#0a1c1b" strokeWidth="3" fill="none" />
      <polygon points="8,42 34,42 38,54 4,54" fill="#6fe0a0" />
      <polygon points="6,54 36,54 56,100 -14,100" fill="#bff5d4" opacity=".16" />
      <rect x="150" y="84" width="14" height="16" rx="3" fill="#e8c36a" />
      <path
        d="M176,100 v-14 M176,86 q-10,-8 -14,-18 M176,86 q10,-8 14,-16"
        stroke="#6b8f5a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </>
  );
}

function Art({ id }: { id: SpaceWindowId }) {
  switch (id) {
    case "letterboxd":
      return <Letterboxd />;
    case "lichess":
      return <Lichess />;
    case "myanimelist":
      return <MyAnimeList />;
    case "goodreads":
      return <Goodreads />;
    case "email":
      return <Mail />;
  }
}

/** A small lit room for each link: the TV for films, a chess table, a night sky for anime, a shelf, a letter. */
export function SpaceWindowArt({ id }: { id: SpaceWindowId }) {
  return (
    <svg viewBox="0 0 200 140" aria-hidden="true" focusable="false">
      <Art id={id} />
      <Frame />
    </svg>
  );
}
