import type { AudiobookInfo, Book, FreePath, OutboundLink } from '../types'

const SEARCH_URL = 'https://openlibrary.org/search.json'

export interface OpenLibraryDoc {
  key?: string
  title?: string
  author_name?: string[]
  first_publish_year?: number
  isbn?: string[]
  cover_i?: number
  id_gutenberg?: string[]
  id_librivox?: string[]
  ia?: string[]
  ebook_access?: string
  edition_key?: string[]
}

interface OpenLibrarySearchResponse {
  numFound?: number
  docs?: OpenLibraryDoc[]
}

function pickIsbn(isbns: string[] | undefined): string | undefined {
  if (!isbns?.length) return undefined
  const isbn13 = isbns.find((i) => /^(978|979)\d{10}$/.test(i.replace(/[-\s]/g, '')))
  if (isbn13) return isbn13.replace(/[-\s]/g, '')
  const cleaned = isbns.map((i) => i.replace(/[-\s]/g, '')).find((i) => /^\d{10}(\d{3})?$/.test(i))
  return cleaned
}

function coverUrlFromId(coverId: number | undefined): string | undefined {
  if (!coverId) return undefined
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
}

function slugId(title: string, author: string, key?: string): string {
  const base = key
    ? key.replace(/^\//, '').replace(/\//g, '-')
    : `${title}-${author}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `ol-${base}`.slice(0, 80)
}

function gutenbergUrl(id: string): string {
  return `https://www.gutenberg.org/ebooks/${id}`
}

function openLibraryWorkUrl(key: string): string {
  return `https://openlibrary.org${key.startsWith('/') ? key : `/${key}`}`
}

function gutenbergSearchUrl(title: string, author: string): string {
  return `https://www.gutenberg.org/ebooks/search/?query=${encodeURIComponent(`${title} ${author}`)}`
}

function openLibrarySearchUrl(title: string, author: string): string {
  return `https://openlibrary.org/search?q=${encodeURIComponent(`${title} ${author}`)}`
}

function isClearlyPublicDomain(doc: OpenLibraryDoc): boolean {
  if (doc.ebook_access === 'public') return true
  if (doc.id_gutenberg && doc.id_gutenberg.length > 0) return true
  if (doc.id_librivox && doc.id_librivox.length > 0) return true
  if (doc.ia?.some((id) => /librivox/i.test(id) || /_gut$/i.test(id) || /gutenberg/i.test(id))) {
    return true
  }
  return false
}

function buildFreePath(doc: OpenLibraryDoc, title: string, author: string): FreePath {
  const links: OutboundLink[] = []
  const clearlyPd = isClearlyPublicDomain(doc)

  if (doc.id_gutenberg?.[0]) {
    links.push({ label: 'Project Gutenberg', url: gutenbergUrl(doc.id_gutenberg[0]) })
  }
  if (doc.key) {
    links.push({
      label: clearlyPd ? 'Open Library' : 'Check Open Library',
      url: openLibraryWorkUrl(doc.key),
    })
  }

  if (clearlyPd) {
    return {
      available: true,
      note: 'Public domain or open access identified via Open Library.',
      links:
        links.length > 0
          ? links
          : [
              { label: 'Open Library', url: openLibrarySearchUrl(title, author) },
              { label: 'Project Gutenberg', url: gutenbergSearchUrl(title, author) },
            ],
    }
  }

  // Not clearly free — still offer check links (no fake “free” claim)
  if (links.length === 0) {
    links.push(
      { label: 'Check Open Library', url: openLibrarySearchUrl(title, author) },
      { label: 'Check Gutenberg', url: gutenbergSearchUrl(title, author) },
    )
  } else if (!links.some((l) => /gutenberg/i.test(l.label))) {
    links.push({ label: 'Check Gutenberg', url: gutenbergSearchUrl(title, author) })
  }

  return {
    available: false,
    note: 'Not confirmed free. Check Open Library / Gutenberg for possible public-domain editions.',
    links,
  }
}

function buildAudiobook(doc: OpenLibraryDoc): AudiobookInfo | undefined {
  // LibriVox only when clearly PD / LibriVox-identified
  const librivoxId = doc.id_librivox?.[0]
  const iaLibrivox = doc.ia?.find((id) => /librivox/i.test(id))
  if (!librivoxId && !iaLibrivox) return undefined
  if (!isClearlyPublicDomain(doc) && !librivoxId && !iaLibrivox) return undefined

  if (iaLibrivox) {
    return {
      librivox: {
        label: 'LibriVox (Internet Archive)',
        url: `https://archive.org/details/${iaLibrivox}`,
      },
    }
  }
  return {
    librivox: {
      label: 'LibriVox',
      url: `https://librivox.org/search?q=${encodeURIComponent(librivoxId!)}&search_form=advanced`,
    },
  }
}

export function mapOpenLibraryDoc(doc: OpenLibraryDoc): Book | null {
  const title = (doc.title ?? '').trim()
  if (!title) return null
  const author = (doc.author_name ?? []).filter(Boolean).join(', ') || 'Unknown author'
  const isbn = pickIsbn(doc.isbn)
  const key = doc.key

  return {
    id: slugId(title, author, key),
    title,
    author,
    isbn,
    year: doc.first_publish_year,
    free: buildFreePath(doc, title, author),
    audiobook: buildAudiobook(doc),
    coverUrl: coverUrlFromId(doc.cover_i),
    source: 'openlibrary',
    openLibraryKey: key,
    // Live-only: no indicativePrices → UI shows “See store”
  }
}

export async function searchOpenLibrary(
  query: string,
  signal?: AbortSignal,
  limit = 20,
): Promise<Book[]> {
  const q = query.trim()
  if (!q) return []

  const params = new URLSearchParams({
    q,
    limit: String(limit),
    fields: [
      'key',
      'title',
      'author_name',
      'first_publish_year',
      'isbn',
      'cover_i',
      'id_gutenberg',
      'id_librivox',
      'ia',
      'ebook_access',
      'edition_key',
    ].join(','),
  })

  const res = await fetch(`${SEARCH_URL}?${params.toString()}`, {
    signal,
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) {
    throw new Error(`Open Library search failed (${res.status})`)
  }

  const data = (await res.json()) as OpenLibrarySearchResponse
  const books: Book[] = []
  for (const doc of data.docs ?? []) {
    const mapped = mapOpenLibraryDoc(doc)
    if (mapped) books.push(mapped)
  }
  return books
}
