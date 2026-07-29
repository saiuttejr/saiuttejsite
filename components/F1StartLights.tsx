"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const LIGHT_COUNT = 5;
const LIGHT_ON_INTERVAL = 180;
const LIGHTS_OUT_DELAY = 260;
const FADE_DURATION = 360;
const STORAGE_KEY = "f1-intro-played";

type Phase = "idle" | "running" | "done";

export default function F1StartLights() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [activeLights, setActiveLights] = useState(0);
  const [lightsOut, setLightsOut] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const skipRef = useRef<HTMLButtonElement>(null);

  const finish = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setPhase("done");
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // storage unavailable — the intro simply plays again next visit
    }
  }, []);

  // Renders nothing on the server and on first paint, so the overlay can never
  // become the LCP element or delay it.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }

    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        setPhase("done");
        return;
      }
    } catch {
      // storage unavailable — play the animation
    }

    setPhase("running");

    const timers = timersRef.current;
    for (let i = 1; i <= LIGHT_COUNT; i++) {
      timers.push(setTimeout(() => setActiveLights(i), i * LIGHT_ON_INTERVAL));
    }

    const allOnTime = LIGHT_COUNT * LIGHT_ON_INTERVAL + LIGHTS_OUT_DELAY;
    timers.push(setTimeout(() => setLightsOut(true), allOnTime));
    timers.push(setTimeout(finish, allOnTime + FADE_DURATION));

    return () => {
      timers.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [finish]);

  // Move focus to the skip control so keyboard users are never stuck behind it.
  useEffect(() => {
    if (phase === "running") skipRef.current?.focus();
  }, [phase]);

  useEffect(() => {
    if (phase !== "running") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, finish]);

  if (phase !== "running") return null;

  return (
    <div className={`f1-start-overlay${lightsOut ? " f1-start-fade" : ""}`}>
      <div className="f1-lights-row" aria-hidden="true">
        {Array.from({ length: LIGHT_COUNT }, (_, i) => (
          <div key={i} className="f1-light-column">
            <div
              className={`f1-light-bulb${i < activeLights ? " f1-light-on" : ""}${lightsOut ? " f1-light-off" : ""}`}
            />
            <div
              className={`f1-light-bulb${i < activeLights ? " f1-light-on" : ""}${lightsOut ? " f1-light-off" : ""}`}
            />
          </div>
        ))}
      </div>

      <button ref={skipRef} type="button" className="f1-skip" onClick={finish}>
        Skip intro
      </button>
    </div>
  );
}
