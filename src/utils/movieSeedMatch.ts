import type { Movie } from '../types'
import { queryStubMovie } from '../api/movieSearch'

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
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

  return result
}
