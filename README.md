# Path AU

**Find legal ways to read or watch in Australia — Free · Borrow · Stream/Listen · Buy**

Hobby project for book & movie lovers — not a shop, not a cinema, not a streaming service. We don’t warehouse, sell, host, or deliver. This app points you to legal options with region-aware outbound search links.

> **URL change:** this project was previously **Book Path AU** at `/book-path-au/`. The live site is now **https://arnabsen15.github.io/path-au/**. Old `/book-path-au/` bookmarks may break.

## Live site

https://arnabsen15.github.io/path-au/

## Features

### Books
- Open Library live search + seeded catalogue with indicative AUD prices
- Paths: **Free · Borrow · Listen · Buy**
- Storefront searches use **title + author** (not ISBN-alone)
- Apple Books: `books.apple.com/{locale}/search`
- Readings / Dymocks: Google `site:` search fallbacks (their own search endpoints are unreliable)

### Movies
- **Local-first:** “Near Manor Lakes” landing — curated now showing (emphasis **Hanuman Ansh**) with Village Werribee + HOYTS deep links
- Cinema CTAs open real showtimes destinations (new tab); JustWatch is secondary “Also stream / rent”
- Indicative Village Werribee times labelled “check cinema”; Google “Find all sessions” fallback
- Seed catalogue + Wikipedia OpenSearch; optional `VITE_TMDB_API_KEY` for posters
- FTA / library / buy search links remain (no piracy)

### Region selector
Australia (default), United States, United Kingdom, New Zealand, India — persisted in `localStorage`. Changes Amazon / JustWatch / Apple locale bases. AU FTA links only when Australia is selected. Links ≠ live availability.

## Run locally

```bash
npm install
npm run dev
```

Optional TMDB:

```bash
echo 'VITE_TMDB_API_KEY=your_key' > .env.local
```

## Build & deploy (GitHub Pages)

```bash
npm run build
npm run deploy
```

Base path: `/path-au/`. Deploy publishes `dist/` with `.nojekyll`.

## Notes

- No piracy links. No affiliate tags in this MVP.
- Not affiliated with Netflix, Amazon, Apple, Google, or other retailers/streamers.
- CORS: Open Library and Wikipedia OpenSearch work from the browser on static hosting.
