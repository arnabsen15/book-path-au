import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { hasTmdbKey, searchMoviesLive } from '../api/movieSearch'
import { MovieResult } from '../components/MovieResult'
import { SearchBox } from '../components/SearchBox'
import { SearchSkeleton } from '../components/SearchSkeleton'
import { useRegion } from '../context/RegionContext'
import moviesData from '../data/movies.json'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import type { Movie } from '../types'
import { mergeMovieSeedAndLive } from '../utils/movieSeedMatch'

const seeds = (moviesData as Movie[]).map((m) => ({ ...m, source: 'seed' as const }))

const POPULAR_IDS = [
  'hanuman-ansh-2026',
  'mad-max-1979',
  'the-castle-1997',
  'nosferatu-1922',
  'oppenheimer-2023',
  'picnic-hanging-rock-1975',
]

const SUGGESTIONS = ['Hanuman Ansh', 'Mad Max', 'The Castle', 'Nosferatu', 'Oppenheimer']

function resolvePopular(): Movie[] {
  const byId = new Map(seeds.map((m) => [m.id, m]))
  const picked: Movie[] = []
  for (const id of POPULAR_IDS) {
    const hit = byId.get(id)
    if (hit) picked.push(hit)
  }
  if (picked.length < 6) {
    for (const m of seeds) {
      if (picked.length >= 6) break
      if (!picked.some((p) => p.id === m.id)) picked.push(m)
    }
  }
  return picked.slice(0, 6)
}

export function Movies() {
  const { region } = useRegion()
  const [query, setQuery] = useState('')
  const [flushQuery, setFlushQuery] = useState<string | null>(null)
  const debouncedQuery = useDebouncedValue(query, 300)
  const activeSearch = (flushQuery !== null ? flushQuery : debouncedQuery).trim()

  const [liveResults, setLiveResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const abortRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef(0)

  useEffect(() => {
    if (flushQuery !== null && debouncedQuery.trim() === flushQuery.trim()) {
      setFlushQuery(null)
    }
  }, [debouncedQuery, flushQuery])

  const runSearch = useCallback(async (q: string) => {
    abortRef.current?.abort()
    const trimmed = q.trim()
    if (!trimmed) {
      setLiveResults([])
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()
    abortRef.current = controller
    const reqId = ++requestIdRef.current
    setLoading(true)
    setError(null)

    try {
      const movies = await searchMoviesLive(trimmed, controller.signal)
      if (reqId !== requestIdRef.current) return
      setLiveResults(movies)
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      if (reqId !== requestIdRef.current) return
      setLiveResults([])
      setError(
        err instanceof Error
          ? err.message
          : 'Could not reach film metadata. Seed list and JustWatch links still work.',
      )
    } finally {
      if (reqId === requestIdRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    void runSearch(activeSearch)
    return () => {
      abortRef.current?.abort()
    }
  }, [activeSearch, runSearch])

  const popular = useMemo(() => resolvePopular(), [])

  const results = useMemo(() => {
    if (!activeSearch) return popular
    return mergeMovieSeedAndLive(seeds, liveResults, activeSearch)
  }, [activeSearch, liveResults, popular])

  const resultIds = useMemo(() => results.map((r) => r.id).join('|'), [results])

  useEffect(() => {
    const ids = resultIds.split('|').filter(Boolean)
    if (ids.length === 1) {
      setExpandedId(ids[0])
      return
    }
    setExpandedId((current) => (current && ids.includes(current) ? current : null))
  }, [resultIds])

  const browsingEmpty = activeSearch === ''
  const noMatches = !loading && activeSearch !== '' && results.length === 0 && !error
  const metaHint = hasTmdbKey()
    ? 'TMDB + seeds'
    : 'Wikipedia OpenSearch + seeds (optional VITE_TMDB_API_KEY)'

  return (
    <div className="home">
      <section className="hero hero-compact">
        <h1>Movies</h1>
        <p className="tagline">Legal paths: Free → Borrow → Stream → Buy</p>
      </section>

      <div className="region-pill" role="status">
        <span className="region-pill-dot" aria-hidden="true" />
        Links for <strong>{region.name}</strong>
      </div>

      <SearchBox
        value={query}
        onChange={(v) => {
          setQuery(v)
          setFlushQuery(null)
        }}
        onSubmit={() => {
          setFlushQuery(query.trim())
        }}
        suggestions={SUGGESTIONS}
        loading={loading}
        placeholder="Search movies by title…"
        label="Search movies"
        inputId="movie-search"
      />

      {browsingEmpty ? <p className="popular-label">Popular to try</p> : null}

      {loading && (
        <div className="loading-block" role="status" aria-live="polite">
          <p className="loading-label">Searching film metadata ({metaHint})…</p>
          <SearchSkeleton />
        </div>
      )}

      {error && (
        <div className="status-banner error" role="alert">
          <p>{error}</p>
          <button type="button" className="chip" onClick={() => void runSearch(activeSearch)}>
            Retry
          </button>
        </div>
      )}

      {noMatches && (
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">
            🎬
          </div>
          <p>No matches for “{activeSearch}”.</p>
          <p className="muted">Try Hanuman Ansh or another spelling — JustWatch still helps.</p>
        </div>
      )}

      <div className="results">
        {results.map((movie) => (
          <MovieResult
            key={movie.id}
            movie={movie}
            expanded={expandedId === movie.id}
            onToggle={() => setExpandedId((id) => (id === movie.id ? null : movie.id))}
          />
        ))}
      </div>

      {results.length > 0 && !browsingEmpty ? (
        <p className="result-count">
          {results.length} result{results.length === 1 ? '' : 's'}
          {loading ? ' (updating…)' : ''}
        </p>
      ) : null}
    </div>
  )
}
