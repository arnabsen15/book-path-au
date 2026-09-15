import type { Book } from '../types'
import type { RegionConfig } from '../region'

export function encodeQuery(text: string): string {
  return encodeURIComponent(text)
}

/** Prefer title + author for store search (ISBN-alone often 404s or returns unrelated hits). */
function titleAuthor(book: Book): string {
  return `${book.title} ${book.author}`.trim()
}

export function troveSearchUrl(book: Book): string {
  return `https://trove.nla.gov.au/search/category/books?keyword=${encodeQuery(book.title)}`
}

export function amazonAuSearchUrl(book: Book, region: RegionConfig): string {
  return `https://${region.amazonHost}/s?k=${encodeQuery(titleAuthor(book))}`
}

export function kindleAuSearchUrl(book: Book, region: RegionConfig): string {
  return `https://${region.amazonHost}/s?k=${encodeQuery(titleAuthor(book))}&i=digital-text`
}

export function booktopiaSearchUrl(book: Book): string {
  return `https://www.booktopia.com.au/search.ep?keywords=${encodeQuery(titleAuthor(book))}`
}

/**
 * Dymocks blocks many automated clients (403). Google site: search is reliable for humans.
 */
export function dymocksSearchUrl(book: Book): string {
  return `https://www.google.com/search?q=${encodeQuery(`${titleAuthor(book)} site:dymocks.com.au`)}`
}

/**
 * Readings /search?q= returns 404; no stable public search path verified.
 * Google site: search with title+author is the honest working fallback.
 */
export function readingsSearchUrl(book: Book): string {
  return `https://www.google.com/search?q=${encodeQuery(`${titleAuthor(book)} site:readings.com.au`)}`
}

export function googlePlayBooksSearchUrl(book: Book): string {
  return `https://play.google.com/store/search?q=${encodeQuery(titleAuthor(book))}&c=books`
}

/**
 * books.apple.com/{locale}/search?term= redirects to marketing and drops a useful results page.
 * Apple.com locale search keeps the query for humans.
 */
export function appleBooksSearchUrl(book: Book, region: RegionConfig): string {
  return `https://www.apple.com/${region.appleBooksLocale}/search/${encodeQuery(titleAuthor(book))}?src=serp`
}

export function audibleAuSearchUrl(book: Book, region: RegionConfig): string | null {
  if (!region.audibleHost) return null
  return `https://${region.audibleHost}/search?keywords=${encodeQuery(titleAuthor(book))}`
}

export function googlePlayAudiobookSearchUrl(book: Book): string {
  return `https://play.google.com/store/search?q=${encodeQuery(`${titleAuthor(book)} audiobook`)}&c=books`
}

export function spotifyAudiobookSearchUrl(book: Book): string {
  return `https://open.spotify.com/search/${encodeQuery(`${titleAuthor(book)} audiobook`)}`
}

/** Libby has no reliable deep-link search for an arbitrary title — open the app/site only. */
export function libbyUrl(): string {
  return 'https://www.libbyapp.com/'
}

/** Amazon display label for current region */
export function amazonLabel(region: RegionConfig): string {
  switch (region.code) {
    case 'AU':
      return 'Amazon.au'
    case 'US':
      return 'Amazon.com'
    case 'GB':
      return 'Amazon.co.uk'
    case 'NZ':
      return 'Amazon.au'
    case 'IN':
      return 'Amazon.in'
    default:
      return 'Amazon'
  }
}

export function amazonSearchLabel(region: RegionConfig): string {
  return `Search ${amazonLabel(region)}`
}

export function audibleLabel(region: RegionConfig): string {
  switch (region.code) {
    case 'AU':
    case 'NZ':
      return 'Audible.au'
    case 'US':
      return 'Audible.com'
    case 'GB':
      return 'Audible.co.uk'
    case 'IN':
      return 'Audible.in'
    default:
      return 'Audible'
  }
}
