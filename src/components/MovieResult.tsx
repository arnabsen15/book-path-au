import type { Movie } from '../types'
import { MoviePathCards } from './MoviePathCards'

interface MovieResultProps {
  movie: Movie
  expanded: boolean
  onToggle: () => void
  /** Compact list row without path badges — decision screen on expand */
  mode?: 'list' | 'decision'
}

export function MovieResult({ movie, expanded, onToggle }: MovieResultProps) {
  const yearLabel = movie.year ? String(movie.year) : null

  return (
    <section
      className={`result-card movie-result-card ${expanded ? 'expanded' : 'collapsed'}`}
      id={movie.id}
    >
      <button type="button" className="result-summary movie-result-summary" onClick={onToggle} aria-expanded={expanded}>
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
            {yearLabel ? <p className="result-meta">{yearLabel}</p> : <p className="result-meta">Film</p>}
          </header>
          <span className="where-watch-cta" aria-hidden="true">
            Where to watch →
          </span>
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
        <div className="result-details movie-decision-panel">
          <MoviePathCards movie={movie} />
        </div>
      )}
    </section>
  )
}
