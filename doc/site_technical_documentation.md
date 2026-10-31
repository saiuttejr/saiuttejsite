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

**Zero external animation or UI bloat:** Scroll-parting cover physics, intersection reveals, the View Transitions room switch, the F1 start-lights reflex timer, and the 4×4 mate-in-one chess board are written natively in React + CSS.

---

## 2. Project Structure

```text
app/
  globals.css            # CSS custom properties (@property), @font-face declarations, editorial layout classes
  layout.tsx             # Root HTML shell, metadata base, Person JSON-LD, skip link, MotionRuntime
  page.tsx               # Work route (/) -> renders <SiteExperience initialRoom="work" />
  space/
    page.tsx             # After Hours route (/space) -> renders <SiteExperience initialRoom="space" />
  not-found.tsx          # Custom 404 route
  error.tsx              # Client error boundary
  opengraph-image.tsx    # Node-rendered 1200×630 OpenGraph image route
  robots.ts              # robots.txt generator
  sitemap.ts             # sitemap.xml generator (/ and /space)
  icon.svg               # Vector favicon
  apple-icon.png         # Apple touch icon
  favicon.ico            # Legacy favicon

components/
  SiteExperience.tsx     # Unified two-mode editorial walkthrough (Work & After Hours), F1 & Chess widgets
  MotionRuntime.tsx      # IntersectionObserver scroll reveals, data-room sync, keyboard easter eggs, console note

lib/
  site-data.ts           # Single source of truth: SITE_PROFILE, PROJECTS (4 items), CREDENTIALS (3 items)
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
    sai-palace.jpg              # Inset photo on Work cover & After Hours hero photo (rounded corners)
    eatensity-search.jpg
    eatensity-welcome.jpg
    figuretools-sip.jpg
    figuretools-emi.jpg
    figuretools-tax.jpg
    figuretools-home.jpg

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
| **Bricolage Grotesque** | `Bricolage-Variable.woff2` (`wght 200..800`, `wdth 75..100`) | `--font-display` | Display headlines, cover title, project titles, F1 readout |
| **Sentient** | `Sentient-Variable.woff2` & `Sentient-VariableItalic.woff2` | `--font-serif` | Editorial kickers, Roman numerals, italic emphasis, After Hours headlines |
| **Switzer** | `Switzer-Variable.woff2` (`wght 100..900`) | `--font-body` | Body copy, links, metadata rows |

---

## 4. Color System & Two-Mode Morph

Typed CSS custom properties (`@property --bg`, `@property --ink`, `@property --accent`) allow the browser to interpolate colors smoothly when `document.documentElement.dataset.room` switches between `"work"` and `"space"`:

| Token | Work (`[data-room="work"]`) | After Hours (`[data-room="space"]`) | Usage |
|---|---|---|---|
| `--bg` | `#fafbfe` (Warm Ivory) | `#fdf8f4` (Warm Paper) | Page canvas background |
| `--bg-wash` | `#eff3ff` (Soft Ice) | `#fae9e0` (Soft Bisque) | Mode toggle pill bar & subtle surfaces |
| `--ink` | `#091126` (Deep Navy Ink) | `#210d07` (Deep Espresso Ink) | Primary typography |
| `--ink-muted` | `#394668` (Muted Slate) | `#63392c` (Muted Umber) | Secondary descriptions & metadata |
| `--accent` | `#1447e6` (Electric Cobalt) | `#e03516` (Warm Persimmon) | Interactive highlights, active pills, italic accents |

### Tailwind v4 Layering Rule
Because `@import "tailwindcss"` declares `@layer theme, base, components, utilities`, all custom element resets live inside `@layer base` and all custom classes live inside `@layer components` in `app/globals.css` so they never unintentionally override responsive rules.

---

## 5. Pages & Walkthrough Architecture (`components/SiteExperience.tsx`)

### Persistent Floating Masthead (`.masthead-bar`)
- Top-left: Signature button (`Sai Uttej` + accent dot) that smoothly scrolls to the top of the page. In `After Hours` mode, the signature shifts into `Sentient Italic`.
- Top-right: Mode toggle (`Work` ↔ `After Hours`). Clicking triggers `document.startViewTransition` (when supported) plus a subtle `.room-veil` wash, updates `document.documentElement.dataset.room`, and pushes `/` or `/space` to `window.history` without a hard page reload.

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
   - Large clickable email (`saiuttej.r@gmail.com`), secondary links (`Resume PDF`, `GitHub`, `LinkedIn`), and a `Flip to After Hours →` button.

### Mode 2: After Hours (`/space`)
1. **Opening Spread (`.personal-hero`)**:
   - Large `Sentient Italic` title (*"Off the clock."*) and short personal lead paired with `sai-palace.jpg` (`border-radius: 1.25rem`).
2. **Interactive Play (`.afterhours-play`)**:
   - **`I — Race Sunday` (`Five red lights.`)**: Frameless 5-light F1 start gantry. Clicking starts the 5-red-lights sequence (`640ms` per pod), holds for a randomized `900–2800ms` interval, and measures millisecond launch reaction time on lights-out (with jump-start detection).
   - **`II — Endgame Corner` (`Mate in one.`)**: Playable 4×4 chessboard (`e5..h8`) with two mate-in-one puzzles (`Qg7#` and `Re8#`), custom SVG chess pieces, accessible square labels, and `Reset` / `Switch puzzle →` actions.
3. **Quiet Footer (`.quiet-footer`)**:
   - Direct links to `Letterboxd ↗`, `MyAnimeList ↗`, `Goodreads ↗`, `saiuttej.r@gmail.com`, and `← Back to Work`.

---

## 6. Motion & Easter Eggs (`components/MotionRuntime.tsx`)

- **Scroll Reveals (`[data-reveal]`)**: Observed via `IntersectionObserver` (`threshold: 0.06`). Respects `prefers-reduced-motion: reduce` by immediately revealing all elements without animation.
- **Keyboard Easter Egg (`"lights"` or Konami code)**: Typing `lights` (or pressing the Konami sequence) anywhere outside an input automatically switches to `After Hours`, scrolls to the F1 gantry, and starts the five-red-lights sequence via the custom `sai:lights-out` window event.
- **Developer Console Greeting**: Prints a styled contact and easter-egg hint in DevTools on first mount.

---

## 7. SEO, OpenGraph & Security (`lib/metadata.ts`, `lib/og.tsx`, `next.config.ts`)

- **Metadata & JSON-LD**: `app/layout.tsx` injects a `schema.org/Person` JSON-LD block with `sameAs` links to GitHub, LinkedIn, Letterboxd (`https://letterboxd.com/contra156/`), Goodreads (`https://www.goodreads.com/user/show/195818008`), and MyAnimeList (`https://myanimelist.net/profile/Contra156`).
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
