"use client";

import { useEffect, useRef } from "react";
import { clamp, lerp, nightAt } from "@/lib/space-palette";

interface Mark {
  lx: number;
  ly: number;
  rx: number;
  ry: number;
  born: number;
}

const INTERACTIVE = "a, button, [role='button'], .space-hit";

const FOLLOW = 0.34; // share of the gap to the pointer closed per frame at 60 fps
const TURN = 0.16; // same, for the heading
const TURN_MIN = 90; // px/s: slower than this the car keeps its heading
const MARK_MIN = 260; // px/s: faster than this the rear tyres leave marks
const MARK_GAP = 5; // px of travel between two marks
const MARK_LIFE = 1100; // ms
const MAX_MARKS = 180;
const REAR = 15; // px from the car's centre to its rear axle
const HALF_TRACK = 8.2;
const SNAP = 0.35;
const BUCKETS = 8;

export function SpaceCursor() {
  const carRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const car = carRef.current;
    const canvas = trailRef.current;
    const context = canvas?.getContext("2d");
    if (!car || !canvas || !context) return;

    const carEl: HTMLDivElement = car;
    const canvasEl: HTMLCanvasElement = canvas;
    const ctx: CanvasRenderingContext2D = context;
    const html = document.documentElement;
    const fine = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const forced = window.matchMedia("(forced-colors: active)");

    const marks: Mark[] = [];
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let vx = 0;
    let vy = 0;
    let heading = -90;
    let travelled = 0;
    let night = 0;
    let lights = "";
    let shown = false;
    let hover = false;
    let running = false;
    let painted = false;
    let raf = 0;
    let last = 0;
    let width = 0;
    let height = 0;

    function sizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      const scale = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(3.5e6 / (width * height)));
      canvasEl.width = Math.round(width * scale);
      canvasEl.height = Math.round(height * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      painted = false;
    }

    function readNight() {
      const max = html.scrollHeight - window.innerHeight;
      night = nightAt(max > 0 ? clamp(window.scrollY / max) : 0);
      const value = night.toFixed(2);
      if (value === lights) return;
      lights = value;
      carEl.style.setProperty("--space-car-lights", value);
    }

    function paint(now: number) {
      while (marks.length > 0 && now - marks[0].born > MARK_LIFE) marks.shift();
      if (marks.length < 2) {
        if (painted) {
          ctx.clearRect(0, 0, width, height);
          painted = false;
        }
        return;
      }

      ctx.clearRect(0, 0, width, height);
      painted = true;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const layers = [
        { color: "255,240,225", alpha: lerp(0.1, 0.22, night), light: true },
        { color: "18,8,14", alpha: lerp(0.36, 0.2, night), light: false },
      ];
      for (const layer of layers) {
        for (let b = 0; b < BUCKETS; b++) {
          const fresh = (b + 0.5) / BUCKETS;
          const w = 2.2 + fresh * 1.6;
          ctx.strokeStyle = `rgba(${layer.color},${(fresh * fresh * layer.alpha).toFixed(3)})`;
          ctx.lineWidth = layer.light ? w + 1.5 : w * 0.56;
          ctx.beginPath();
          for (let i = 1; i < marks.length; i++) {
            const a = marks[i - 1];
            const m = marks[i];
            if (m.born - a.born > 120) continue;
            const age = 1 - (now - m.born) / MARK_LIFE;
            if (Math.min(BUCKETS - 1, Math.floor(age * BUCKETS)) !== b) continue;
            ctx.moveTo(a.lx, a.ly);
            ctx.lineTo(m.lx, m.ly);
            ctx.moveTo(a.rx, a.ry);
            ctx.lineTo(m.rx, m.ry);
          }
          ctx.stroke();
        }
      }
    }

    function tick(now: number) {
      raf = 0;
      const dt = clamp((now - last) / 1000, 0.001, 0.05);
      last = now;

      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const gap = Math.hypot(dx, dy);
      const k = gap < SNAP ? 1 : 1 - Math.pow(1 - FOLLOW, dt * 60);
      const mx = dx * k;
      const my = dy * k;
      pos.x += mx;
      pos.y += my;

      const blend = 1 - Math.pow(0.65, dt * 60);
      vx += (mx / dt - vx) * blend;
      vy += (my / dt - vy) * blend;
      const speed = Math.hypot(vx, vy);

      if (speed > TURN_MIN) {
        let diff = (Math.atan2(vy, vx) * 180) / Math.PI - heading;
        diff = ((((diff + 180) % 360) + 360) % 360) - 180;
        heading += diff * (1 - Math.pow(1 - TURN, dt * 60));
        heading = ((((heading + 180) % 360) + 360) % 360) - 180;
      }
      carEl.style.transform = `translate3d(${pos.x.toFixed(2)}px,${pos.y.toFixed(2)}px,0) rotate(${(heading + 90).toFixed(1)}deg)`;

      if (speed > MARK_MIN) {
        travelled += Math.hypot(mx, my);
        if (travelled >= MARK_GAP) {
          travelled %= MARK_GAP;
          const rad = (heading * Math.PI) / 180;
          const fx = Math.cos(rad);
          const fy = Math.sin(rad);
          const bx = pos.x - fx * REAR;
          const by = pos.y - fy * REAR;
          const sx = -fy * HALF_TRACK;
          const sy = fx * HALF_TRACK;
          marks.push({ lx: bx - sx, ly: by - sy, rx: bx + sx, ry: by + sy, born: now });
          if (marks.length > MAX_MARKS) marks.shift();
        }
      } else {
        travelled = 0;
      }

      paint(now);
      if (gap > SNAP || speed > 6 || marks.length > 0) raf = window.requestAnimationFrame(tick);
    }

    function kick() {
      if (raf || !shown) return;
      last = performance.now();
      raf = window.requestAnimationFrame(tick);
    }

    function show(x: number, y: number) {
      shown = true;
      target.x = pos.x = x;
      target.y = pos.y = y;
      vx = 0;
      vy = 0;
      travelled = 0;
      carEl.style.transform = `translate3d(${x}px,${y}px,0) rotate(${heading + 90}deg)`;
      carEl.classList.add("is-on");
      html.classList.add("space-cursor-on");
    }

    function hide() {
      if (!shown) return;
      shown = false;
      hover = false;
      window.cancelAnimationFrame(raf);
      raf = 0;
      marks.length = 0;
      paint(performance.now());
      carEl.classList.remove("is-on", "is-hover", "is-down");
      html.classList.remove("space-cursor-on");
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      target.x = event.clientX;
      target.y = event.clientY;
      if (!shown) show(event.clientX, event.clientY);
      const over = event.target instanceof Element && event.target.closest(INTERACTIVE) !== null;
      if (over !== hover) {
        hover = over;
        carEl.classList.toggle("is-hover", over);
      }
      kick();
    }

    function onDown(event: PointerEvent) {
      if (!shown || event.pointerType === "touch") return;
      target.x = pos.x = event.clientX;
      target.y = pos.y = event.clientY;
      carEl.classList.add("is-down");
      kick();
    }

    function onUp() {
      carEl.classList.remove("is-down");
    }

    function onResize() {
      sizeCanvas();
      readNight();
    }

    function onVisibility() {
      if (document.hidden) hide();
    }

    function start() {
      running = true;
      readNight();
      sizeCanvas();
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      window.addEventListener("pointercancel", onUp, { passive: true });
      window.addEventListener("scroll", readNight, { passive: true });
      window.addEventListener("resize", onResize);
      window.addEventListener("blur", hide);
      document.addEventListener("visibilitychange", onVisibility);
      html.addEventListener("pointerleave", hide);
    }

    function stop() {
      running = false;
      hide();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("scroll", readNight);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", onVisibility);
      html.removeEventListener("pointerleave", hide);
    }

    function sync() {
      const wanted = fine.matches && !calm.matches && !forced.matches;
      if (wanted && !running) start();
      else if (!wanted && running) stop();
    }

    fine.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    forced.addEventListener("change", sync);
    sync();

    return () => {
      fine.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
      forced.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return (
    <>
      <div className="space-trail" aria-hidden="true">
        <canvas ref={trailRef} />
      </div>
      <div ref={carRef} className="space-car" aria-hidden="true">
        <div className="space-car-body">
          <svg viewBox="0 0 24 46" width="24" height="46" focusable="false">
            <defs>
              <radialGradient id="space-car-shadow">
                <stop offset="0" stopColor="#000" stopOpacity="0.4" />
                <stop offset="1" stopColor="#000" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="space-car-glow">
                <stop offset="0" stopColor="#e03516" stopOpacity="0.55" />
                <stop offset="1" stopColor="#e03516" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="space-car-beam" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#fff1cf" stopOpacity="0.6" />
                <stop offset="1" stopColor="#fff1cf" stopOpacity="0" />
              </linearGradient>
            </defs>

            <ellipse cx="12" cy="23" rx="16" ry="28" fill="url(#space-car-shadow)" />
            <ellipse className="space-car-glow" cx="12" cy="23" rx="19" ry="31" fill="url(#space-car-glow)" />
            <g className="space-car-lights">
              <path d="M7.6 2.6 L-1.5 -36 L9.8 -36 Z" fill="url(#space-car-beam)" />
              <path d="M16.4 2.6 L14.2 -36 L25.5 -36 Z" fill="url(#space-car-beam)" />
            </g>

            <rect x="2.8" y="40.4" width="18.4" height="3.6" rx="1.2" fill="#b52a10" />
            <rect x="3.6" y="41.6" width="16.8" height="0.8" fill="#6e1807" />
            <rect x="1.9" y="39.6" width="1.7" height="5.4" rx="0.7" fill="#241418" />
            <rect x="20.4" y="39.6" width="1.7" height="5.4" rx="0.7" fill="#241418" />
            <rect className="space-car-brake" x="10.2" y="43.2" width="3.6" height="0.9" rx="0.45" fill="#ff5a3c" />

            <rect x="0" y="29.4" width="6.8" height="11.6" rx="2.5" fill="#14101a" />
            <rect x="17.2" y="29.4" width="6.8" height="11.6" rx="2.5" fill="#14101a" />
            <rect x="1.1" y="31.4" width="1.2" height="7.4" rx="0.6" fill="#3d3446" />
            <rect x="21.7" y="31.4" width="1.2" height="7.4" rx="0.6" fill="#3d3446" />

            <path
              d="M9.2 10 H14.8 L16.7 17.2 L17.5 25 L16.7 33.5 L15.2 40.6 H8.8 L7.3 33.5 L6.5 25 L7.3 17.2 Z"
              fill="#e03516"
            />
            <path d="M7.3 17.2 L6.5 25 L7.3 33.5 L9 32.6 L8.6 25 L9 18.2 Z" fill="#c42c10" />
            <path d="M16.7 17.2 L17.5 25 L16.7 33.5 L15 32.6 L15.4 25 L15 18.2 Z" fill="#c42c10" />

            <path
              d="M6.3 10.8 L9.8 12.4 M17.7 10.8 L14.2 12.4 M6.3 13.8 L9.6 14.2 M17.7 13.8 L14.4 14.2"
              fill="none"
              stroke="#14101a"
              strokeWidth="0.7"
              strokeLinecap="round"
            />
            <rect x="0.9" y="7" width="5.6" height="9.4" rx="2.1" fill="#14101a" />
            <rect x="17.5" y="7" width="5.6" height="9.4" rx="2.1" fill="#14101a" />
            <rect x="1.9" y="9" width="1.1" height="5.4" rx="0.55" fill="#3d3446" />
            <rect x="21" y="9" width="1.1" height="5.4" rx="0.55" fill="#3d3446" />

            <path d="M10.4 3.4 H13.6 L14.4 11 H9.6 Z" fill="#e03516" />
            <rect x="1.2" y="1.4" width="21.6" height="2.4" rx="1" fill="#b52a10" />
            <rect x="2.4" y="0.4" width="19.2" height="1.1" rx="0.55" fill="#e03516" />
            <rect x="0.3" y="0.5" width="1.6" height="5.2" rx="0.7" fill="#241418" />
            <rect x="22.1" y="0.5" width="1.6" height="5.2" rx="0.7" fill="#241418" />

            <rect x="9.3" y="14.4" width="5.4" height="8.4" rx="2.7" fill="#241418" />
            <circle cx="12" cy="19.2" r="2.1" fill="#ffe8c0" />
            <rect x="10.7" y="17.2" width="2.6" height="1" rx="0.5" fill="#241418" />
            <path d="M9.6 17 Q12 13.2 14.4 17" fill="none" stroke="#241418" strokeWidth="0.9" strokeLinecap="round" />
            <rect x="10.4" y="23.2" width="3.2" height="9.6" rx="1.4" fill="#6e1807" />
            <rect x="11.4" y="4" width="1.2" height="9.6" rx="0.5" fill="#fff3e0" />
            <rect x="11.5" y="24" width="1" height="8" rx="0.5" fill="#fff3e0" />

            <g className="space-car-lights">
              <circle cx="7.6" cy="2.6" r="0.9" fill="#fff6dc" />
              <circle cx="16.4" cy="2.6" r="0.9" fill="#fff6dc" />
            </g>
          </svg>
        </div>
      </div>
    </>
  );
}
