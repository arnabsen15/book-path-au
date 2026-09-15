import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { searchOpenLibrary } from '../api/openLibrary'
import { BookResult } from '../components/BookResult'
import { SearchBox } from '../components/SearchBox'
import booksData from '../data/books.json'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import type { Book } from '../types'
import { mergeSeedAndLive } from '../utils/seedMatch'

const seeds = (booksData as Book[]).map((b) => ({ ...b, source: 'seed' as const }))

const SUGGESTIONS = ['Raja Yoga', 'Vivekananda', 'Pride and Prejudice', 'Atomic Habits']

export function Home() {
  const [query, setQuery] = useState('')
  /** When set (e.g. form submit), search immediately instead of waiting for debounce. */
  const [flushQuery, setFlushQuery] = useState<string | null>(null)
  const debouncedQuery = useDebouncedValue(query, 300)
  const activeSearch = (flushQuery !== null ? flushQuery : debouncedQuery).trim()

  const [liveResults, setLiveResults] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const abortRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef(0)

  // Once debounce catches up to a flushed query, drop the flush override
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

  const results = useMemo(() => {
    if (!activeSearch) return seeds
    return mergeSeedAndLive(seeds, liveResults, activeSearch)
  }, [activeSearch, liveResults])

  const resultIds = useMemo(() => results.map((r) => r.id).join('|'), [results])

  useEffect(() => {
    const ids = resultIds.split('|').filter(Boolean)
    if (ids.length === 1) {
      setExpandedId(ids[0])
      return
    }
    setExpandedId((current) => (current && ids.includes(current) ? current : null))
  }, [resultIds])

  const browsingAll = activeSearch === ''
  const noMatches = !loading && activeSearch !== '' && results.length === 0 && !error

  return (
    <div className="home">
      <section className="hero">
        <h1>Book Path AU</h1>
        <p className="tagline">
          Find the best legal way to get a book in Australia — Free, Borrow, Listen, or Buy.
        </p>
        <p className="explainer">
          We don’t warehouse or deliver books. Search Open Library live, then compare legal Free ·
          Borrow · Listen · Buy options. Seeded favourites keep indicative AUD prices; live-only
          hits show “See store”.
        </p>
      </section>

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

      {loading && (
        <div className="status-banner loading" role="status" aria-live="polite">
          Searching Open Library…
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
          <p>No matches for “{activeSearch}”.</p>
          <p className="muted">Try another spelling, ISBN, or a chip above.</p>
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

      {results.length > 0 && (
        <p className="result-count">
          {browsingAll
            ? `${results.length} seeded books — type to search Open Library`
            : `${results.length} result${results.length === 1 ? '' : 's'}${loading ? ' (updating…)' : ''}`}
        </p>
      )}
    </div>
  )
}
