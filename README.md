# Sai Uttej Rajoju — Personal Website (`saiuttej.com`)

Editorial personal website for **Sai Uttej Rajoju**, built around two distinct modes connected by a live palette and typography morph:

- **Work (`/`) — Warm Ivory & Cobalt**: Scroll-parting editorial cover, a concise statement on engineering work at MAQ Software and verified Microsoft credentials, a four-project open magazine spread (`Eatensity`, `FigureTools`, `FinPulse AI`, `Kanso`) with a live interactive `eatensity.com` preview stage, and direct contact links.
- **After Hours (`/space`) — Warm Paper & Persimmon**: Off-the-clock space with a frameless Formula 1 five-lights reflex test, playable mate-in-one chess puzzles, and quiet footer links to Letterboxd, MyAnimeList, and Goodreads.

## Stack

- Next.js 16 App Router
- React 19 + TypeScript 5
- Tailwind CSS 4 (`@layer base` and `@layer components`)
- Self-hosted variable fonts: **Bricolage**, **Switzer**, and **Sentient** (`public/fonts/`)
- Satori OpenGraph card generation (`lib/og.tsx` + `app/opengraph-image.tsx`)
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

## Structure

- `app/page.tsx` — Work walkthrough (`/`)
- `app/space/page.tsx` — After Hours walkthrough (`/space`)
- `components/SiteExperience.tsx` — Unified editorial walkthrough & mode switch
- `lib/site-data.ts` — Profile links, project index, and credentials
- `public/Sai_Uttej_Rajoju_Resume.pdf` — Canonical resume PDF
