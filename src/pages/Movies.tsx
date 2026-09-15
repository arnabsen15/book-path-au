import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { hasTmdbKey, searchMoviesLive } from '../api/movieSearch'
import { MovieResult } from '../components/MovieResult'
import { NearManorPanel } from '../components/NearManorPanel'
import { SearchBox } from '../components/SearchBox'
import { SearchSkeleton } from '../components/SearchSkeleton'
import { useRegion } from '../context/RegionContext'
import moviesData from '../data/movies.json'
import { getNowShowingById, type NowShowingSeed } from '../data/nowShowingLocal'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import type { Movie } from '../types'
import { refineMovieSearch } from '../utils/movieSeedMatch'

const seeds = (moviesData as Movie[]).map((m) => ({ ...m, source: 'seed' as const }))

const SUGGESTIONS = ['Hanuman Ansh', 'Fall 2', 'Toy Story 5', 'Spider-Man: Brand New Day', 'Insidious']

function seedToMovie(seed: NowShowingSeed): Movie {
  const fromCatalogue = seeds.find((m) => m.id === seed.id)
  return {
    id: seed.id,
    title: seed.title,
    year: seed.year,
    director: seed.director || fromCatalogue?.director || '',
    tags: fromCatalogue?.tags || ['theatrical', 'now-showing'],
    free: fromCatalogue?.free || {
      available: false,
      note: 'Theatrical / now showing — check local cinema links.',
      links: [],
    },
    coverUrl: seed.coverUrl || fromCatalogue?.coverUrl,
    source: 'seed',
  }
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
  const [selectedLocal, setSelectedLocal] = useState<Movie | null>(null)
  const [showBroader, setShowBroader] = useState(false)

  const abortRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef(0)
  const decisionRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (flushQuery !== null && debouncedQuery.trim() === flushQuery.trim()) {
      setFlushQuery(null)
    }
  }, [debouncedQuery, flushQuery])

  useEffect(() => {
    setShowBroader(false)
  }, [activeSearch])

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
          : 'Could not reach film metadata. Local cinema seeds and JustWatch still work.',
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

  const refined = useMemo(() => {
    if (!activeSearch) {
      return { close: [] as Movie[], broader: [] as Movie[], wasFiltered: false, rawCount: 0 }
    }
    return refineMovieSearch(seeds, liveResults, activeSearch)
  }, [activeSearch, liveResults])

  const browsingEmpty = activeSearch === ''
  const noCloseButRaw =
    !browsingEmpty && !loading && refined.close.length === 0 && refined.rawCount > 0
  const hardEmpty =
    !browsingEmpty && !loading && refined.rawCount === 0 && !error

  const results = useMemo(() => {
    if (browsingEmpty) return []
    if (showBroader || noCloseButRaw) {
      if (noCloseButRaw && !showBroader) return []
      return refined.broader
    }
    return refined.close
  }, [browsingEmpty, showBroader, noCloseButRaw, refined])

  const resultIds = useMemo(() => results.map((r) => r.id).join('|'), [results])

  useEffect(() => {
    if (!activeSearch) {
      setExpandedId(null)
      return
    }
    setSelectedLocal(null)
    const ids = resultIds.split('|').filter(Boolean)
    if (ids.length === 1) {
      setExpandedId(ids[0])
      return
    }
    setExpandedId((current) => (current && ids.includes(current) ? current : null))
  }, [resultIds, activeSearch])

  useEffect(() => {
    if (!expandedId && !selectedLocal) return
    const t = window.setTimeout(() => {
      decisionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 50)
    return () => window.clearTimeout(t)
  }, [expandedId, selectedLocal])

  const metaHint = hasTmdbKey()
    ? 'TMDB + seeds'
    : 'Wikipedia OpenSearch + seeds (optional VITE_TMDB_API_KEY)'

  const openLocal = (seed: NowShowingSeed) => {
    const movie = seedToMovie(seed)
    const ns = getNowShowingById(seed.id)
    if (ns?.coverUrl && !movie.coverUrl) movie.coverUrl = ns.coverUrl
    setSelectedLocal(movie)
    setExpandedId(null)
    setQuery('')
    setFlushQuery(null)
  }

  return (
    <div className="home movies-home">
      <section className="hero hero-compact">
        <h1>Movies</h1>
        <p className="tagline">
          What’s on near Manor Lakes / Werribee tonight (and this week)?
        </p>
      </section>

      <div className="region-pill" role="status">
        <span className="region-pill-dot" aria-hidden="true" />
        Links for <strong>{region.name}</strong>
      </div>

      {browsingEmpty && !selectedLocal ? <NearManorPanel onSelect={openLocal} /> : null}

      <SearchBox
        value={query}
        onChange={(v) => {
          setQuery(v)
          setFlushQuery(null)
          setSelectedLocal(null)
        }}
        onSubmit={() => {
          setFlushQuery(query.trim())
          setSelectedLocal(null)
        }}
        suggestions={SUGGESTIONS}
        loading={loading}
        placeholder="Search other titles…"
        label="Search movies"
        inputId="movie-search"
      />

      <p className="movies-search-hint">
        {browsingEmpty
          ? 'Or search any title — cinema first when it’s theatrical, JustWatch secondary.'
          : 'Tap a title to see cinema + where to watch.'}
      </p>

      {selectedLocal && browsingEmpty ? (
        <div className="results" ref={decisionRef}>
          <button type="button" className="chip back-near-chip" onClick={() => setSelectedLocal(null)}>
            ← Back to Near Manor Lakes
          </button>
          <MovieResult
            movie={selectedLocal}
            expanded
            onToggle={() => setSelectedLocal(null)}
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

      {hardEmpty && (
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">
            🎬
          </div>
          <p>No matches for “{activeSearch}”.</p>
          <p className="muted">Try Hanuman Ansh — Village Werribee + HOYTS CTAs still help.</p>
        </div>
      )}

      {noCloseButRaw && !showBroader ? (
        <div className="empty-state filter-empty">
          <div className="empty-icon" aria-hidden="true">
            🎬
          </div>
          <p>No close matches — try a fuller title</p>
          <p className="muted">We hid weak film hits for “{activeSearch}”.</p>
          <button type="button" className="chip" onClick={() => setShowBroader(true)}>
            Show broader results
          </button>
        </div>
      ) : null}

      {!browsingEmpty && refined.wasFiltered && results.length > 0 && !showBroader ? (
        <p className="filter-status" role="status">
          Showing {results.length} best match{results.length === 1 ? '' : 'es'}
        </p>
      ) : null}

      {!browsingEmpty && showBroader && refined.rawCount > 0 ? (
        <div className="filter-status-row">
          <p className="filter-status" role="status">
            Showing broader results ({results.length})
          </p>
          <button type="button" className="chip chip-quiet" onClick={() => setShowBroader(false)}>
            Show best matches only
          </button>
        </div>
      ) : null}

      {!browsingEmpty &&
      refined.wasFiltered &&
      refined.close.length > 0 &&
      !showBroader &&
      refined.broader.length > refined.close.length ? (
        <p className="filter-toggle-wrap">
          <button type="button" className="linkish" onClick={() => setShowBroader(true)}>
            Show broader results
          </button>
        </p>
      ) : null}

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
