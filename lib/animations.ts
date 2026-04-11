export const EASE_CINEMATIC = "power4.inOut";
export const EASE_OUT = "power3.out";
export const EASE_MAGNETIC = "power2.out";

export const DURATION = {
  fast: 0.3,
  normal: 0.8,
  slow: 1.2,
  reveal: 1.6,
  scatter: 2.0,
  slide: 0.8,
} as const;

export const STAGGER = {
  char: 0.03,
  tight: 0.08,
  normal: 0.15,
  loose: 0.25,
} as const;

export const clipReveal = {
  from: { clipPath: "inset(0 100% 0 0)" },
  to: { clipPath: "inset(0 0% 0 0)" },
} as const;

export const fadeUp = {
  from: { y: 30, opacity: 0 },
  to: { y: 0, opacity: 1 },
} as const;