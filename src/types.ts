export interface OutboundLink {
  label: string
  url: string
}

export interface FreePath {
  available: boolean
  note: string
  links: OutboundLink[]
}

export interface AudiobookInfo {
  librivox?: OutboundLink
}

/** Manual indicative AUD prices for paid retailers (not live). */
export interface IndicativePrices {
  amazonAu?: number
  kindle?: number
  booktopia?: number
  dymocks?: number
  readings?: number
  appleBooks?: number
  googlePlay?: number
  audible?: number
}

export type BookSource = 'seed' | 'openlibrary'

export interface Book {
  id: string
  title: string
  author: string
  isbn?: string
  year?: number
  tags?: string[]
  free: FreePath
  audiobook?: AudiobookInfo
  /** ISO date when indicativePrices were last manually updated */
  pricesUpdated?: string
  indicativePrices?: IndicativePrices
  /** Open Library cover id → https://covers.openlibrary.org/b/id/{id}-M.jpg */
  coverUrl?: string
  /** Where this row came from */
  source?: BookSource
  /** Open Library work/edition key, e.g. /works/OL…W */
  openLibraryKey?: string
}

export const PRICES_DISCLAIMER =
  'Indicative prices in AUD — not live. Check the store for today’s price.'

export function formatAud(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(amount)
}

/** Display label for last-updated ISO date, e.g. 2026-09-15 → 15 Sep 2026 */
export function formatPricesUpdated(iso?: string): string | null {
  if (!iso) return null
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export type MovieSource = 'seed' | 'wikipedia' | 'tmdb' | 'query'

export interface Movie {
  id: string
  title: string
  year?: number
  director?: string
  tags?: string[]
  /** Legal free / public-domain sources when known */
  free: FreePath
  coverUrl?: string
  source?: MovieSource
  overview?: string
  /** TMDB id when from TMDB */
  tmdbId?: number
  wikipediaUrl?: string
}
