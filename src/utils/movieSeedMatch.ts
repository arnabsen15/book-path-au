import type { Movie } from '../types'
import { queryStubMovie } from '../api/movieSearch'
import {
  mostlyPresent,
  refineRankedResults,
  significantTokens,
  type RefinedList,
} from './searchRefine'

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function queryTokens(q: string): string[] {
  return norm(q).split(/\s+/).filter(Boolean)
}

export function matchesMovieQuery(movie: Movie, q: string): boolean {
  const hay = `${movie.title} ${movie.director ?? ''} ${(movie.tags ?? []).join(' ')} ${movie.year ?? ''}`.toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => hay.includes(token))
}

function titleClose(a: string, b: string): boolean {
  const sa = norm(a)
  const sb = norm(b)
  if (!sa || !sb) return false
  return (
    sa === sb ||
    sa.includes(sb) ||
    sb.includes(sa) ||
    (sa.length > 6 && sb.length > 6 && (sa.startsWith(sb.slice(0, 8)) || sb.startsWith(sa.slice(0, 8))))
  )
}

export function seedMatchesLiveMovie(seed: Movie, live: Movie): boolean {
  if (!titleClose(seed.title, live.title)) return false
  if (seed.year && live.year && Math.abs(seed.year - live.year) > 1) return false
  return true
}

/**
 * Relevance score for movies — prefer exact/near-exact titles and seeds.
 */
export function movieRelevanceScore(movie: Movie, query: string): number {
  const tokens = queryTokens(query)
  if (tokens.length === 0) return 0

  const title = norm(movie.title)
  const director = norm(movie.director ?? '')
  const tags = norm((movie.tags ?? []).join(' '))
  const qJoined = tokens.join(' ')

  let score = 0

  if (title === qJoined) score += 1000
  else if (title.replace(/^the /, '') === qJoined || qJoined.replace(/^the /, '') === title) score += 950
  else if (title.startsWith(qJoined) || qJoined.startsWith(title)) score += 800
  else if (title.includes(qJoined)) score += 600

  const allInTitle = tokens.every((t) => title.includes(t))
  if (allInTitle) score += 400

  const titleHits = tokens.filter((t) => title.includes(t)).length
  score += titleHits * 80

  score += tokens.filter((t) => director.includes(t)).length * 30
  score += tokens.filter((t) => tags.includes(t)).length * 40

  if (movie.source === 'seed') score += 250
  if (movie.source === 'query') score += 50
  if (movie.source === 'tmdb') score += 40

  const hay = `${title} ${director} ${tags}`
  const coverage = tokens.filter((t) => hay.includes(t)).length / tokens.length
  score += Math.round(coverage * 100)

  return score
}

export const MIN_MOVIE_RELEVANCE = 180

/** Close match: query tokens mostly present in the title (seeds may use tags). */
export function isCloseMovieMatch(movie: Movie, query: string): boolean {
  const tokens = significantTokens(query)
  if (tokens.length === 0) return true

  // Synthetic query stub is always a close path for JustWatch / stores
  if (movie.source === 'query') return true

  const titleOk = mostlyPresent(tokens, movie.title)

  if (movie.source === 'seed') {
    const tagsOk = mostlyPresent(tokens, movie.title, movie.director ?? '', ...(movie.tags ?? []))
    if (!(titleOk || tagsOk)) return false
    return movieRelevanceScore(movie, query) >= MIN_MOVIE_RELEVANCE - 50
  }

  if (!titleOk) return false
  return movieRelevanceScore(movie, query) >= MIN_MOVIE_RELEVANCE
}

export function rankMoviesByRelevance(movies: Movie[], query: string): Movie[] {
  const q = query.trim()
  if (!q) return movies
  return [...movies].sort((a, b) => {
    const diff = movieRelevanceScore(b, q) - movieRelevanceScore(a, q)
    if (diff !== 0) return diff
    const aSeed = a.source === 'seed' ? 0 : 1
    const bSeed = b.source === 'seed' ? 0 : 1
    if (aSeed !== bSeed) return aSeed - bSeed
    return a.title.localeCompare(b.title)
  })
}

export function mergeMovieSeedAndLive(seeds: Movie[], live: Movie[], query: string): Movie[] {
  const q = query.trim()
  if (!q) return seeds.map((s) => ({ ...s, source: 'seed' as const }))

  const matchedSeeds = seeds.filter((s) => matchesMovieQuery(s, q))
  const usedLive = new Set<string>()
  const result: Movie[] = []

  for (const seed of matchedSeeds) {
    const hit = live.find((l) => !usedLive.has(l.id) && seedMatchesLiveMovie(seed, l))
    if (hit) {
      usedLive.add(hit.id)
      result.push({
        ...seed,
        source: 'seed',
        coverUrl: seed.coverUrl ?? hit.coverUrl,
        overview: seed.overview ?? hit.overview,
        wikipediaUrl: seed.wikipediaUrl ?? hit.wikipediaUrl,
        tmdbId: seed.tmdbId ?? hit.tmdbId,
        year: seed.year ?? hit.year,
      })
    } else {
      result.push({ ...seed, source: 'seed' })
    }
  }

  for (const l of live) {
    if (usedLive.has(l.id)) continue
    if (matchedSeeds.some((s) => seedMatchesLiveMovie(s, l))) continue
    result.push(l)
  }

  // Always surface a stub so JustWatch / retailers are one click away
  if (!result.some((m) => norm(m.title) === norm(q))) {
    result.unshift(queryStubMovie(q))
  }

  return rankMoviesByRelevance(result, q)
}

/** Ranked merge + noise filter / dedupe / cap for movie search UI. */
export function refineMovieSearch(
  seeds: Movie[],
  live: Movie[],
  query: string,
): RefinedList<Movie> {
  const ranked = mergeMovieSeedAndLive(seeds, live, query)
  const q = query.trim()
  if (!q) {
    return { close: ranked, broader: ranked, wasFiltered: false, rawCount: ranked.length }
  }
  return refineRankedResults(ranked, (movie) => isCloseMovieMatch(movie, q))
}
