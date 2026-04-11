"use client";

import { useEffect, useState, useRef } from "react";

const LIGHT_COUNT = 5;
const LIGHT_ON_INTERVAL = 600;
const LIGHTS_OUT_DELAY = 800;
const FADE_DURATION = 600;

export default function F1StartLights() {
  const [activeLights, setActiveLights] = useState(0);
  const [lightsOut, setLightsOut] = useState(false);
  const [done, setDone] = useState(false);
  const checkedRef = useRef(false);
  const skipRef = useRef(false);

  // On mount: check localStorage. If already played, mark done immediately.
  // We use refs + a single setState to avoid the "loading → null → running → overlay" flash.
  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    try {
      if (localStorage.getItem("f1-intro-played") === "1") {
        skipRef.current = true;
        setDone(true);
        return;
      }
    } catch {
      // storage unavailable — play the animation
    }

    // Start the light sequence
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 1; i <= LIGHT_COUNT; i++) {
      timers.push(
        setTimeout(() => setActiveLights(i), i * LIGHT_ON_INTERVAL)
      );
    }

    const allOnTime = LIGHT_COUNT * LIGHT_ON_INTERVAL + LIGHTS_OUT_DELAY;
    timers.push(setTimeout(() => setLightsOut(true), allOnTime));

    timers.push(
      setTimeout(() => {
        setDone(true);
        try {
          localStorage.setItem("f1-intro-played", "1");
        } catch {
          // ignore
        }
      }, allOnTime + FADE_DURATION)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  // Lock scroll while overlay is visible
  useEffect(() => {
    if (done || skipRef.current) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [done]);

  if (done) return null;

  // Overlay renders from the FIRST frame — covers everything until lights out
  return (
    <div
      className={`f1-start-overlay${lightsOut ? " f1-start-fade" : ""}`}
      aria-hidden="true"
    >
      <div className="f1-lights-row">
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
    </div>
  );
}
