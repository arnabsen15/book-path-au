# Book Path AU

**Find the best legal way to get a book in Australia — Free, Borrow, Listen, or Buy.**

Hobby project for book lovers — not a shop or business. We don’t warehouse, sell, or deliver books. This app points you to legal options:

- **Free** — Project Gutenberg / Open Library / Wikisource / LibriVox when public domain
- **Borrow** — Trove + local library tips (e.g. Wyndham / YPRL) and Libby / BorrowBox guidance
- **Listen** — free PD audiobooks + library apps + Audible.au / Google Play / Spotify search
- **Buy** — outbound search links to Amazon.au, Kindle, Booktopia, Dymocks, Readings, Google Play Books, Apple Books

Each book also has a **Compare ways to get this book** table. We don’t scrape live store prices; open each store to compare. Seeded titles may show **manual indicative AUD** figures; live-only Open Library hits show **See store**.

## Live site

https://arnabsen15.github.io/book-path-au/

## Live book search

Search uses the **Open Library Search API** directly from the browser:

`https://openlibrary.org/search.json?q=…`

Open Library responds with `Access-Control-Allow-Origin: *`, so no proxy is required for static GitHub Pages hosting.

As you type (≈300 ms debounce) or submit the form, results show cover (when available), title, author, year, and ISBN. Expanding a card keeps the Free · Borrow · Listen · Buy comparison using the existing AU link builders.

### Seed catalogue

Twenty-two seeded books in `src/data/books.json` appear when the query is empty (with indicative prices). When a live hit matches a seed (ISBN / title+author), **seed data wins** — including free links and indicative prices.

### Google Books

**Not used.** Google Books API requires an API key for reliable quota; the anonymous/shared keyless endpoint is rate-limited (HTTP 429). We do **not** invent or hard-code API keys. Open Library alone powers live search.

### Free / LibriVox rules

- If Open Library exposes Gutenberg / open-access identifiers, we link them.
- Otherwise we show **Check Open Library / Gutenberg** (no fake “free” claim).
- LibriVox is linked only when LibriVox / clearly public-domain markers appear in the Open Library record.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is in `dist/` with base path `/book-path-au/` and `.nojekyll`.

## Deploy (GitHub Pages)

```bash
npm run build
npm run deploy
```

(`deploy` runs `gh-pages -d dist --dotfiles` so `.nojekyll` is published.)

## Notes

- No piracy links. No affiliate tags in this MVP.
- Australia-focused tips and retailer URLs.
- CORS: Open Library Search API works from the browser on static hosting (verified `access-control-allow-origin: *`).
