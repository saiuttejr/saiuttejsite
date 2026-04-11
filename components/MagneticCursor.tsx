"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TrailPoint {
  lx: number; ly: number;   // left tire
  rx: number; ry: number;   // right tire
  age: number;              // 0 → 1 (normalised lifetime)
}

declare global {
  interface Window {
    __cursorPos?: { x: number; y: number };
  }
}

/* ------------------------------------------------------------------ */
/*  Detect interactive-element kind                                    */
/* ------------------------------------------------------------------ */

function detectCursorType(el: HTMLElement): string {
  const explicit = el.getAttribute("data-cursor-type");
  if (explicit) return explicit;
  if (el.matches("button, [role='button'], .button-primary, .button-secondary")) return "button";
  if (el.matches("a, [role='link']")) return "link";
  return "";
}

/* ------------------------------------------------------------------ */
/*  F1 car SVG                                                        */
/* ------------------------------------------------------------------ */

function F1CarSVG() {
  return (
    <svg
      width="24"
      height="40"
      viewBox="0 0 24 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-f1-svg"
      aria-hidden="true"
    >
      {/* FRONT TIRES — fat rounded blocks */}
      <rect x="0" y="3" width="5" height="8" rx="2.2" fill="#fff" />
      <rect x="19" y="3" width="5" height="8" rx="2.2" fill="#fff" />

      {/* FRONT WING — simple bar connecting tires */}
      <rect x="4" y="1" width="16" height="2.5" rx="1.2" fill="#ccc" />

      {/* BODY — one thick chunky shape */}
      <path
        d="M10 2 L14 2 L15.5 5 L17 9 L17.5 14 L17.5 20 L17 25 L18 29 L18 33 L16 36 L12 37.5 L8 36 L6 33 L6 29 L7 25 L6.5 20 L6.5 14 L7 9 L8.5 5 Z"
        fill="#e0e0e0"
      />

      {/* COCKPIT — big dark circle, dead center */}
      <circle cx="12" cy="15" r="3" fill="#222" />

      {/* NOSE stripe — white highlight */}
      <rect x="11" y="2" width="2" height="8" rx="1" fill="#fff" opacity="0.7" />

      {/* REAR TIRES — even fatter */}
      <rect x="0" y="28" width="6" height="9" rx="2.5" fill="#fff" />
      <rect x="18" y="28" width="6" height="9" rx="2.5" fill="#fff" />

      {/* REAR WING — chunky bar */}
      <rect x="3" y="36" width="18" height="3" rx="1.4" fill="#ccc" />
    </svg>
  );
}

