import type { Book } from '../types'

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function isbnDigits(isbn?: string): string | undefined {
  if (!isbn) return undefined
  const d = isbn.replace(/[-\s]/g, '')
  return d || undefined
}

/** Prefer matching seed catalogue rows (including indicativePrices) over live-only rows. */
export function seedMatchesLive(seed: Book, live: Book): boolean {
  const sIsbn = isbnDigits(seed.isbn)
  const lIsbn = isbnDigits(live.isbn)
  if (sIsbn && lIsbn && (sIsbn === lIsbn || sIsbn.endsWith(lIsbn) || lIsbn.endsWith(sIsbn))) {
    return true
  }

  const st = norm(seed.title)
  const lt = norm(live.title)
  if (!st || !lt) return false

  const titleClose =
    st === lt ||
    st.includes(lt) ||
    lt.includes(st) ||
    (st.length > 8 && lt.length > 8 && (st.startsWith(lt.slice(0, 10)) || lt.startsWith(st.slice(0, 10))))

  if (!titleClose) return false

  const sa = norm(seed.author)
  const la = norm(live.author)
  if (!sa || !la) return titleClose

  const seedTokens = sa.split(/\s+/).filter((t) => t.length > 2)
  const liveTokens = la.split(/\s+/).filter((t) => t.length > 2)
  if (seedTokens.length === 0 || liveTokens.length === 0) return titleClose

  return seedTokens.some((t) => liveTokens.some((u) => u.includes(t) || t.includes(u)))
}

export function matchesQuery(book: Book, q: string): boolean {
  const hay = `${book.title} ${book.author} ${book.isbn ?? ''} ${(book.tags ?? []).join(' ')}`.toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => hay.includes(token))
}

/**
 * Merge seed catalogue with live Open Library hits.
 * Matching seeds win (keep free links, LibriVox, indicativePrices).
 * Cover from live is used when seed has none.
 */
export function mergeSeedAndLive(seeds: Book[], live: Book[], query: string): Book[] {
  const q = query.trim()
  const matchedSeeds = q ? seeds.filter((s) => matchesQuery(s, q)) : [...seeds]
  const usedLive = new Set<string>()
  const result: Book[] = []

  for (const seed of matchedSeeds) {
    const liveHit = live.find((l) => !usedLive.has(l.id) && seedMatchesLive(seed, l))
    if (liveHit) {
      usedLive.add(liveHit.id)
      result.push({
        ...seed,
        source: 'seed',
        coverUrl: seed.coverUrl ?? liveHit.coverUrl,
        openLibraryKey: seed.openLibraryKey ?? liveHit.openLibraryKey,
        // Prefer seed ISBN/year if present; fill gaps from live
        isbn: seed.isbn ?? liveHit.isbn,
        year: seed.year ?? liveHit.year,
      })
    } else {
      result.push({ ...seed, source: 'seed' })
    }
  }

  for (const l of live) {
    if (usedLive.has(l.id)) continue
    // Skip live rows that duplicate a seed we already included (title/author)
    if (matchedSeeds.some((s) => seedMatchesLive(s, l))) continue
    result.push(l)
  }

  return result
}
