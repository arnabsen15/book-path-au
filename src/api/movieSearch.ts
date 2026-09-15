import type { Movie } from '../types'

const WIKI_OPENSEARCH =
  'https://en.wikipedia.org/w/api.php?action=opensearch&namespace=0&format=json&origin=*&limit=12'

const TMDB_KEY = (import.meta.env.VITE_TMDB_API_KEY as string | undefined)?.trim() || ''

function slugId(title: string, year?: number): string {
  const base = `${title}-${year ?? ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `mv-${base}`.slice(0, 80)
}

function defaultFree(): Movie['free'] {
  return {
    available: false,
    note: 'Not confirmed free legally. Check Internet Archive for possible public-domain copies — don’t assume.',
    links: [],
  }
}

/** Parse a year from a Wikipedia description snippet when possible. */
function yearFromSnippet(snippet: string): number | undefined {
  const m = snippet.match(/\b(18|19|20)\d{2}\b/)
  return m ? Number(m[0]) : undefined
}

/**
 * Keyless Wikipedia OpenSearch for film-ish titles.
 * Filters out obvious non-film hits when possible; still merges with seeds on the page.
 */
export async function searchWikipediaFilms(
  query: string,
  signal?: AbortSignal,
): Promise<Movie[]> {
  const q = query.trim()
  if (!q) return []

  const url = `${WIKI_OPENSEARCH}&search=${encodeURIComponent(q)}`
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Wikipedia search failed (${res.status})`)

  const data = (await res.json()) as [string, string[], string[], string[]]
  const titles = data[1] ?? []
  const descriptions = data[2] ?? []
  const links = data[3] ?? []

  const movies: Movie[] = []
  for (let i = 0; i < titles.length; i++) {
    const title = titles[i]?.trim()
    if (!title) continue
    const desc = descriptions[i] ?? ''
    const lower = `${title} ${desc}`.toLowerCase()
    // Soft preference for film-related results; still include close title matches
    const filmish =
      /\b(film|movie|cinema|directed|screenplay|thriller|comedy|drama|horror|animation)\b/.test(
        lower,
      ) ||
      title.toLowerCase().includes(q.toLowerCase())
    if (!filmish && titles.length > 3) continue

    const year = yearFromSnippet(desc)
    movies.push({
      id: slugId(title, year),
      title,
      year,
      overview: desc || undefined,
      wikipediaUrl: links[i],
      free: defaultFree(),
      source: 'wikipedia',
    })
  }
  return movies
}

interface TmdbResult {
  id: number
  title?: string
  release_date?: string
  poster_path?: string | null
  overview?: string
}

export async function searchTmdbMovies(
  query: string,
  signal?: AbortSignal,
): Promise<Movie[]> {
  if (!TMDB_KEY) return []
  const q = query.trim()
  if (!q) return []

  const params = new URLSearchParams({
    api_key: TMDB_KEY,
    query: q,
    include_adult: 'false',
  })
  const res = await fetch(`https://api.themoviedb.org/3/search/movie?${params}`, {
    signal,
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`TMDB search failed (${res.status})`)
  const data = (await res.json()) as { results?: TmdbResult[] }
  const movies: Movie[] = []
  for (const r of data.results ?? []) {
    const title = (r.title ?? '').trim()
    if (!title) continue
    const year = r.release_date ? Number(r.release_date.slice(0, 4)) : undefined
    movies.push({
      id: `tmdb-${r.id}`,
      title,
      year: Number.isFinite(year) ? year : undefined,
      overview: r.overview || undefined,
      coverUrl: r.poster_path ? `https://image.tmdb.org/t/p/w185${r.poster_path}` : undefined,
      free: defaultFree(),
      source: 'tmdb',
      tmdbId: r.id,
    })
  }
  return movies
}

export function hasTmdbKey(): boolean {
  return Boolean(TMDB_KEY)
}

/**
 * Prefer TMDB when VITE_TMDB_API_KEY is set; otherwise Wikipedia OpenSearch.
 * Always safe without keys.
 */
export async function searchMoviesLive(
  query: string,
  signal?: AbortSignal,
): Promise<Movie[]> {
  if (TMDB_KEY) {
    try {
      return await searchTmdbMovies(query, signal)
    } catch {
      // fall through to Wikipedia
    }
  }
  return searchWikipediaFilms(query, signal)
}

/** Synthetic row so any query still gets JustWatch / store paths even with zero API hits. */
export function queryStubMovie(query: string): Movie {
  const title = query.trim()
  return {
    id: slugId(`query-${title}`),
    title,
    free: defaultFree(),
    source: 'query',
    overview: 'Not in our seed list — use JustWatch and store search links below (availability not claimed).',
  }
}
