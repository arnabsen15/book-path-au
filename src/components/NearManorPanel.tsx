import { useSuburb } from '../hooks/useSuburb'
import {
  NOW_SHOWING_LOCAL,
  type NowShowingSeed,
  VILLAGE_WERRIBEE_URL,
} from '../data/nowShowingLocal'
import { findAllSessionsUrl } from '../utils/movieLinks'

interface NearManorPanelProps {
  onSelect: (seed: NowShowingSeed) => void
}

export function NearManorPanel({ onSelect }: NearManorPanelProps) {
  const { suburb, setSuburb, hint, effectiveSuburb } = useSuburb()
  const place = effectiveSuburb

  return (
    <section className="near-manor" aria-labelledby="near-manor-heading">
      <div className="near-manor-head">
        <p className="near-manor-eyebrow">Tonight &amp; this week</p>
        <h2 id="near-manor-heading">Near Manor Lakes</h2>
        <p className="near-manor-sub">
          What’s on at Village Werribee, HOYTS Watergardens / Highpoint — not another JustWatch
          wrapper.
        </p>
      </div>

      <label className="suburb-field" htmlFor="near-suburb">
        <span className="suburb-label">Suburb / area</span>
        <input
          id="near-suburb"
          type="text"
          value={suburb}
          onChange={(e) => setSuburb(e.target.value)}
          placeholder={hint}
          autoComplete="address-level2"
        />
      </label>

      <ul className="now-showing-list">
        {NOW_SHOWING_LOCAL.map((seed) => {
          const sessions = seed.indicativeSessions
          return (
            <li key={seed.id} className={`now-showing-card${seed.emphasis ? ' emphasis' : ''}`}>
              <button type="button" className="now-showing-main" onClick={() => onSelect(seed)}>
                <span className="now-showing-poster" aria-hidden="true">
                  {seed.coverUrl ? (
                    <img src={seed.coverUrl} alt="" loading="lazy" width={64} height={96} />
                  ) : (
                    <span className="now-showing-poster-fallback">🎬</span>
                  )}
                </span>
                <span className="now-showing-text">
                  {seed.emphasis ? <span className="now-showing-badge">Featured</span> : null}
                  <span className="now-showing-title">{seed.title}</span>
                  <span className="now-showing-meta">
                    {seed.year}
                    {seed.note ? ` · ${seed.note}` : ''}
                  </span>
                  {sessions ? (
                    <span className="now-showing-times">
                      <strong>{sessions.dateLabel}</strong> · {sessions.cinemaLabel}:{' '}
                      {sessions.times.join(' · ')}
                      <em> — {sessions.disclaimer}</em>
                    </span>
                  ) : null}
                </span>
              </button>

              <div className="now-showing-ctas">
                <a
                  className="store-btn store-btn-cinema"
                  href={seed.cinema.villagePrimaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="store-btn-label">Village Werribee sessions</span>
                  <span className="store-btn-hint">Book / showtimes</span>
                </a>
                <a
                  className="store-btn store-btn-cinema"
                  href={seed.cinema.hoytsPrimaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="store-btn-label">HOYTS</span>
                  <span className="store-btn-hint">Watergardens / Highpoint</span>
                </a>
                <a
                  className="store-btn store-btn-cinema"
                  href={findAllSessionsUrl(seed.title, place)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="store-btn-label">Find all sessions</span>
                  <span className="store-btn-hint">Google · {place}</span>
                </a>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="near-manor-foot">
        <a href={VILLAGE_WERRIBEE_URL} target="_blank" rel="noopener noreferrer">
          Village Werribee cinema page →
        </a>
        <span className="muted"> Curated seeds · always confirm times on the cinema site.</span>
      </p>
    </section>
  )
}
