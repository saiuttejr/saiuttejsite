"use client";

/* The photos are pre-sized static files, and the rest of the site uses plain <img> too. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, type CSSProperties } from "react";
import { syncThemeColor } from "@/components/MotionRuntime";
import { SpaceCursor } from "@/components/SpaceCursor";
import { SpaceWindowArt } from "@/components/SpaceLinkWindows";
import {
  SPACE_HERO_CARDS,
  SPACE_TILES,
  SPACE_WINDOWS,
  type SpaceTile,
} from "@/lib/space-data";
import { createSpaceScene } from "@/lib/space-scene";
import {
  NIGHT_PILL_AT,
  clamp,
  clockLabel,
  lampAt,
  lerp,
  paletteAt,
  rgb,
  rgba,
  toHex,
  type Palette,
} from "@/lib/space-palette";

/* Set on the masthead bar only: a custom property on the page wrapper restyles every element in the page. */
const BAR_VARS = ["--space-pill-bg", "--space-pill-ink", "--space-tog", "--space-tog-ink"] as const;

function tilePlacement(tile: SpaceTile): CSSProperties {
  return { "--c": tile.col, "--r": tile.row } as CSSProperties;
}

function TileView({ tile }: { tile: SpaceTile }) {
  if (tile.kind === "photo") {
    return (
      <figure
        className={`space-tile space-tile--${tile.shape}`}
        style={tilePlacement(tile)}
        data-lamp=""
      >
        <img
          src={tile.photo.src}
          width={tile.photo.width}
          height={tile.photo.height}
          alt={tile.photo.alt}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: tile.position }}
        />
      </figure>
    );
  }

  if (tile.kind === "covers") {
    return (
      <div className="space-tile space-tile--info" style={tilePlacement(tile)} data-lamp="">
        <h2 className="space-tile-title">{tile.title}</h2>
        <div className="space-covers">
          {tile.covers.map((cover) => (
            <img
              key={cover.src}
              src={cover.src}
              width={cover.width}
              height={cover.height}
              alt={cover.alt}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <a
      className="space-tile space-tile--info space-tile--chess"
      style={tilePlacement(tile)}
      href={tile.href}
      target="_blank"
      rel="noopener noreferrer"
      data-lamp=""
    >
      <span className="space-chess-piece" aria-hidden="true">
        &#9822;
      </span>
      <span className="space-chess-text">
        <span className="space-tile-title">Lichess</span>
        <span className="space-chess-handle">{tile.handle}</span>
      </span>
    </a>
  );
}

/** A wall tile and the lamp values last written to it, so a frame only touches what changed. */
interface LampSpot {
  el: HTMLElement;
  /** Viewport x and page y of the tile; it moves only with the scroll. */
  left: number;
  top: number;
  height: number;
  lx: string;
  ly: string;
  dark: string;
  radius: string;
}

/** Tiles this far outside the screen still follow the lamp, so none shows a stale light as it scrolls in. */
const LAMP_MARGIN = 320;

export function SpaceExperience({ onBackToWork }: { onBackToWork: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<SVGSVGElement>(null);
  const foreRef = useRef<SVGSVGElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const back = backRef.current;
    const fore = foreRef.current;
    const wall = wallRef.current;
    const clock = clockRef.current;
    if (!root || !back || !fore || !wall || !clock) return;

    const html = document.documentElement;
    const host = root.closest<HTMLElement>("[data-room]") ?? html;
    const bar = document.querySelector<HTMLElement>(".masthead-bar") ?? host;
    const clockEl: HTMLElement = clock;
    const hero = heroRef.current;
    const tiles = Array.from(wall.querySelectorAll<HTMLElement>("[data-lamp]"));
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let reduced = motion.matches;
    let shownT = 0;
    let lastNow = 0;
    let lastY = window.scrollY;
    let dark = 0;
    let lampDark = "0";
    let lampRadius = "2600px";
    let spots: LampSpot[] = [];
    let energy = 0;
    let velocity = 0;
    let raf = 0;
    let lampRaf = 0;
    let resizeTimer = 0;
    let lampX = window.innerWidth / 2;
    let lampY = window.innerHeight * 0.45;
    let lastClock = "";
    let lastTheme = "";
    let themeMeta: HTMLMetaElement | null = null;

    const scene = createSpaceScene({
      back,
      fore,
      wall,
      reducedMotion: reduced,
      requestFrame: kick,
      onLayout: (groundPx) => host.style.setProperty("--space-ground", `${groundPx.toFixed(1)}px`),
    });

    /* measured once per layout: a tile's place on the page only changes with a resize */
    function measureTiles() {
      const sy = window.scrollY;
      spots = tiles.map((el) => {
        const r = el.getBoundingClientRect();
        return { el, left: r.left, top: r.top + sy, height: r.height, lx: "", ly: "", dark: "", radius: "" };
      });
    }

    function setLampVar(spot: LampSpot, key: "lx" | "ly" | "dark" | "radius", name: string, value: string) {
      if (spot[key] === value) return;
      spot[key] = value;
      spot.el.style.setProperty(name, value);
    }

    /* takes the scroll position as an argument: reading it after the frame's writes would force a layout */
    function placeLamp(scrollY: number, viewH: number) {
      lampRaf = 0;
      for (const spot of spots) {
        if (dark < 0.004) {
          setLampVar(spot, "dark", "--space-dark", "0");
          continue;
        }
        const top = spot.top - scrollY;
        if (top > viewH + LAMP_MARGIN || top + spot.height < -LAMP_MARGIN) continue;
        setLampVar(spot, "dark", "--space-dark", lampDark);
        setLampVar(spot, "radius", "--space-lamp-r", lampRadius);
        setLampVar(spot, "lx", "--lx", `${(lampX - spot.left).toFixed(0)}px`);
        setLampVar(spot, "ly", "--ly", `${(lampY - top).toFixed(0)}px`);
      }
    }

    function applyChrome(t: number, palette: Palette) {
      const night = t > NIGHT_PILL_AT;
      bar.style.setProperty("--space-pill-bg", rgba(palette.pillBg));
      bar.style.setProperty("--space-pill-ink", rgb(palette.pillInk));
      bar.style.setProperty("--space-tog", night ? "#6ba3ff" : "#e03516");
      bar.style.setProperty("--space-tog-ink", night ? "#090c14" : "#ffffff");
      const lamp = lampAt(t);
      dark = lamp.dark;
      /* coarse steps: the wall is only restyled when the light visibly changes */
      lampDark = lamp.dark.toFixed(2);
      lampRadius = `${Math.round(lamp.radius / 8) * 8}px`;
      const label = clockLabel(t);
      if (label !== lastClock) {
        clockEl.textContent = label;
        lastClock = label;
      }
      const top = toHex(palette.top);
      if (top !== lastTheme) {
        html.style.backgroundColor = top;
        themeMeta ??= document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
        if (themeMeta) themeMeta.content = top;
        lastTheme = top;
      }
    }

    /* the scene follows an eased copy of the scroll, so a jump in the page becomes a glide */
    function tick(now: number) {
      raf = 0;
      const dt = clamp((now - lastNow) / 1000, 0.001, 0.05);
      lastNow = now;
      const viewH = window.innerHeight;
      const scrollNow = window.scrollY;
      const max = Math.max(0, html.scrollHeight - viewH);
      const goal = max > 0 ? clamp(scrollNow / max) : 0;
      shownT =
        Math.abs(goal - shownT) < 0.00008
          ? goal
          : shownT + (goal - shownT) * (1 - Math.exp(-dt / (reduced ? 0.05 : 0.11)));
      const t = shownT;
      const y = t * max;
      const delta = y - lastY;
      lastY = y;
      velocity = lerp(velocity, delta, 0.3);
      energy = reduced ? 0 : lerp(energy, clamp(Math.abs(delta) / 28), 0.22);
      const palette = paletteAt(t);
      scene.update({ t, scrollY: y, energy, velocity: reduced ? 0 : velocity, palette });
      applyChrome(t, palette);
      placeLamp(scrollNow, viewH);
      if (hero && !reduced && y < 1400) hero.style.setProperty("--hs", y.toFixed(1));
      if (shownT !== goal || energy > 0.015 || Math.abs(velocity) > 0.2 || scene.animating) {
        raf = window.requestAnimationFrame(tick);
      }
    }

    function kick() {
      if (!raf) raf = window.requestAnimationFrame(tick);
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      lampX = event.clientX;
      lampY = event.clientY;
      if (!lampRaf) lampRaf = window.requestAnimationFrame(() => placeLamp(window.scrollY, window.innerHeight));
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        scene.rebuild();
        kick();
      }, 140);
    };

    const onMotionChange = () => {
      reduced = motion.matches;
      scene.setReducedMotion(reduced);
      kick();
    };

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);
    motion.addEventListener("change", onMotionChange);
    const layoutWatch = new ResizeObserver(() => {
      measureTiles();
      kick();
    });
    layoutWatch.observe(wall);
    layoutWatch.observe(root);
    measureTiles();
    const startMax = Math.max(0, html.scrollHeight - window.innerHeight);
    shownT = startMax > 0 ? clamp(window.scrollY / startMax) : 0;
    lastY = shownT * startMax;
    lastNow = performance.now();
    tick(lastNow);

    return () => {
      window.cancelAnimationFrame(raf);
      window.cancelAnimationFrame(lampRaf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      motion.removeEventListener("change", onMotionChange);
      layoutWatch.disconnect();
      scene.destroy();
      for (const name of BAR_VARS) bar.style.removeProperty(name);
      host.style.removeProperty("--space-ground");
      html.style.removeProperty("background-color");
      syncThemeColor(html.dataset.room);
    };
  }, []);

  return (
    <div ref={rootRef} className="space-room">
      <svg
        ref={backRef}
        className="space-layer space-layer--back"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
        focusable="false"
      />

      <main id="main" tabIndex={-1} className="space-main">
        <section ref={heroRef} className="space-hero" aria-labelledby="space-title">
          <h1 id="space-title" className="space-title" aria-label="Sai Uttej, Space: photos, films, books and chess">
            <span className="space-title-name" aria-hidden="true">
              Sai Uttej
            </span>
            <span className="space-title-word" aria-hidden="true">
              Space
            </span>
          </h1>

          <div className="space-cards">
            {SPACE_HERO_CARDS.map((card) => (
              <figure key={card.id} className={`space-card space-card--${card.id}`}>
                <img
                  src={card.src}
                  width={card.width}
                  height={card.height}
                  alt={card.alt}
                  decoding="async"
                />
              </figure>
            ))}
          </div>
        </section>

        <section className="space-wallblock" aria-label="Photos, films, books and chess">
          <div ref={wallRef} className="space-wall">
            {SPACE_TILES.map((tile) => (
              <TileView key={tile.id} tile={tile} />
            ))}
          </div>
        </section>

        <footer className="space-foot">
          <div className="space-facade">
            <ul className="space-windows">
              {SPACE_WINDOWS.map((win) => (
                <li key={win.id}>
                  <a
                    className="space-window"
                    href={win.href}
                    {...(win.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <SpaceWindowArt id={win.id} />
                    <span>
                      {win.label}
                      {win.external && <span aria-hidden="true"> ↗</span>}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <button type="button" className="space-sign" onClick={onBackToWork}>
              ← Back to Work
            </button>
          </div>
        </footer>
      </main>

      <svg
        ref={foreRef}
        className="space-layer space-layer--fore"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
        focusable="false"
      />

      <SpaceCursor />

      <div ref={clockRef} className="space-clock" aria-hidden="true">
        5:08 pm
      </div>
    </div>
  );
}