export default function MagneticCursor() {
  const pathname = usePathname();
  const isWorkPage = pathname.startsWith("/work/");
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverTargetRef = useRef<HTMLElement | null>(null);
  const movedRef = useRef(false);
  const hoveringRef = useRef(false);
  const clickingRef = useRef(false);
  const idleRef = useRef(false);
  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const previousRef = useRef({ x: 0, y: 0 });
  const angleRef = useRef(-90);
  const lastMoveRef = useRef(0);
  const trailRef = useRef<TrailPoint[]>([]);
  const trailTravelRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!finePointer || reducedMotion) return;

    const cursor = cursorRef.current;
    const label = labelRef.current;
    if (!cursor) return;

    document.body.classList.add("cursor-enhanced");

    /* ----- Canvas setup (F1 trail) ----- */
    let ctx: CanvasRenderingContext2D | null = null;
    let resizeHandler: (() => void) | null = null;
    const canvas = canvasRef.current;
    if (canvas) {
      ctx = canvas.getContext("2d");
      resizeHandler = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resizeHandler();
      window.addEventListener("resize", resizeHandler);
    }

    /* ----- Tuning ----- */
    const SMOOTHING = 0.22;           // position follow — high = responsive, nearly 1:1
    const SMOOTHING_HOVER = 0.28;     // snappier on interactive elements
    const ANGLE_SMOOTHING = 0.18;     // rotation follows travel direction quickly
    const IDLE_MS = 1200;
    const TIRE_SPEED_MIN = 0.8;
    const MAX_TRAIL = 200;
    const TRAIL_FADE = 0.85;
    const TIRE_HALF_WIDTH = 7.5;
    const TRAIL_MARK_SPACING = 4;
    const DEAD_ZONE = 0.3;           // ignore sub-pixel jitter

    /* ----- Helpers ----- */

    const hideCursor = () => {
      movedRef.current = false;
      hoverTargetRef.current = null;
      hoveringRef.current = false;
      clickingRef.current = false;
      idleRef.current = false;
      cursor.classList.remove(
        "cursor-hover",
        "cursor-clicking",
        "cursor-idle",
        "cursor-fast"
      );
      cursor.style.opacity = "0";
      cursor.removeAttribute("data-cursor-type");
      if (label) {
        label.style.opacity = "0";
        label.textContent = "";
      }
      trailTravelRef.current = 0;
      trailRef.current.length = 0;
    };

    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      lastMoveRef.current = performance.now();

      if (idleRef.current) {
        idleRef.current = false;
        cursor.classList.remove("cursor-idle");
      }

      if (!movedRef.current) {
        movedRef.current = true;
        positionRef.current = { x: e.clientX, y: e.clientY };
        previousRef.current = { x: e.clientX, y: e.clientY };
        cursor.style.opacity = "1";
      }
    };

    const onMouseDown = () => {
      clickingRef.current = true;
      cursor.classList.add("cursor-clicking");
    };

    const onMouseUp = () => {
      clickingRef.current = false;
      cursor.classList.remove("cursor-clicking");
    };

    const onPointerOver = (event: MouseEvent) => {
      const nextTarget = (event.target as HTMLElement | null)?.closest(
        "[data-cursor-hover]"
      ) as HTMLElement | null;

      if (!nextTarget || nextTarget === hoverTargetRef.current) return;

      hoverTargetRef.current = nextTarget;
      hoveringRef.current = true;
      cursor.classList.add("cursor-hover");

      const type = detectCursorType(nextTarget);
      if (type) cursor.setAttribute("data-cursor-type", type);

      if (label) {
        const nextLabel = nextTarget.getAttribute("data-cursor-label") ?? "";
        label.textContent = nextLabel;
        label.style.opacity = nextLabel ? "1" : "0";
      }
    };

    const onPointerOut = (event: MouseEvent) => {
      const currentTarget = hoverTargetRef.current;
      if (!currentTarget) return;

      const relatedTarget = event.relatedTarget as HTMLElement | null;
      if (relatedTarget && currentTarget.contains(relatedTarget)) return;

      if ((event.target as HTMLElement | null)?.closest("[data-cursor-hover]") !== currentTarget) {
        return;
      }

      hoverTargetRef.current = null;
      hoveringRef.current = false;
      cursor.classList.remove("cursor-hover");
      cursor.removeAttribute("data-cursor-type");

      if (label) {
        label.style.opacity = "0";
        label.textContent = "";
      }
    };

    /* ----- Tire marks trail ----- */

    const emitTireMark = (cx: number, cy: number) => {
      const rad = (angleRef.current * Math.PI) / 180;
      const px = -Math.sin(rad) * TIRE_HALF_WIDTH;
      const py =  Math.cos(rad) * TIRE_HALF_WIDTH;
      // rear axle offset for 24x40 icon
      const bx = -Math.cos(rad) * 12;
      const by = -Math.sin(rad) * 12;

      trailRef.current.push({
        lx: cx + bx - px, ly: cy + by - py,
        rx: cx + bx + px, ry: cy + by + py,
        age: 0,
      });
      if (trailRef.current.length > MAX_TRAIL) trailRef.current.shift();
    };

    const drawTrail = (dt: number) => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const trail = trailRef.current;
      for (const p of trail) p.age += dt * TRAIL_FADE;
      while (trail.length > 0 && trail[0].age >= 1) trail.shift();
      if (trail.length < 2) return;

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 1; i < trail.length; i++) {
        const p0 = trail[i - 1];
        const p1 = trail[i];
        const freshness = 1 - Math.max(p0.age, p1.age);
        if (freshness <= 0) continue;

        const alpha = freshness * freshness;
        const w = 2.6 + freshness * 1.4;

        // Light rubber mark (white tires on dark bg)
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.13})`;
        ctx.lineWidth = w + 1.5;
        ctx.beginPath();
        ctx.moveTo(p0.lx, p0.ly); ctx.lineTo(p1.lx, p1.ly); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p0.rx, p0.ry); ctx.lineTo(p1.rx, p1.ry); ctx.stroke();

        // Sharper center
        ctx.strokeStyle = `rgba(200, 200, 210, ${alpha * 0.09})`;
        ctx.lineWidth = w * 0.5;
        ctx.beginPath();
        ctx.moveTo(p0.lx, p0.ly); ctx.lineTo(p1.lx, p1.ly); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p0.rx, p0.ry); ctx.lineTo(p1.rx, p1.ry); ctx.stroke();

        ctx.strokeStyle = `rgba(5, 5, 7, ${alpha * 0.24})`;
        ctx.lineWidth = w * 0.56;
        ctx.beginPath();
        ctx.moveTo(p0.lx, p0.ly); ctx.lineTo(p1.lx, p1.ly); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p0.rx, p0.ry); ctx.lineTo(p1.rx, p1.ry); ctx.stroke();
      }
    };

    /* ----- Animation loop ----- */

    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (movedRef.current) {
        const hovering = hoveringRef.current;

        let tx = targetRef.current.x;
        let ty = targetRef.current.y;
        if (hovering && hoverTargetRef.current) {
          const r = hoverTargetRef.current.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          tx += (cx - tx) * 0.12;
          ty += (cy - ty) * 0.12;
        }

        const offsetX = tx - positionRef.current.x;
        const offsetY = ty - positionRef.current.y;
        const distance = Math.hypot(offsetX, offsetY);

        /* --- Smooth exponential follow (never overshoots) --- */
        const lf = hovering ? SMOOTHING_HOVER : SMOOTHING;
        // Frame-rate independent smoothing: 1 - (1 - lf)^(dt * 60)
        const smooth = 1 - Math.pow(1 - lf, dt * 60);

        if (distance > DEAD_ZONE) {
          positionRef.current.x += offsetX * smooth;
          positionRef.current.y += offsetY * smooth;
        } else {
          // Snap when very close to avoid jitter
          positionRef.current.x = tx;
          positionRef.current.y = ty;
        }

        const deltaX = positionRef.current.x - previousRef.current.x;
        const deltaY = positionRef.current.y - previousRef.current.y;
        const frameDistance = Math.hypot(deltaX, deltaY);

        /* --- Rotation from actual travel direction --- */
        if (!isWorkPage && frameDistance > 0.3) {
          const travelAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
          let diff = travelAngle - angleRef.current;
          if (diff > 180) diff -= 360;
          if (diff < -180) diff += 360;

          // Quick rotation — blends toward travel direction immediately
          const blend = 1 - Math.pow(1 - ANGLE_SMOOTHING, dt * 60);
          angleRef.current += diff * blend;
        }

        previousRef.current = { ...positionRef.current };

        // Expose cursor position for external collision systems
        window.__cursorPos = { x: positionRef.current.x, y: positionRef.current.y };

        /* Composite scale */
        const click = clickingRef.current ? 0.88 : 1;
        const hover = hovering ? 1.08 : 1;
        const sc = click * hover;

        const transform = isWorkPage
          ? `translate3d(${positionRef.current.x}px,${positionRef.current.y}px,0) scale(${sc})`
          : `translate3d(${positionRef.current.x}px,${positionRef.current.y}px,0) rotate(${angleRef.current + 90}deg) scale(${sc})`;

        cursor.style.transform = transform;

        if (!isWorkPage) {
          trailTravelRef.current += frameDistance;
          if (frameDistance > TIRE_SPEED_MIN && trailTravelRef.current >= TRAIL_MARK_SPACING) {
            emitTireMark(positionRef.current.x, positionRef.current.y);
            trailTravelRef.current %= TRAIL_MARK_SPACING;
          }
        }

        /* Idle detection */
        if (
          now - lastMoveRef.current > IDLE_MS &&
          !idleRef.current &&
          !hovering
        ) {
          idleRef.current = true;
          cursor.classList.add("cursor-idle");
        }

        /* Speed class */
        cursor.classList.toggle("cursor-fast", frameDistance > 9.5);
      }

      /* Tire marks update + draw */
      if (!isWorkPage && ctx) {
        drawTrail(dt);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseleave", hideCursor);
    window.addEventListener("blur", hideCursor);
    document.addEventListener("mouseover", onPointerOver);
    document.addEventListener("mouseout", onPointerOut);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseleave", hideCursor);
      window.removeEventListener("blur", hideCursor);
      document.removeEventListener("mouseover", onPointerOver);
      document.removeEventListener("mouseout", onPointerOut);
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      document.body.classList.remove("cursor-enhanced");
    };
  }, [isWorkPage]);

  return (
    <>
      {!isWorkPage && (
        <canvas
          ref={canvasRef}
          className="cursor-trail-canvas"
          aria-hidden="true"
        />
      )}
      <div ref={cursorRef} className={isWorkPage ? "cursor-caret" : "cursor-f1"}>
        {isWorkPage ? (
          <span className="cursor-caret-block">▌</span>
        ) : (
          <F1CarSVG />
        )}
        <span ref={labelRef} className="cursor-label" />
      </div>
    </>
  );
}