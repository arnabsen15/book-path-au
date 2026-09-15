import type { Movie } from '../types'
import { MoviePathCards } from './MoviePathCards'

interface MovieResultProps {
  movie: Movie
  expanded: boolean
  onToggle: () => void
}

export function MovieResult({ movie, expanded, onToggle }: MovieResultProps) {
  const metaParts = [
    movie.director || null,
    movie.year ? String(movie.year) : null,
  ].filter(Boolean)

  return (
    <section className={`book-result ${expanded ? 'expanded' : 'collapsed'}`} id={movie.id}>
      <button type="button" className="book-summary" onClick={onToggle} aria-expanded={expanded}>
        <div className="book-cover-wrap" aria-hidden={!movie.coverUrl}>
          {movie.coverUrl ? (
            <img
              className="book-cover"
              src={movie.coverUrl}
              alt=""
              loading="lazy"
              width={64}
              height={96}
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <div className="book-cover placeholder">🎬</div>
          )}
        </div>
        <div className="book-summary-text">
          <header className="book-header">
            <h2>{movie.title}</h2>
            <p className="book-meta">{metaParts.join(' · ') || 'Film'}</p>
            <p className="path-legend">
              Free · Borrow · Stream · Buy
              {movie.source === 'seed' ? (
                <span className="seed-badge"> · Seed</span>
              ) : movie.source === 'query' ? (
                <span className="live-badge"> · Search links</span>
              ) : movie.source ? (
                <span className="live-badge"> · Live</span>
              ) : null}
            </p>
            {movie.overview ? <p className="movie-overview muted">{movie.overview}</p> : null}
          </header>
        </div>
        <span className="expand-hint">{expanded ? 'Hide paths' : 'Show paths'}</span>
      </button>

      {expanded && (
        <div className="book-details">
          <MoviePathCards movie={movie} />
        </div>
      )}
    </section>
  )
}
