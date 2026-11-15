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

const HOST_VARS = [
  "--space-pill-bg",
  "--space-pill-ink",
  "--space-tog",
  "--space-tog-ink",
  "--space-ground",
] as const;

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

export function SpaceExperience({ onBackToWork }: { onBackToWork: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<SVGSVGElement>(null);
  const foreRef = useRef<SVGSVGElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
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
    const clockEl: HTMLElement = clock;
    const wallEl: HTMLElement = wall;
    const cards = cardsRef.current;
    const tiles = Array.from(wall.querySelectorAll<HTMLElement>("[data-lamp]"));
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let reduced = motion.matches;
    let lastY = window.scrollY;
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

    function placeLamp() {
      lampRaf = 0;
      const rects = tiles.map((tile) => tile.getBoundingClientRect());
      tiles.forEach((tile, i) => {
        tile.style.setProperty("--lx", `${(lampX - rects[i].left).toFixed(0)}px`);
        tile.style.setProperty("--ly", `${(lampY - rects[i].top).toFixed(0)}px`);
      });
    }

    function applyChrome(t: number, palette: Palette) {
      const night = t > NIGHT_PILL_AT;
      host.style.setProperty("--space-pill-bg", rgba(palette.pillBg));
      host.style.setProperty("--space-pill-ink", rgb(palette.pillInk));
      host.style.setProperty("--space-tog", night ? "#6ba3ff" : "#e03516");
      host.style.setProperty("--space-tog-ink", night ? "#090c14" : "#ffffff");
      const lamp = lampAt(t);
      wallEl.style.setProperty("--space-dark", lamp.dark.toFixed(3));
      wallEl.style.setProperty("--space-lamp-r", `${Math.round(lamp.radius)}px`);
      const label = clockLabel(t);
      if (label !== lastClock) {
        clockEl.textContent = label;
        lastClock = label;
      }
      const top = toHex(palette.top);
      html.style.backgroundColor = top;
      if (top !== lastTheme) {
        themeMeta ??= document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
        if (themeMeta) themeMeta.content = top;
        lastTheme = top;
      }
    }

    function tick() {
      raf = 0;
      const y = window.scrollY;
      const max = html.scrollHeight - window.innerHeight;
      const t = max > 0 ? clamp(y / max) : 0;
      const delta = y - lastY;
      lastY = y;
      velocity = lerp(velocity, delta, 0.3);
      energy = reduced ? 0 : lerp(energy, clamp(Math.abs(delta) / 28), 0.22);
      const palette = paletteAt(t);
      scene.update({ t, scrollY: y, energy, velocity: reduced ? 0 : velocity, palette });
      applyChrome(t, palette);
      placeLamp();
      if (cards && !reduced && y < 1400) cards.style.setProperty("--hs", y.toFixed(1));
      if (energy > 0.015 || Math.abs(velocity) > 0.2 || scene.animating) {
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
      if (!lampRaf) lampRaf = window.requestAnimationFrame(placeLamp);
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
    tick();

    return () => {
      window.cancelAnimationFrame(raf);
      window.cancelAnimationFrame(lampRaf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      motion.removeEventListener("change", onMotionChange);
      scene.destroy();
      for (const name of HOST_VARS) host.style.removeProperty(name);
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
        <h1 className="sr-only">Space: photos, films, books and chess</h1>

        <section className="space-hero" aria-label="Photos of Sai">
          <div ref={cardsRef} className="space-cards">
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
