# Sai Uttej Rajoju — Personal Site

Authority-first portfolio site for a software engineer and product builder. The project is built to present selected work, operating style, and contact intent with a premium editorial tone instead of a template portfolio feel.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Local font loading via `next/font/local`

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run start
```

## Structure

- `app/` — routes, layout, metadata routes, and project detail pages
- `components/` — homepage sections and reusable UI blocks
- `lib/constants.ts` — site copy, project content, metadata, and supporting structured content
- `doc/` — design brief and résumé source material

## Current Direction

The current implementation is moving toward:

- clearer authority positioning above the fold
- stronger proof on project and case-study pages
- lower interaction overhead and fewer decorative behaviors
- better metadata, social previews, robots, and sitemap coverage

## Deployment Notes

- `app/robots.ts` and `app/sitemap.ts` generate crawl assets
- `app/opengraph-image.tsx` and `app/twitter-image.tsx` generate social preview images
- `app/icon.svg` provides the site icon

Before deploying, verify production metadata, social previews, and performance on mobile hardware.
