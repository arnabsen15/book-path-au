import type { Book } from '../types'
import { formatAud } from '../types'
import { CompareTable } from './CompareTable'
import { PathCards } from './PathCards'

interface BookResultProps {
  book: Book
  expanded: boolean
  onToggle: () => void
}

function lowestIndicative(book: Book): number | undefined {
  const p = book.indicativePrices
  if (!p) return undefined
  const vals = Object.values(p).filter((n): n is number => typeof n === 'number')
  if (!vals.length) return undefined
  return Math.min(...vals)
}

export function BookResult({ book, expanded, onToggle }: BookResultProps) {
  const metaParts = [
    book.author,
    book.year ? String(book.year) : null,
    book.isbn ? `ISBN ${book.isbn}` : null,
  ].filter(Boolean)

  const low = lowestIndicative(book)
  const priceHint =
    typeof low === 'number'
      ? `Indicative from ${formatAud(low)}`
      : book.source === 'openlibrary'
        ? 'See store for prices'
        : null

  return (
    <section className={`book-result ${expanded ? 'expanded' : 'collapsed'}`} id={book.id}>
      <button type="button" className="book-summary" onClick={onToggle} aria-expanded={expanded}>
        <div className="book-cover-wrap" aria-hidden={!book.coverUrl}>
          {book.coverUrl ? (
            <img
              className="book-cover"
              src={book.coverUrl}
              alt=""
              loading="lazy"
              width={64}
              height={96}
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <div className="book-cover placeholder">No cover</div>
          )}
        </div>
        <div className="book-summary-text">
          <header className="book-header">
            <h2>{book.title}</h2>
            <p className="book-meta">{metaParts.join(' · ')}</p>
            <p className="path-legend">
              Free · Borrow · Listen · Buy
              {priceHint ? <span className="price-hint"> · {priceHint}</span> : null}
              {book.source === 'seed' && book.indicativePrices ? (
                <span className="seed-badge"> · Seed</span>
              ) : book.source === 'openlibrary' ? (
                <span className="live-badge"> · Live</span>
              ) : null}
            </p>
          </header>
        </div>
        <span className="expand-hint">{expanded ? 'Hide paths' : 'Show paths'}</span>
      </button>

      {expanded && (
        <div className="book-details">
          <PathCards book={book} />
          <CompareTable book={book} />
        </div>
      )}
    </section>
  )
}
