# Sai Uttej Rajoju — Personal Website (`saiuttej.com`)

Editorial personal website for **Sai Uttej Rajoju**, built around two distinct modes connected by a live palette, typography, and layout morph:

- **Work (`/`) — Warm Ivory & Cobalt**:
  - **Opening Cover**: Full-screen scroll-parting editorial cover (`Hey, I’m Sai.`) with rounded photography and direct links (`Resume PDF`, `GitHub`, `LinkedIn`, `saiuttej.r@gmail.com`).
  - **01 — What I do**: Concise human statement on engineering work at MAQ Software in Hyderabad, paired with Experience and verified Microsoft credentials (`AI-103`, `AI-200`, `AB-620`) + B.Tech CSE.
  - **02 — Selected work**: Open magazine-style index showing all four projects at once (`I. Eatensity`, `II. FigureTools`, `III. FinPulse AI`, `IV. Kanso`) with direct live and repository links.
  - **03 — Say hi**: Editorial contact close and direct switch into `Space`.
- **Space (`/space`) — One rooftop, golden hour to night**:
  - **Scroll-driven scene**: A fixed SVG skyline and rooftop terrace sits behind the page. Scrolling moves the evening from golden hour to night: the sky, the light, the lit windows, a small clock and the masthead pills all follow.
  - **Photos**: Four photos of Sai overlap as small cards in the hero, then a wall of rounded tiles (photos, a Watching tile and a Reading tile with cover art, and a Lichess tile). The wall dims at night except around a lamp that follows the pointer.
  - **Quiet details**: A chess table, a painter and a car react to clicks and scrolling. The cursor is a small F1 car that turns toward where it is going, leaves tyre marks, and switches its headlights on as it gets dark (mouse users only). There is no hero copy.
  - **Links**: `Letterboxd`, `Lichess`, `MyAnimeList`, `Goodreads` and email are lit windows in a building on the terrace, with `← Back to Work` above the roof.

## Stack

- Next.js 16.2.12 (App Router, Turbopack)
- React 19.2.4 + TypeScript 5
- Tailwind CSS 4 (`@layer base` and `@layer components`)
- Self-hosted variable fonts: **Bricolage**, **Switzer**, and **Sentient** (`public/fonts/`)
- Satori OpenGraph card generation (`lib/og.tsx` + `app/opengraph-image.tsx`)
- Strict accessibility linting (`eslint-plugin-jsx-a11y`)
- Node 22 (`.nvmrc`)

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
npm run start
```

## Documentation & Structure

- `app/page.tsx` — Work walkthrough (`/`)
- `app/space/page.tsx` — Space room (`/space`)
- `components/SiteExperience.tsx` — Unified editorial walkthrough, masthead, and the Work/Space room switch
- `components/SpaceExperience.tsx` — Space room: photo hero, wall, link windows, and the scroll loop
- `components/SpaceLinkWindows.tsx` — The five illustrated link windows
- `components/SpaceCursor.tsx` — The F1 car cursor and its tyre marks
- `lib/space-data.ts` — Hero photos, wall tiles, and window links
- `lib/space-palette.ts` — Golden-hour-to-night palette, clock, and lamp curves
- `lib/space-scene.ts` — The SVG scene: sky, skyline, terrace, vignettes, and easter eggs
- `components/MotionRuntime.tsx` — Scroll reveal observer, room attribute & theme-color sync
- `lib/site-data.ts` — Profile links, 4-project index, and verified credentials
- `public/Sai_Uttej_Rajoju_Resume.pdf` — Canonical resume PDF
- `doc/site_technical_documentation.md` — Full technical documentation
- `doc/DesignBrief.md` — Creative direction & design philosophy
- `doc/resume.md` — Markdown reference of verified experience, projects, and credentials
