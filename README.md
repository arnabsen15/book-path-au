# Book Path AU

**Find the best legal way to get a book in Australia — Free, Borrow, Listen, or Buy.**

We don’t warehouse, sell, or deliver books. This MVP points you to legal options:

- **Free** — Project Gutenberg / Open Library / Wikisource / LibriVox when public domain
- **Borrow** — Trove + local library tips (e.g. Wyndham / YPRL) and Libby / BorrowBox guidance
- **Listen** — free PD audiobooks + library apps + Audible.au / Google Play / Spotify search
- **Buy** — outbound search links to Amazon.au, Kindle, Booktopia, Dymocks, Readings, Google Play Books, Apple Books

Each book also has a **Compare ways to get this book** table. We don’t show live prices; open each store to compare.

## Live site

https://arnabsen15.github.io/book-path-au/

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is in `dist/` with base path `/book-path-au/`.

## Deploy (GitHub Pages)

```bash
npm run build
# ensure dist/.nojekyll exists
npx gh-pages -d dist
```

Pages should serve from the `gh-pages` branch root.

## Notes

- Catalogue is a seeded JSON file (`src/data/books.json`), not live inventory.
- No piracy links. No affiliate tags in this MVP.
- Australia-focused tips and retailer URLs.
