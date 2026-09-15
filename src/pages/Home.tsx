import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { searchOpenLibrary } from '../api/openLibrary'
import { BookResult } from '../components/BookResult'
import { SearchBox } from '../components/SearchBox'
import { SearchSkeleton } from '../components/SearchSkeleton'
import booksData from '../data/books.json'
import { useRegion } from '../context/RegionContext'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import type { Book } from '../types'
import { mergeSeedAndLive } from '../utils/seedMatch'

const seeds = (booksData as Book[]).map((b) => ({ ...b, source: 'seed' as const }))

const POPULAR_IDS = [
  'pride-and-prejudice',
  'frankenstein',
  'atomic-habits',
  'raja-yoga',
  'the-heartfulness-way',
  'sapiens',
]

const SUGGESTIONS = ['Heartfulness Way', 'Daaji', 'Raja Yoga', 'Pride and Prejudice', 'Atomic Habits']

function resolvePopular(): Book[] {
  const byId = new Map(seeds.map((b) => [b.id, b]))
  const picked: Book[] = []
  for (const id of POPULAR_IDS) {
    const hit = byId.get(id)
    if (hit) picked.push(hit)
  }
  if (picked.length < 6) {
    for (const b of seeds) {
      if (picked.length >= 6) break
      if (!picked.some((p) => p.id === b.id)) picked.push(b)
    }
  }
  return picked.slice(0, 6)
}

export function Home() {
  const { region } = useRegion()
  const [query, setQuery] = useState('')
  const [flushQuery, setFlushQuery] = useState<string | null>(null)
  const debouncedQuery = useDebouncedValue(query, 300)
  const activeSearch = (flushQuery !== null ? flushQuery : debouncedQuery).trim()

  const [liveResults, setLiveResults] = useState<Book[]>([])
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
      const books = await searchOpenLibrary(trimmed, controller.signal)
      if (reqId !== requestIdRef.current) return
      setLiveResults(books)
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      if (reqId !== requestIdRef.current) return
      setLiveResults([])
      setError(
        err instanceof Error
          ? err.message
          : 'Could not reach Open Library. Check your connection and try again.',
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
    return mergeSeedAndLive(seeds, liveResults, activeSearch)
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

  return (
    <div className="home">
      <section className="hero hero-compact">
        <h1>Books</h1>
        <p className="tagline">Legal paths: Free → Borrow → Listen → Buy</p>
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
      />

      {browsingEmpty ? (
        <p className="popular-label">Popular to try</p>
      ) : null}

      {loading && (
        <div className="loading-block" role="status" aria-live="polite">
          <p className="loading-label">Searching Open Library…</p>
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
            📖
          </div>
          <p>No matches for “{activeSearch}”.</p>
          <p className="muted">Try Atomic Habits or another spelling / ISBN.</p>
        </div>
      )}

      <div className="results">
        {results.map((book) => (
          <BookResult
            key={book.id}
            book={book}
            expanded={expandedId === book.id}
            onToggle={() => setExpandedId((id) => (id === book.id ? null : book.id))}
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
