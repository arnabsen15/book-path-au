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
      ? `From ${formatAud(low)}`
      : book.source === 'openlibrary'
        ? 'See store for prices'
        : null

  return (
    <section className={`result-card ${expanded ? 'expanded' : 'collapsed'}`} id={book.id}>
      <button type="button" className="result-summary" onClick={onToggle} aria-expanded={expanded}>
        <div className="cover-wrap" aria-hidden={!book.coverUrl}>
          {book.coverUrl ? (
            <img
              className="cover-img"
              src={book.coverUrl}
              alt=""
              loading="lazy"
              width={72}
              height={108}
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <div className="cover-img placeholder">No cover</div>
          )}
        </div>
        <div className="result-summary-text">
          <header className="result-header">
            <h2>{book.title}</h2>
            <p className="result-meta">{metaParts.join(' · ')}</p>
            <div className="path-chip-row" aria-label="Paths">
              <span className="path-badge path-free"><span aria-hidden="true">🌿 </span>Free</span>
              <span className="path-badge path-borrow"><span aria-hidden="true">📚 </span>Borrow</span>
              <span className="path-badge path-listen"><span aria-hidden="true">🎧 </span>Listen</span>
              <span className="path-badge path-buy"><span aria-hidden="true">🛒 </span>Buy</span>
              {priceHint ? <span className="meta-pill">{priceHint}</span> : null}
              {book.source === 'seed' && book.indicativePrices ? (
                <span className="meta-pill seed">Seed</span>
              ) : book.source === 'openlibrary' ? (
                <span className="meta-pill live">Live</span>
              ) : null}
            </div>
          </header>
        </div>
        <span className={`expand-chevron${expanded ? ' open' : ''}`} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      {expanded && (
        <div className="result-details">
          <PathCards book={book} />
          <CompareTable book={book} />
        </div>
      )}
    </section>
  )
}
