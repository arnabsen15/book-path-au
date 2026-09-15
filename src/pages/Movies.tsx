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
  const [selectedPopular, setSelectedPopular] = useState<Movie | null>(null)

  const abortRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef(0)
  const decisionRef = useRef<HTMLDivElement | null>(null)

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
    if (!activeSearch) return []
    return mergeMovieSeedAndLive(seeds, liveResults, activeSearch)
  }, [activeSearch, liveResults])

  const resultIds = useMemo(() => results.map((r) => r.id).join('|'), [results])

  useEffect(() => {
    if (!activeSearch) {
      setExpandedId(null)
      return
    }
    setSelectedPopular(null)
    const ids = resultIds.split('|').filter(Boolean)
    if (ids.length === 1) {
      setExpandedId(ids[0])
      return
    }
    setExpandedId((current) => (current && ids.includes(current) ? current : null))
  }, [resultIds, activeSearch])

  useEffect(() => {
    if (!expandedId && !selectedPopular) return
    const t = window.setTimeout(() => {
      decisionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 50)
    return () => window.clearTimeout(t)
  }, [expandedId, selectedPopular])

  const browsingEmpty = activeSearch === ''
  const noMatches = !loading && activeSearch !== '' && results.length === 0 && !error
  const metaHint = hasTmdbKey()
    ? 'TMDB + seeds'
    : 'Wikipedia OpenSearch + seeds (optional VITE_TMDB_API_KEY)'

  const openPopular = (movie: Movie) => {
    setSelectedPopular(movie)
    setExpandedId(null)
    setQuery('')
    setFlushQuery(null)
  }

  return (
    <div className="home movies-home">
      <section className="hero hero-compact">
        <h1>Movies</h1>
        <p className="tagline">Find where to watch — stream, cinema, free TV, or buy</p>
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
          setSelectedPopular(null)
        }}
        onSubmit={() => {
          setFlushQuery(query.trim())
          setSelectedPopular(null)
        }}
        suggestions={SUGGESTIONS}
        loading={loading}
        placeholder="Search movies by title…"
        label="Search movies"
        inputId="movie-search"
      />

      <p className="movies-search-hint">Tap a title to see where to watch.</p>

      {browsingEmpty && !selectedPopular ? (
        <>
          <p className="popular-label">Popular to try</p>
          <div className="popular-poster-grid" role="list">
            {popular.map((movie) => (
              <button
                key={movie.id}
                type="button"
                className="popular-poster-tile"
                role="listitem"
                onClick={() => openPopular(movie)}
              >
                {movie.coverUrl ? (
                  <img src={movie.coverUrl} alt="" loading="lazy" width={120} height={180} />
                ) : (
                  <span className="popular-poster-fallback" aria-hidden="true">
                    🎬
                  </span>
                )}
                <span className="popular-poster-caption">
                  <span className="popular-poster-title">{movie.title}</span>
                  {movie.year ? <span className="popular-poster-year">{movie.year}</span> : null}
                </span>
              </button>
            ))}
          </div>
        </>
      ) : null}

      {selectedPopular && browsingEmpty ? (
        <div className="results" ref={decisionRef}>
          <MovieResult
            movie={selectedPopular}
            expanded
            onToggle={() => setSelectedPopular(null)}
          />
        </div>
      ) : null}

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

      {!browsingEmpty ? (
        <div className="results" ref={decisionRef}>
          {results.map((movie) => (
            <MovieResult
              key={movie.id}
              movie={movie}
              expanded={expandedId === movie.id}
              onToggle={() => setExpandedId((id) => (id === movie.id ? null : movie.id))}
            />
          ))}
        </div>
      ) : null}

      {results.length > 0 && !browsingEmpty ? (
        <p className="result-count">
          {results.length} result{results.length === 1 ? '' : 's'}
          {loading ? ' (updating…)' : ''}
        </p>
      ) : null}
    </div>
  )
}
