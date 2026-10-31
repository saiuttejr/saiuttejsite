# Sai Uttej Rajoju — Personal Website (`saiuttej.com`)

Editorial personal website for **Sai Uttej Rajoju**, built around two distinct modes connected by a live palette, typography, and layout morph:

- **Work (`/`) — Warm Ivory & Cobalt**:
  - **Opening Cover**: Full-screen scroll-parting editorial cover (`Hey, I’m Sai.`) with rounded photography and direct links (`Resume PDF`, `GitHub`, `LinkedIn`, `saiuttej.r@gmail.com`).
  - **01 — What I do**: Concise human statement on engineering work at MAQ Software in Hyderabad, paired with Experience and verified Microsoft credentials (`AI-103`, `AI-200`, `AB-620`) + B.Tech CSE.
  - **02 — Selected work**: Open magazine-style index showing all four projects at once (`I. Eatensity`, `II. FigureTools`, `III. FinPulse AI`, `IV. Kanso`) with direct live and repository links.
  - **03 — Say hi**: Editorial contact close and direct switch into `After Hours`.
- **After Hours (`/space`) — Warm Paper & Persimmon**:
  - **Opening Spread**: *“Off the clock.”* with photography.
  - **Interactive Play**: Frameless Formula 1 five-red-lights reflex test and playable 4×4 mate-in-one chess puzzles.
  - **Quiet Footer**: Profile links to `Letterboxd`, `MyAnimeList`, `Goodreads`, and email.

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
- `app/space/page.tsx` — After Hours walkthrough (`/space`)
- `components/SiteExperience.tsx` — Unified editorial walkthrough, F1 start lights, and mate-in-one chess
- `components/MotionRuntime.tsx` — Scroll reveal observer, room attribute sync, and keyboard easter eggs
- `lib/site-data.ts` — Profile links, 4-project index, and verified credentials
- `public/Sai_Uttej_Rajoju_Resume.pdf` — Canonical resume PDF
- `doc/site_technical_documentation.md` — Full technical documentation
- `doc/DesignBrief.md` — Creative direction & design philosophy
- `doc/resume.md` — Markdown reference of verified experience, projects, and credentials
