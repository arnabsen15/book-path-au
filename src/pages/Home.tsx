import { useMemo, useState } from 'react'
import booksData from '../data/books.json'
import type { Book } from '../types'
import { BookResult } from '../components/BookResult'
import { SearchBox } from '../components/SearchBox'

const books = booksData as Book[]

const SUGGESTIONS = ['Raja Yoga', 'Vivekananda', 'Pride and Prejudice', 'Atomic Habits']

function matchesQuery(book: Book, q: string): boolean {
  const hay = `${book.title} ${book.author} ${book.isbn ?? ''} ${(book.tags ?? []).join(' ')}`.toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => hay.includes(token))
}

export function Home() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim()
    if (!q) return books
    return books.filter((b) => matchesQuery(b, q))
  }, [query])

  const noMatches = query.trim() !== '' && results.length === 0
  const browsingAll = query.trim() === ''

  return (
    <div className="home">
      <section className="hero">
        <h1>Book Path AU</h1>
        <p className="tagline">
          Find the best legal way to get a book in Australia — Free, Borrow, Listen, or Buy.
        </p>
        <p className="explainer">
          We don’t warehouse or deliver books. We point you to legal Free · Borrow · Listen · Buy
          options so you can choose what fits.
        </p>
      </section>

      <SearchBox value={query} onChange={setQuery} suggestions={SUGGESTIONS} />

      {noMatches && (
        <div className="empty-state">
          <p>No matches for “{query.trim()}”.</p>
          <p className="muted">Try another spelling, or a chip above.</p>
        </div>
      )}

      <div className="results">
        {results.map((book) => (
          <BookResult key={book.id} book={book} />
        ))}
      </div>

      {results.length > 0 && (
        <p className="result-count">
          {browsingAll
            ? `${results.length} books in the catalogue`
            : `${results.length} book${results.length === 1 ? '' : 's'} found`}
        </p>
      )}
    </div>
  )
}
