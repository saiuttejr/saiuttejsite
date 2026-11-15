export type RGB = readonly [number, number, number];
export type RGBA = readonly [number, number, number, number];

export const clamp = (u: number, a = 0, b = 1): number => Math.min(b, Math.max(a, u));
export const lerp = (a: number, b: number, u: number): number => a + (b - a) * u;
export const smooth = (u: number): number => u * u * (3 - 2 * u);

const hex = (h: string): RGB => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

interface Stop {
  t: number;
  top: RGB;
  mid: RGB;
  hor: RGB;
  far: RGB;
  midL: RGB;
  near: RGB;
  pillBg: RGBA;
  pillInk: RGB;
  sun: number;
  sunY: number;
  win: number;
  stars: number;
  moon: number;
  birds: number;
}

const NIGHT = {
  top: hex("#05070f"),
  mid: hex("#0b1228"),
  hor: hex("#16204a"),
  far: hex("#141c40"),
  midL: hex("#0c1331"),
  near: hex("#060a1b"),
  pillBg: [14, 18, 40, 0.7] as RGBA,
  pillInk: hex("#e9eeff"),
  sun: 0,
  sunY: 800,
  win: 1,
  stars: 1,
  moon: 1,
  birds: 0,
};

/** Golden hour at the top of the page, night at the bottom. `t` is scroll progress. */
const STOPS: readonly Stop[] = [
  {
    t: 0,
    top: hex("#6a3d45"),
    mid: hex("#b0664b"),
    hor: hex("#e6a062"),
    far: hex("#99605a"),
    midL: hex("#6b4351"),
    near: hex("#3a2633"),
    pillBg: [26, 14, 22, 0.52],
    pillInk: hex("#fff1e0"),
    sun: 0.9,
    sunY: 650,
    win: 0,
    stars: 0,
    moon: 0,
    birds: 0.8,
  },
  {
    t: 0.22,
    top: hex("#4a3a69"),
    mid: hex("#a45a68"),
    hor: hex("#e48d56"),
    far: hex("#835475"),
    midL: hex("#5a3f6a"),
    near: hex("#2d2244"),
    pillBg: [26, 16, 34, 0.55],
    pillInk: hex("#fff1e0"),
    sun: 0.8,
    sunY: 742,
    win: 0.12,
    stars: 0,
    moon: 0,
    birds: 0.5,
  },
  {
    t: 0.48,
    top: hex("#18204a"),
    mid: hex("#34407a"),
    hor: hex("#9a5578"),
    far: hex("#3f3f78"),
    midL: hex("#252a58"),
    near: hex("#141839"),
    pillBg: [14, 18, 44, 0.66],
    pillInk: hex("#e9eeff"),
    sun: 0,
    sunY: 790,
    win: 0.7,
    stars: 0.45,
    moon: 0.5,
    birds: 0,
  },
  { t: 0.74, ...NIGHT },
  { t: 1, ...NIGHT },
];

export interface Palette {
  top: RGB;
  mid: RGB;
  hor: RGB;
  far: RGB;
  midL: RGB;
  near: RGB;
  pillBg: RGBA;
  pillInk: RGB;
  sun: number;
  sunY: number;
  win: number;
  stars: number;
  moon: number;
  birds: number;
}

export const mix3 = (a: RGB, b: RGB, u: number): RGB => [
  lerp(a[0], b[0], u),
  lerp(a[1], b[1], u),
  lerp(a[2], b[2], u),
];

const mix4 = (a: RGBA, b: RGBA, u: number): RGBA => [
  lerp(a[0], b[0], u),
  lerp(a[1], b[1], u),
  lerp(a[2], b[2], u),
  lerp(a[3], b[3], u),
];

export function paletteAt(t: number): Palette {
  let i = 0;
  while (i < STOPS.length - 2 && t > STOPS[i + 1].t) i++;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const u = smooth(clamp((t - a.t) / (b.t - a.t)));
  return {
    top: mix3(a.top, b.top, u),
    mid: mix3(a.mid, b.mid, u),
    hor: mix3(a.hor, b.hor, u),
    far: mix3(a.far, b.far, u),
    midL: mix3(a.midL, b.midL, u),
    near: mix3(a.near, b.near, u),
    pillBg: mix4(a.pillBg, b.pillBg, u),
    pillInk: mix3(a.pillInk, b.pillInk, u),
    sun: lerp(a.sun, b.sun, u),
    sunY: lerp(a.sunY, b.sunY, u),
    win: lerp(a.win, b.win, u),
    stars: lerp(a.stars, b.stars, u),
    moon: lerp(a.moon, b.moon, u),
    birds: lerp(a.birds, b.birds, u),
  };
}

const round = (c: readonly number[]): number[] => c.slice(0, 3).map(Math.round);

export const rgb = (c: RGB): string => `rgb(${round(c).join(",")})`;
export const rgba = (c: RGBA): string => `rgba(${round(c).join(",")},${c[3].toFixed(2)})`;
export const toHex = (c: RGB): string =>
  `#${round(c)
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;

/** Made-up time of day shown bottom left: about 5 pm at the top, about 9 pm at the end. */
const CLOCK: readonly (readonly [number, number])[] = [
  [0, 17 * 60 + 8],
  [0.22, 17 * 60 + 50],
  [0.48, 18 * 60 + 35],
  [0.74, 20 * 60 + 10],
  [1, 21 * 60 + 5],
];

export function clockLabel(t: number): string {
  let i = 0;
  while (i < CLOCK.length - 2 && t > CLOCK[i + 1][0]) i++;
  const [t0, m0] = CLOCK[i];
  const [t1, m1] = CLOCK[i + 1];
  const minutes = Math.round(lerp(m0, m1, clamp((t - t0) / (t1 - t0))));
  const hours = Math.floor(minutes / 60);
  return `${((hours + 11) % 12) + 1}:${String(minutes % 60).padStart(2, "0")} ${hours >= 12 ? "pm" : "am"}`;
}

/** 0 in daylight, 1 once it is dark; drives the wall dimming and the cursor's headlights. */
export const nightAt = (t: number): number => smooth(clamp((t - 0.3) / 0.42));

/** The wall dims as it gets dark; the lamp (cursor) keeps its surroundings bright. */
export function lampAt(t: number): { dark: number; radius: number } {
  const d = nightAt(t);
  return { dark: d * 0.82, radius: lerp(2600, 560, d) };
}

/** Past this point the masthead pills switch to their night colours. */
export const NIGHT_PILL_AT = 0.34;
