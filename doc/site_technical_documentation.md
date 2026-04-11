# saiuttej.com — Technical Documentation

Personal portfolio site for Sai Uttej Rajoju. Deployed on Vercel at [saiuttej.com](https://saiuttej.com).

---

## Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (Turbopack) | 16.2.2 |
| React | React + React DOM | 19.2.4 |
| Styling | Tailwind CSS (v4, `@theme inline`) | ^4 |
| Animation | GSAP + ScrollTrigger | ^3.12.0 |
| Language | TypeScript | ^5 |
| Linting | ESLint + eslint-config-next | ^9 / 16.2.2 |
| PostCSS | @tailwindcss/postcss | ^4 |

**No database.** All project/experience data lives in `lib/constants.ts`.

---

## Project Structure

```
app/
  globals.css            # Tailwind theme, custom properties, all component CSS
  layout.tsx             # Root layout — fonts, metadata, structured data, global overlays
  page.tsx               # Homepage — assembles all sections
  robots.ts              # SEO robots.txt
  sitemap.ts             # Dynamic sitemap with per-project priority
  opengraph-image.tsx    # Edge-rendered OG image (1200×630)
  twitter-image.tsx      # Edge-rendered Twitter card (1200×630)
  fonts/
    BebasNeue-Regular.woff2
    JetBrainsMono-Regular.woff2
    TypoGraphica.otf
  work/
    [slug]/
      page.tsx                # Dynamic project detail (SSG via generateStaticParams)
      ProjectDetailContent.tsx # Client-side detail renderer with GSAP reveals

components/
  Navigation.tsx         # Scroll-aware nav with mobile overlay
  Hero.tsx               # Clip-reveal hero with GSAP timeline
  Projects.tsx           # Project grid with links (case study, live, repo, feedback)
  About.tsx              # Approach section with education + experience timeline
  Contact.tsx            # Footer with social links + LinkedIn badge popover
  MagneticCursor.tsx     # F1 car cursor with tire trail physics
  CursorLayer.tsx        # Dynamic import wrapper (ssr: false)
  F1StartLights.tsx      # First-visit F1 starting lights intro
  ChessEasterEgg.tsx     # "nf3" keyboard trigger → mini chessboard popup
  ChessPieces.tsx        # Cursor-collision chess pieces (Lichess hover trigger)

lib/
  constants.ts           # All data: projects, experience, education, social links, metadata
  animations.ts          # GSAP easing/duration/stagger constants, clipReveal, fadeUp

doc/
  site_technical_documentation.md   # This file
  DesignBrief.md
  resume.md
```

---

## Fonts

| Font | Source | Variable | Usage |
|---|---|---|---|
| Syne | Google Fonts (400–700) | `--font-syne` / `--font-editorial` | Headings, section titles |
| Sora | Google Fonts (400–700) | `--font-sora` / `--font-body` / `--font-display` | Body text |
| Nunito | Google Fonts (900 only) | `--font-nunito` | Logo fallback |
| JetBrains Mono | Local woff2 | `--font-jetbrains-mono` / `--font-mono` | Code, labels, kickers |
| TypoGraphica | Local otf | `--font-typographica` | Logo/name display |

Logo composite: `--font-logo: var(--font-typographica), var(--font-nunito), sans-serif`

---

## Color System

All defined as CSS custom properties inside `@theme inline` in `globals.css`.

### Backgrounds
| Token | Value |
|---|---|
| `--color-bg` | `#06080d` |
| `--color-bg-elevated` | `#0a0d11` |
| `--color-surface` | `#101318` |
| `--color-surface-strong` | `#15191f` |

### Text
| Token | Value |
|---|---|
| `--color-ink` | `#f7f9fc` |
| `--color-text` | `#f1f3f5` |
| `--color-text-muted` | `#bcc3cc` |
| `--color-text-dim` | `#767f89` |

### Accent & Lines
| Token | Value |
|---|---|
| `--color-accent` | `#f2f3f5` |
| `--color-accent-secondary` | `#c9ced5` |
| `--color-accent-dim` | `rgba(242, 243, 245, 0.14)` |
| `--color-racing` | `#ff5b2b` |
| `--color-line` | `rgba(233, 239, 247, 0.1)` |
| `--color-line-strong` | `rgba(233, 239, 247, 0.18)` |

### Panels
| Token | Value |
|---|---|
| `--color-panel` | `rgba(17, 24, 33, 0.84)` |
| `--color-panel-strong` | `rgba(11, 16, 22, 0.96)` |
| `--color-panel-border` | `rgba(233, 239, 247, 0.1)` |
| `--color-panel-shadow` | `rgba(0, 0, 0, 0.42)` |

### Project Tone Colors (`data-tone` attribute)
| Project | `.tone-text` |
|---|---|
| Eatensity | `#ff7b4d` |
| figuretools | `#8fc8ea` |
| Kanso | `#d9b27e` |
| TotallyNotInsta | `#99b6dd` |

---

## Z-Index Layers

| Z-Index | Element |
|---|---|
| `99999` | F1 start lights overlay |
| `9999` | Cursor (`.cursor-f1`, `.cursor-caret`) |
| `9998` | Tire trail canvas |
| `50` | Navigation bar |
| `40` | Mobile menu overlay |
| `30` | Chess easter egg popup |
| `20` | Chess pieces layer |
| `2` | Grain overlay |
| `1` | Main content (section, article, nav, footer) |

---

## Layout (layout.tsx)

Root layout loads all five font variables on `<html>`, applies them as CSS variables. Body contains:

1. `.grain-overlay` — SVG fractal noise texture, `mix-blend-mode: screen`, 3.8% opacity
2. `{children}` — Page content
3. `<ChessEasterEgg />` — "nf3" keyboard easter egg
4. `<ChessPieces />` — Cursor-collision chess pieces
5. `<CursorLayer />` — Dynamic-imported F1 cursor (no SSR)
6. `<script type="application/ld+json">` — Schema.org structured data (Person + WebSite)

---

## Pages

### Homepage (`app/page.tsx`)

Renders sections in order:

1. **F1StartLights** — Full-screen intro (first visit only, localStorage)
2. **Navigation** — Scroll-aware sticky nav
3. **Hero** — Clip-reveal title + fade-up content
4. **Projects** — Project cards grid
5. **About** — Philosophy, education, experience
6. **Contact** — Social links, LinkedIn badge, copyright

### Project Detail (`app/work/[slug]/page.tsx`)

- **SSG** via `generateStaticParams()` — pre-renders all 4 project slugs
- `generateMetadata()` produces per-project title, description, canonical, and OpenGraph tags
- Server component wraps `<ProjectDetailContent>` (client component with GSAP animations)
- 404 via `notFound()` for unknown slugs

---

## Components

### Navigation

- GSAP `ScrollTrigger` detects active section by scroll position
- Mobile overlay with staggered link animation (0.06s stagger, power3.out)
- Escape key dismisses mobile menu
- Smooth `scrollIntoView` for anchor links
- Glass-morphism pill (`.nav-pill--glass`) with scroll-aware state

### Hero

- GSAP timeline with:
  - `clipReveal` (inset 100% → 0%) on title lines, 0.14s stagger
  - `fadeUp` (y: 30, opacity: 0 → 0) on content items, 0.08s stagger
  - 0.2s initial delay
- Respects `prefers-reduced-motion`
- Two radial gradient backgrounds (blue, orange) positioned absolutely

### Projects

- Maps `projects[]` from constants
- Each card: index number, year, category/tagline, name, summary
- Links row (conditional rendering):
  - **Read case study →** — internal `<Link>` to `/work/[slug]`
  - **Visit site ↗** — external `<a>` (if `liveUrl` exists)
  - **GitHub ↗** — external `<a>` (if `repoUrl` exists)
  - **Feedback ↗** — external `<a>` (if `feedbackUrl` exists)
- First 2 metrics displayed per card
- `data-tone` attribute drives accent color per project

### About

- Sticky 220px sidebar on desktop
- Education: degree, institution, period, GATE note
- Experience: role, company, period, description (maps `experience[]`)

### Contact

- Social links: Email (primary button), LinkedIn, GitHub, Lichess
- **LinkedIn badge popover**: lazy-loads `platform.linkedin.com/badges/js/profile.js` on first hover; badge hidden after 200ms on mouseout; popover stays if mouse enters it
- **Lichess hover**: dispatches `chess-pieces-activate` custom event

---

## Custom Cursor (MagneticCursor)

Only activates when `(pointer: fine)` is true and `prefers-reduced-motion` is not set.

### F1 Car (homepage)

- 24×40 SVG: fat rounded tires, chunky body, dark cockpit, rear wing
- Position follow: exponential smoothing (`SMOOTHING=0.22`), frame-rate independent via `1 - (1-lf)^(dt*60)`
- Rotation: tracks travel direction (`ANGLE_SMOOTHING=0.18`)
- Magnetic hover: pulls 12% toward interactive element center
- States: hovering (scale 1.08), clicking (scale 0.88), idle (float animation after 1.2s), fast (speed >9.5px/frame)
- Label: `data-cursor-label` attribute content shown in pill positioned to the right

### Tire Marks (Canvas 2D)

- Trail of left/right tire positions at rear axle (TIRE_HALF_WIDTH=7.5, rear offset=12)
- Multi-layer strokes: white (0.13 alpha), center (0.09), dark (0.24)
- Max 200 points, fading at `TRAIL_FADE=0.85` per second
- Marks emitted every `TRAIL_MARK_SPACING=4` pixels of travel
- Dead zone of 0.3px to suppress jitter

### Work Page Variant

- Blinking text caret (`▌`) instead of F1 car
- No tire marks, no rotation
- Same magnetic hover and interaction states

### Global Position

`window.__cursorPos = { x, y }` exposed every frame for external collision systems (chess pieces).

---

## F1 Start Lights

Full-screen overlay on first-ever visit.

| Constant | Value |
|---|---|
| `LIGHT_COUNT` | 5 |
| `LIGHT_ON_INTERVAL` | 600ms per light |
| `LIGHTS_OUT_DELAY` | 800ms after all on |
| `FADE_DURATION` | 600ms overlay fade |

- **Persistence**: `localStorage.getItem("f1-intro-played")` — never replays after first visit
- **Scroll lock**: `document.body.style.overflow = "hidden"` during animation
- **Render strategy**: Overlay renders from first frame (no flash) via state initializer check

---

## Easter Eggs

### Chess Keyboard ("nf3")

- Tracks last 3 keystrokes; triggers on sequence `n`, `f`, `3`
- Skips activation inside input/textarea/contentEditable
- Shows mini 8×8 chessboard with Lichess link and stats
- Auto-hides after 3.2s
- Glass-morphism card at bottom-right (z-30)

### Chess Pieces (Lichess Hover)

Activated when user hovers the Lichess link in Contact, or if `sessionStorage` flag `chess-pieces-active` is set.

- 6 chess Unicode pieces (♔ ♕ ♘ ♗ ♜ ♟) scattered randomly across document height
- Minimum 120px separation, 30 placement attempts per piece
- Collision with cursor (`HIT_RADIUS=34px`):
  - **Hit 1**: Impulse push away from cursor (`IMPULSE_STRENGTH=14`)
  - **Hit 2** (when settled, velocity < 2): Pop animation (scale 1→2, opacity 1→0, 320ms) then removed
- Physics: `FRICTION=0.95` per frame, edge bouncing at `EDGE_MARGIN=60px`
- Frame-rate independent: `Math.pow(FRICTION, dt * 60)`
- Renders via immutable state snapshots (ref for physics loop, state for React rendering)
- Custom event bridge: `window.dispatchEvent(new Event("chess-pieces-activate"))`

---

## Data Model (lib/constants.ts)

### Project Interface

```typescript
interface Project {
  slug: string;
  name: string;
  category: string;
  featured: boolean;
  tagline: string;
  summary: string;
  description: string;
  tech: string;
  url: string;
  liveUrl?: string;        // External site link (Eatensity, figuretools)
  repoUrl?: string;        // GitHub repo link (Kanso, TotallyNotInsta)
  feedbackUrl?: string;     // Feedback repo link (Eatensity, figuretools)
  accent: string;
  year: string;
  role: string;
  focus: string[];
  metrics: Metric[];        // { value, label }
  highlights: string[];
  detail: {
    paragraphs: string[];
    approach: string;
    outcome: string;
  };
}
```

### Projects

| Slug | Name | Tech | URLs |
|---|---|---|---|
| `eatensity` | Eatensity | Next.js 15 · React Native · Hono · Supabase | liveUrl, feedbackUrl |
| `figuretools` | figuretools | Eleventy 3.x · Nunjucks · Vanilla JS/CSS | liveUrl, feedbackUrl |
| `kanso` | Kanso | Java 17 · Spring Boot 3 · Thymeleaf · Docker | repoUrl |
| `totallynotinsta` | TotallyNotInsta | Laravel · PHP · MongoDB · Docker | repoUrl |

### Other Exports

- `experience[]` — 2 entries at MAQ Software (Software Engineer 1, Associate)
- `education` — B.Tech CSE, CVR College, GATE CSE 2024 top 8%
- `socialLinks` — email, linkedin, github, lichess
- `siteMetadata` — title, description, url, ogImage

---

## Animation Constants (lib/animations.ts)

| Constant | Value |
|---|---|
| `EASE_CINEMATIC` | `"power4.inOut"` |
| `EASE_OUT` | `"power3.out"` |
| `EASE_MAGNETIC` | `"power2.out"` |
| `DURATION.fast` | 0.3s |
| `DURATION.normal` | 0.8s |
| `DURATION.slow` | 1.2s |
| `DURATION.reveal` | 1.6s |
| `DURATION.scatter` | 2.0s |
| `STAGGER.char` | 0.03s |
| `STAGGER.tight` | 0.08s |
| `STAGGER.normal` | 0.15s |
| `STAGGER.loose` | 0.25s |

Presets: `clipReveal` (clip-path inset right-to-left), `fadeUp` (y:30 + opacity:0 → normal).

---

## SEO

- `generateMetadata()` in layout and project pages
- Schema.org JSON-LD: `Person` + `WebSite` graph
- Dynamic sitemap (`app/sitemap.ts`): homepage priority 1.0, featured projects 0.9, others 0.7
- Robots: allows all crawlers, points to sitemap
- OG image: edge-rendered 1200×630 with Georgia serif, beige background
- Twitter card: separate edge-rendered image with gradient background

---

## Security Headers (next.config.ts)

Applied to all routes (`/(.*)`):

| Header | Value |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

---

## Accessibility

- `prefers-reduced-motion: reduce` — all animations set to 0.01ms, cursor features disabled
- `(pointer: coarse)` — cursor layers hidden entirely (touch devices)
- Semantic HTML sections with `id` anchors for nav
- `aria-hidden="true"` on decorative elements (grain, cursor, chess pieces, lights)
- Keyboard: Escape closes mobile menu
- `::selection` styled for dark theme readability

---

## Scripts

```bash
npm run dev       # next dev --turbopack (development)
npm run build     # next build (production)
npm run start     # next start (production server)
npm run lint      # eslint
```

---

## Deployment

Hosted on **Vercel**. Production build uses Turbopack. Static pages are pre-rendered at build time; OG/Twitter images are edge-rendered on demand.