import type { Book } from '../types'

export function encodeQuery(text: string): string {
  return encodeURIComponent(text)
}

function searchQuery(book: Book): string {
  return book.isbn ? book.isbn : `${book.title} ${book.author}`
}

function titleAuthor(book: Book): string {
  return `${book.title} ${book.author}`
}

export function troveSearchUrl(book: Book): string {
  return `https://trove.nla.gov.au/search/category/books?keyword=${encodeQuery(book.title)}`
}

export function amazonAuSearchUrl(book: Book): string {
  return `https://www.amazon.com.au/s?k=${encodeQuery(searchQuery(book))}`
}

export function kindleAuSearchUrl(book: Book): string {
  return `https://www.amazon.com.au/s?k=${encodeQuery(searchQuery(book))}&i=digital-text`
}

export function booktopiaSearchUrl(book: Book): string {
  return `https://www.booktopia.com.au/search.ep?keywords=${encodeQuery(searchQuery(book))}`
}

export function dymocksSearchUrl(book: Book): string {
  return `https://www.dymocks.com.au/books/?term=${encodeQuery(searchQuery(book))}`
}

export function readingsSearchUrl(book: Book): string {
  return `https://www.readings.com.au/search?q=${encodeQuery(searchQuery(book))}`
}

export function googlePlayBooksSearchUrl(book: Book): string {
  return `https://play.google.com/store/search?q=${encodeQuery(titleAuthor(book))}&c=books`
}

export function appleBooksSearchUrl(book: Book): string {
  return `https://booksearch.music.apple.com/search?term=${encodeQuery(titleAuthor(book))}`
}

export function audibleAuSearchUrl(book: Book): string {
  return `https://www.audible.com.au/search?keywords=${encodeQuery(titleAuthor(book))}`
}

export function googlePlayAudiobookSearchUrl(book: Book): string {
  return `https://play.google.com/store/search?q=${encodeQuery(`${titleAuthor(book)} audiobook`)}&c=books`
}

export function spotifyAudiobookSearchUrl(book: Book): string {
  return `https://open.spotify.com/search/${encodeQuery(`${titleAuthor(book)} audiobook`)}`
}

export function libbyUrl(): string {
  return 'https://www.libbyapp.com/'
}
