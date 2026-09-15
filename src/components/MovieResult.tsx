import type { Movie } from '../types'
import { MoviePathCards } from './MoviePathCards'

interface MovieResultProps {
  movie: Movie
  expanded: boolean
  onToggle: () => void
}

export function MovieResult({ movie, expanded, onToggle }: MovieResultProps) {
  const metaParts = [movie.director || null, movie.year ? String(movie.year) : null].filter(Boolean)

  return (
    <section className={`result-card ${expanded ? 'expanded' : 'collapsed'}`} id={movie.id}>
      <button type="button" className="result-summary" onClick={onToggle} aria-expanded={expanded}>
        <div className="cover-wrap" aria-hidden={!movie.coverUrl}>
          {movie.coverUrl ? (
            <img
              className="cover-img"
              src={movie.coverUrl}
              alt=""
              loading="lazy"
              width={72}
              height={108}
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <div className="cover-img placeholder">🎬</div>
          )}
        </div>
        <div className="result-summary-text">
          <header className="result-header">
            <h2>{movie.title}</h2>
            <p className="result-meta">{metaParts.join(' · ') || 'Film'}</p>
            <div className="path-chip-row" aria-label="Paths">
              <span className="path-badge path-free"><span aria-hidden="true">🌿 </span>Free</span>
              <span className="path-badge path-borrow"><span aria-hidden="true">📚 </span>Borrow</span>
              <span className="path-badge path-stream"><span aria-hidden="true">📡 </span>Stream</span>
              <span className="path-badge path-buy"><span aria-hidden="true">🛒 </span>Buy</span>
              <span className="path-badge path-cinema"><span aria-hidden="true">🎟️ </span>Cinema</span>
              {movie.source === 'seed' ? (
                <span className="meta-pill seed">Seed</span>
              ) : movie.source === 'query' ? (
                <span className="meta-pill live">Search links</span>
              ) : movie.source ? (
                <span className="meta-pill live">Live</span>
              ) : null}
            </div>
            {movie.overview ? <p className="movie-overview muted">{movie.overview}</p> : null}
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
          <MoviePathCards movie={movie} />
        </div>
      )}
    </section>
  )
}
