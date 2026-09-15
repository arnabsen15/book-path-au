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

function queryTokens(q: string): string[] {
  return norm(q).split(/\s+/).filter(Boolean)
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
 * Relevance score for client-side ranking of merged seed + Open Library hits.
 * Higher = better. Boosts exact/near-exact titles, all-tokens-in-title, seeds,
 * and Heartfulness-related rows when the query mentions heartfulness / daaji.
 */
export function relevanceScore(book: Book, query: string): number {
  const tokens = queryTokens(query)
  if (tokens.length === 0) return 0

  const title = norm(book.title)
  const author = norm(book.author)
  const tags = norm((book.tags ?? []).join(' '))
  const hay = `${title} ${author} ${tags}`
  const qJoined = tokens.join(' ')

  let score = 0

  // Exact / near-exact title
  if (title === qJoined) score += 1000
  else if (title.startsWith(qJoined) || qJoined.startsWith(title)) score += 800
  else if (title.includes(qJoined)) score += 600

  // All query tokens appear in the title (strong signal vs weak OL "Hungry Heart")
  const allInTitle = tokens.every((t) => title.includes(t))
  if (allInTitle) score += 400

  // Fraction of tokens in title
  const titleHits = tokens.filter((t) => title.includes(t)).length
  score += titleHits * 80

  // Author / tag hits
  const authorHits = tokens.filter((t) => author.includes(t)).length
  score += authorHits * 40
  const tagHits = tokens.filter((t) => tags.includes(t)).length
  score += tagHits * 50

  // Prefer catalogue seeds over weak live-only hits
  if (book.source === 'seed' || (!book.source && book.indicativePrices)) score += 250

  // Heartfulness / Daaji intent: boost related seeds and OL titles that actually say heartfulness
  const wantsHeartfulness = tokens.some((t) => t === 'heartfulness' || t === 'daaji')
  if (wantsHeartfulness) {
    if (title.includes('heartfulness')) score += 500
    if (tags.includes('heartfulness') || tags.includes('daaji')) score += 350
    if (author.includes('patel') || author.includes('pollock') || author.includes('daaji')) score += 150
    // Penalise unrelated "heart" / "way" OL noise when the query is clearly Heartfulness
    if (!title.includes('heartfulness') && !tags.includes('heartfulness') && !tags.includes('daaji')) {
      score -= 200
    }
  }

  // Token coverage across full haystack (must already match for seeds; helps order live)
  const coverage = tokens.filter((t) => hay.includes(t)).length / tokens.length
  score += Math.round(coverage * 100)

  return score
}

export function rankByRelevance(books: Book[], query: string): Book[] {
  const q = query.trim()
  if (!q) return books
  return [...books].sort((a, b) => {
    const diff = relevanceScore(b, q) - relevanceScore(a, q)
    if (diff !== 0) return diff
    // Stable-ish tie-break: seeds first, then title
    const aSeed = a.source === 'seed' ? 0 : 1
    const bSeed = b.source === 'seed' ? 0 : 1
    if (aSeed !== bSeed) return aSeed - bSeed
    return a.title.localeCompare(b.title)
  })
}

/**
 * Merge seed catalogue with live Open Library hits.
 * Matching seeds win (keep free links, LibriVox, indicativePrices).
 * Cover from live is used when seed has none.
 * Results are ranked so exact/near-exact and Heartfulness matches surface near the top.
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

  return q ? rankByRelevance(result, q) : result
}
