# `saiuttej.com` — Technical Documentation

Personal website for **Sai Uttej Rajoju**, deployed at [https://saiuttej.com](https://saiuttej.com).

---

## 1. Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | `^16.2.12` |
| UI Runtime | React + React DOM | `19.2.4` |
| Styling | Tailwind CSS v4 (`@layer base`, `@layer components`, CSS `@property`) | `^4` |
| Language | TypeScript (`strict: true`) | `^5` |
| Linting | ESLint 9 + `eslint-config-next` + `eslint-plugin-jsx-a11y` (strict) | `^9` / `^6.10.2` |
| Node Runtime | Node.js (pinned via `.nvmrc` & `package.json#engines`) | `>=20.9.0` (`22` in `.nvmrc`) |

**Zero external animation or UI bloat:** Scroll-parting cover physics, intersection reveals, the View Transitions room switch, and the `/space` rooftop scene (imperative SVG driven by scroll) are written natively in React + CSS + TypeScript.

---

## 2. Project Structure

```text
app/
  globals.css            # CSS custom properties (@property), @font-face declarations, editorial & Space layout classes
  layout.tsx             # Root HTML shell, metadata base, Person JSON-LD, skip link, MotionRuntime
  page.tsx               # Work route (/) -> renders <SiteExperience initialRoom="work" />
  space/
    page.tsx             # Space route (/space) -> renders <SiteExperience initialRoom="space" />
  not-found.tsx          # Custom 404 route
  error.tsx              # Client error boundary
  opengraph-image.tsx    # Node-rendered 1200×630 OpenGraph image route
  robots.ts              # robots.txt generator
  sitemap.ts             # sitemap.xml generator (/ and /space)
  icon.svg               # Vector favicon
  apple-icon.png         # Apple touch icon
  favicon.ico            # Legacy favicon

components/
  SiteExperience.tsx     # Unified two-mode walkthrough: Work room, masthead, room switch; mounts <SpaceExperience /> for Space
  SpaceExperience.tsx    # Space room: photo hero, wall, link windows, scroll loop (palette, lamp, clock, theme-color)
  SpaceLinkWindows.tsx   # Five inline-SVG rooms for the link windows
  SpaceCursor.tsx        # F1 car cursor and tyre-mark canvas (Space only)
  MotionRuntime.tsx      # IntersectionObserver scroll reveals, data-room & theme-color sync, console note

lib/
  site-data.ts           # Single source of truth: SITE_PROFILE, PROJECTS (4 items), CREDENTIALS (3 items)
  space-data.ts          # Space content: SPACE_HERO_CARDS (4), SPACE_TILES (15), SPACE_WINDOWS (5)
  space-palette.ts       # Golden-hour-to-night palette keyframes, clock label, lamp curve
  space-scene.ts         # createSpaceScene(): the fixed SVG scene, easter eggs, scroll reactions
  metadata.ts            # pageMetadata() helper for canonical URLs, OpenGraph, and Twitter cards
  og.tsx                 # Satori ImageResponse renderer for /opengraph-image

public/
  Sai_Uttej_Rajoju_Resume.pdf   # Canonical one-page resume PDF
  fonts/
    Bricolage-Variable.woff2
    Switzer-Variable.woff2
    Sentient-Variable.woff2
    Sentient-VariableItalic.woff2
  images/
    sai-pergola.jpg             # Main portrait photo on Work cover (rounded corners)
    sai-palace.jpg              # Inset photo on Work cover (rounded corners)
    eatensity-search.jpg
    eatensity-welcome.jpg
    figuretools-sip.jpg
    figuretools-emi.jpg
    figuretools-tax.jpg
    figuretools-home.jpg
    space/
      me-*.jpg                      # Four hero photos (walk, tunnel, lanterns, seawall) referenced by SPACE_HERO_CARDS
      *.jpg                         # Wall photos referenced by SPACE_TILES in lib/space-data.ts
      covers/*.jpg                  # Cover art for the Watching and Reading tiles

assets/
  fonts/
    Switzer-Regular.ttf         # TTF font loaded by Satori in lib/og.tsx
    Switzer-Semibold.ttf
    OFL.txt

doc/
  site_technical_documentation.md
  DesignBrief.md
  resume.md
```

---

## 3. Typography

All web fonts are self-hosted in `public/fonts/` and declared inside `@layer base` in `app/globals.css`:

| Family | File | CSS Variable | Role |
|---|---|---|---|
| **Bricolage Grotesque** | `Bricolage-Variable.woff2` (`wght 200..800`, `wdth 75..100`) | `--font-display` | Display headlines, cover title, project titles, Space clock and tile titles |
| **Sentient** | `Sentient-Variable.woff2` & `Sentient-VariableItalic.woff2` | `--font-serif` | Editorial kickers, Roman numerals, italic emphasis on Work |
| **Switzer** | `Switzer-Variable.woff2` (`wght 100..900`) | `--font-body` | Body copy, links, metadata rows, Space window labels |

---

## 4. Color System & Two-Mode Morph

Typed CSS custom properties (`@property --bg`, `@property --ink`, `@property --accent`) allow the browser to interpolate colors smoothly when `document.documentElement.dataset.room` switches between `"work"` and `"space"`:

| Token | Work (`[data-room="work"]`) | Space (`[data-room="space"]`) | Usage |
|---|---|---|---|
| `--bg` | `#fafbfe` (Warm Ivory) | `#6a3d45` (Rooftop Plum) | Page canvas (hidden behind the Space scene) |
| `--bg-wash` | `#eff3ff` (Soft Ice) | `#3a2633` (Dusk Plum) | Mode toggle pill bar & surfaces |
| `--ink` | `#091126` (Deep Navy Ink) | `#fff0dc` (Warm Cream) | Primary typography |
| `--ink-muted` | `#394668` (Muted Slate) | `#e8d3c0` (Muted Sand) | Secondary descriptions & metadata |
| `--accent` | `#1447e6` (Electric Cobalt) | `#e03516` (Warm Persimmon) | Interactive highlights & active pills |

In Space the page tokens stay fixed. Scroll progress `t` (`0..1`) drives everything else from `components/SpaceExperience.tsx`: `lib/space-palette.ts` maps `t` to a palette (golden hour `#6a3d45` at the top of the sky to night `#05070f`), and the component writes `--space-pill-bg`, `--space-pill-ink`, `--space-tog` and `--space-tog-ink` on the masthead bar (the pills read them), `--space-ground` on the room wrapper, `--space-dark`, `--space-lamp-r`, `--lx` and `--ly` on the wall tiles that are near the screen, and `<meta name="theme-color">`. Window lights are not driven by a custom property: windows that light up at the same moment share one group and the frame writes a few dozen `opacity` values. Performance rule: never write an inherited custom property or an inherited SVG `fill` on a large subtree every frame, because it restyles every descendant (measured at roughly 10 µs per element in the Windows webview). The skyline colours are one-stop gradients (`space-fill-*`) whose `stop-color` is rewritten instead, and `put()` in `lib/space-scene.ts` skips attribute writes that would not change anything.

### Tailwind v4 Layering Rule
Because `@import "tailwindcss"` declares `@layer theme, base, components, utilities`, all custom element resets live inside `@layer base` and all custom classes live inside `@layer components` in `app/globals.css` so they never unintentionally override responsive rules.

---

## 5. Pages & Walkthrough Architecture (`components/SiteExperience.tsx`)

### Persistent Floating Masthead (`.masthead-bar`)
- Top-left: Signature button (`Sai Uttej` + accent dot) that smoothly scrolls to the top of the page.
- Top-right: Mode toggle (`Work` ↔ `Space`). Clicking triggers `document.startViewTransition` (when supported) plus a subtle `.room-veil` wash, updates `document.documentElement.dataset.room`, and pushes `/` or `/space` to `window.history` without a hard page reload.

### Mode 1: Work (`/`)
1. **Scroll-Parting Opening Cover (`.cover-track` / `.cover-sticky`)**:
   - Sticky `175svh` track. As the user scrolls through the first viewport, a `requestAnimationFrame` scroll listener computes `coverProgress` (`0..1`), parting the left typography wing (`Hey, I’m Sai.`) and the right photography wing (`sai-pergola.jpg` + `sai-palace.jpg` with rounded corners) outward.
   - Footer bar carries direct links to `Resume PDF ↗`, `GitHub ↗`, `LinkedIn ↗`, and `saiuttej.r@gmail.com`.
2. **`01 — What I do` (`.editorial-beat`)**:
   - Large editorial statement: *"I’m a software engineer at MAQ Software in Hyderabad — part of the development team running a live enterprise AI support agent, and building my own web products after hours."*
   - Two-column open baseline below for **Experience** (`Software Engineer I`, `Associate Software Engineer`) and **Credentials & Education** (`Microsoft AI-103`, `Microsoft AI-200`, `Microsoft AB-620`, and `B.Tech CSE · CVR College of Engineering, Hyderabad`).
3. **`02 — Selected work` (`.works-index`)**:
   - Displays all four projects simultaneously in an open typographic index (`I. Eatensity`, `II. FigureTools`, `III. FinPulse AI`, `IV. Kanso`) with Roman numerals, one-line descriptions, italic stack lines, and direct links (`eatensity.com ↗`, `figuretools.com ↗`, `SIP Calculator ↗`, `GitHub ↗`).
4. **`03 — Say hi` (`.editorial-beat`)**:
   - Large clickable email (`saiuttej.r@gmail.com`), secondary links (`Resume PDF`, `GitHub`, `LinkedIn`), and an `Enter Space →` button.

### Mode 2: Space (`/space`)
Rendered by `components/SpaceExperience.tsx`. The room is one fixed illustration with the page content floating above it (`main.space-main` has `pointer-events: none`, so clicks reach the scene).
1. **Scene (`lib/space-scene.ts`)**: `createSpaceScene()` builds SVG imperatively into two fixed layers: `.space-layer--back` (z 0, the whole scene: sky, sun and moon, skyline, terrace, vignettes) and `.space-layer--fore` (z 3, only the car, so it drives in front of the content). The chess table (left) and the painter (right) sit in the margins beside the wall, positioned from the wall's rect and rebuilt on resize. The scene reacts to scroll speed (brush, cat tail, kite) and to clicks on the chess table, painter and car.
2. **Time of day (`lib/space-palette.ts`)**: A single `requestAnimationFrame` loop, started by scroll events and stopped when nothing moves, turns scroll progress `t` into a palette, the clock label (`5:08 pm` to `9:05 pm`) and the lamp (`--space-dark`, `--space-lamp-r`). The masthead pills switch to their night colours past `NIGHT_PILL_AT`, and `<meta name="theme-color">` follows the top of the sky.
3. **Hero (`.space-hero`)**: The title (`Sai Uttej` over a large `Space`, an `h1` that fades and tightens as you scroll, in the left of the sky) and four photos of Sai (`SPACE_HERO_CARDS`) as small overlapping whole-frame cards, drifting slightly with scroll. The sky also holds five evening clouds, eleven birds that are already crossing when the page opens, and eight sky lanterns; all of them are built in `lib/space-scene.ts`, drift with `t`, and are static (no CSS animation) under reduced motion.
4. **Wall (`.space-wall`)**: A 12-column grid of rounded tiles (`SPACE_TILES`: twelve photos, a Watching tile and a Reading tile with cover art, and a Lichess tile) that becomes two columns under 900px. At night each tile is dimmed by a radial overlay except around the lamp, which follows the pointer.
5. **Links (`.space-foot`)**: `SPACE_WINDOWS` (`Letterboxd ↗`, `Lichess ↗`, `MyAnimeList ↗`, `Goodreads ↗`, `saiuttej.r@gmail.com`) are lit windows in a facade that stands on the terrace, each with a small illustration (`SpaceLinkWindows.tsx`), plus a `← Back to Work` sign.
6. **Cursor (`components/SpaceCursor.tsx`)**: A fixed `.space-car` (inline SVG, nose up, same livery as the scene car) follows the pointer with frame-rate-independent smoothing and turns toward the direction of travel (the heading holds below 90 px/s). Above 260 px/s the rear tyres draw fading marks on the `.space-trail` canvas. `html.space-cursor-on` hides the native cursor; it is added on the first mouse move and removed on window blur, tab hide, pointer leave and unmount. Hovering links, buttons and `.space-hit` areas enlarges the car with an accent glow, pressing shrinks it and lights the brake light, and `nightAt(t)` from `lib/space-palette.ts` sets `--space-car-lights` so the headlights come on at dusk. Effects only run when any pointer is fine and `forced-colors` is off; touch input is ignored. Under `prefers-reduced-motion: reduce` the car is calm (short ease, quick turning, no tyre marks); otherwise the native cursor stays.
7. **Accessibility and motion**: The scene layers and the cursor are `aria-hidden`; the real content is ordinary DOM with a visible `h1.space-title` (given an `aria-label` that describes the room), alt text on every photo, and a logical tab order (skip link, masthead, Lichess tile, link windows, back sign). Under `prefers-reduced-motion` the wiggles, card drift and entrance animations are frozen while the palette still follows scroll.
8. **Swapping content**: Replace files in `public/images/space/` (photos and `covers/`) and edit `lib/space-data.ts`. Photos are the owner's own with EXIF and GPS metadata stripped; cover art is third-party artwork.

---

## 6. Motion & Runtime (`components/MotionRuntime.tsx`)

- **Scroll Reveals (`[data-reveal]`)**: Observed via `IntersectionObserver` (`threshold: 0.06`), re-bound automatically via `MutationObserver` whenever `data-room` switches between `work` and `space`. Respects `prefers-reduced-motion: reduce` by immediately revealing all elements without animation.
- **Theme Color Sync**: Keeps `<meta name="theme-color">` synchronized with `#fafbfe` (`work`) and `#6a3d45` (`space`, then following the sky while scrolling).
- **Smooth wheel scrolling (`lib/smooth-scroll.ts`)**: Started once from `MotionRuntime`. A mouse-wheel notch eases toward its target in `requestAnimationFrame` instead of jumping 100 px, so the Space scene, which follows `window.scrollY`, moves in small steps. It also runs under `prefers-reduced-motion` (with a much shorter glide), because browsers drop their own wheel smoothing there. Trackpad deltas, modifier keys, horizontal scrolls, nested scrollers, the scrollbar, the keyboard and anchor links are left to the browser.
- **Developer Console Greeting**: Prints a styled contact line in DevTools on first mount.

---

## 7. SEO, OpenGraph & Security (`lib/metadata.ts`, `lib/og.tsx`, `next.config.ts`)

- **Metadata & JSON-LD**: `app/layout.tsx` injects a `schema.org/Person` JSON-LD block with `sameAs` links to GitHub, LinkedIn, Letterboxd (`https://letterboxd.com/contra156/`), Lichess (`https://lichess.org/@/Haccnt`), Goodreads (`https://www.goodreads.com/user/show/195818008`), and MyAnimeList (`https://myanimelist.net/profile/Contra156`).
- **OpenGraph Image (`/opengraph-image`)**: Prerendered at build time via Satori (`next/og`) in `lib/og.tsx` using `assets/fonts/Switzer-Regular.ttf`, `Switzer-Semibold.ttf`, and `public/images/sai-pergola.jpg`.
- **Security Headers (`next.config.ts`)**: Sends `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `Cross-Origin-Opener-Policy: same-origin`, and a production `Content-Security-Policy-Report-Only` header.

---

## 8. CI & Verification (`.github/workflows/ci.yml`)

Every push to `main` and every pull request runs on `ubuntu-latest` with Node 22 (`.nvmrc`):

```bash
npm ci
npm run lint        # ESLint 9 + jsx-a11y strict rules
npm run typecheck   # tsc --noEmit
npm run build       # next build (static prerender of /, /space, /opengraph-image, /sitemap.xml, /robots.txt)
```
