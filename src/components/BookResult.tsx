import { useState } from 'react'
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
  const [showCompare, setShowCompare] = useState(false)
  const metaParts = [
    book.author,
    book.year ? String(book.year) : null,
  ].filter(Boolean)

  const low = lowestIndicative(book)
  const priceHint = typeof low === 'number' ? `From ${formatAud(low)}` : null

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
            <div className="cover-img placeholder">📖</div>
          )}
        </div>
        <div className="result-summary-text">
          <header className="result-header">
            <h2>{book.title}</h2>
            <p className="result-meta">{metaParts.join(' · ')}</p>
            <div className="path-chip-row" aria-label="Paths">
              <span className="path-badge path-free">Free</span>
              <span className="path-badge path-borrow">Borrow</span>
              <span className="path-badge path-listen">Listen</span>
              <span className="path-badge path-buy">Buy</span>
              {priceHint ? <span className="meta-pill">{priceHint}</span> : null}
            </div>
          </header>
        </div>
        <span className={`expand-chevron${expanded ? ' open' : ''}`} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {expanded && (
        <div className="result-details">
          <PathCards book={book} />
          <div className="compare-toggle-wrap">
            <button
              type="button"
              className="chip"
              aria-pressed={showCompare}
              onClick={() => setShowCompare((v) => !v)}
            >
              {showCompare ? 'Hide full comparison' : 'Show full comparison'}
            </button>
          </div>
          {showCompare ? <CompareTable book={book} /> : null}
        </div>
      )}
    </section>
  )
}
