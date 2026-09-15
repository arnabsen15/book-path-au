import { useRegion } from '../context/RegionContext'
import { useSuburb } from '../hooks/useSuburb'
import type { Movie } from '../types'
import { amazonLabel } from '../utils/links'
import {
  abcIviewSearchUrl,
  amazonMovieSearchUrl,
  appleTvSearchUrl,
  beamafilmSearchUrl,
  bingeSearchUrl,
  cinemaShowtimesSearchUrl,
  disneyPlusSearchUrl,
  eventCinemasSearchUrl,
  googlePlayMoviesSearchUrl,
  hoytsSearchUrl,
  internetArchiveMoviesSearchUrl,
  justWatchSearchUrl,
  kanopySearchUrl,
  netflixSearchUrl,
  nineNowSearchUrl,
  primeVideoSearchUrl,
  sbsOnDemandSearchUrl,
  sevenPlusSearchUrl,
  stanSearchUrl,
  tenPlaySearchUrl,
  villageCinemasSearchUrl,
  youtubeMoviesSearchUrl,
} from '../utils/movieLinks'

interface MoviePathCardsProps {
  movie: Movie
}

function StoreButton({
  href,
  label,
  hint,
  path,
}: {
  href: string
  label: string
  hint?: string
  path?: 'free' | 'borrow' | 'stream' | 'listen' | 'buy' | 'cinema'
}) {
  return (
    <a
      className={`store-btn${path ? ` store-btn-${path}` : ''}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="store-btn-label">{label}</span>
      {hint ? <span className="store-btn-hint">{hint}</span> : null}
    </a>
  )
}

export function MoviePathCards({ movie }: MoviePathCardsProps) {
  const { region } = useRegion()
  const { suburb, setSuburb, hint } = useSuburb()
  const placeLabel = suburb.trim() || hint
  const justWatchUrl = justWatchSearchUrl(movie, region)
  const showtimesUrl = cinemaShowtimesSearchUrl(movie, region, suburb.trim() || hint)
  const showAuStreamers = region.code === 'AU' || region.code === 'NZ'
  const showAuCinemas = region.code === 'AU'

  let step = 1
  const nextStep = () => step++

  return (
    <div className="movie-paths">
      <a className="hero-cta" href={justWatchUrl} target="_blank" rel="noopener noreferrer">
        <span className="hero-cta-step" aria-hidden="true">
          {nextStep()}
        </span>
        <span className="hero-cta-body">
          <span className="hero-cta-kicker">Best next step · {region.name}</span>
          <span className="hero-cta-title">
            <span aria-hidden="true">🎬 </span>Where can I watch?
          </span>
          <span className="hero-cta-sub">
            Opens JustWatch — Netflix, Prime, Disney+, free-to-air, rent &amp; buy for your country.
          </span>
        </span>
        <span className="hero-cta-arrow" aria-hidden="true">
          →
        </span>
      </a>

      <p className="pathway-note">
        We don’t know live availability — JustWatch is the best check; other buttons open a search
        on that service.
      </p>

      <section className="path-section path-section-cinema" aria-labelledby={`cinema-${movie.id}`}>
        <div className="path-section-head">
          <span className="step-num" aria-hidden="true">
            {nextStep()}
          </span>
          <span className="path-badge path-cinema">
            <span aria-hidden="true">🎟️ </span>Cinema
          </span>
          <h3 id={`cinema-${movie.id}`}>In cinemas</h3>
        </div>
        <p className="path-section-desc">
          If it’s on the big screen, find sessions near <strong>{placeLabel}</strong>. Search only —
          we don’t scrape live showtimes.
        </p>

        <label className="suburb-field" htmlFor={`suburb-${movie.id}`}>
          <span className="suburb-label">Suburb / area</span>
          <input
            id={`suburb-${movie.id}`}
            type="text"
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
            placeholder={hint}
            autoComplete="address-level2"
          />
        </label>

        <a className="cinema-cta" href={showtimesUrl} target="_blank" rel="noopener noreferrer">
          <span className="cinema-cta-icon" aria-hidden="true">
            🎟️
          </span>
          <span className="cinema-cta-body">
            <span className="cinema-cta-title">Find sessions near me</span>
            <span className="cinema-cta-sub">
              Google · “{movie.title} showtimes near {placeLabel}”
            </span>
          </span>
          <span className="cinema-cta-arrow" aria-hidden="true">
            →
          </span>
        </a>

        {showAuCinemas ? (
          <div className="store-btn-grid" style={{ marginTop: '0.75rem' }}>
            <StoreButton
              href={villageCinemasSearchUrl(movie)}
              label="Village Cinemas"
              hint="May not be screening"
              path="cinema"
            />
            <StoreButton href={hoytsSearchUrl(movie)} label="HOYTS" hint="May not be screening" path="cinema" />
            <StoreButton
              href={eventCinemasSearchUrl(movie)}
              label="Event Cinemas"
              hint="May not be screening"
              path="cinema"
            />
          </div>
        ) : null}
      </section>

      {movie.free.available && movie.free.links.length > 0 ? (
        <section className="path-section" aria-labelledby={`free-known-${movie.id}`}>
          <div className="path-section-head">
            <span className="step-num" aria-hidden="true">
              {nextStep()}
            </span>
            <span className="path-badge path-free">
              <span aria-hidden="true">🌿 </span>Free
            </span>
            <h3 id={`free-known-${movie.id}`}>Known free / public domain</h3>
          </div>
          <p className="path-section-desc">{movie.free.note}</p>
          <div className="store-btn-grid">
            {movie.free.links.map((link) => (
              <StoreButton
                key={`${link.label}-${link.url}`}
                href={link.url}
                label={link.label}
                hint="Free"
                path="free"
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="path-section" aria-labelledby={`fta-${movie.id}`}>
        <div className="path-section-head">
          <span className="step-num" aria-hidden="true">
            {nextStep()}
          </span>
          <span className="path-badge path-free">
            <span aria-hidden="true">📺 </span>Free
          </span>
          <h3 id={`fta-${movie.id}`}>Or try free / free-to-air</h3>
        </div>
        <p className="path-section-desc">
          Search only — we don’t claim this title is listed.
          {!movie.free.available && movie.free.note ? ` ${movie.free.note}` : ''}
        </p>
        <div className="store-btn-grid">
          <StoreButton
            href={internetArchiveMoviesSearchUrl(movie)}
            label="Internet Archive"
            hint="Public domain?"
            path="free"
          />
          {region.showAuFta ? (
            <>
              <StoreButton href={sbsOnDemandSearchUrl(movie)} label="SBS On Demand" hint="Check if listed" path="free" />
              <StoreButton href={abcIviewSearchUrl(movie)} label="ABC iview" hint="Check if listed" path="free" />
              <StoreButton href={sevenPlusSearchUrl(movie)} label="7plus" hint="Check if listed" path="free" />
              <StoreButton href={nineNowSearchUrl(movie)} label="9Now" hint="Check if listed" path="free" />
              <StoreButton href={tenPlaySearchUrl(movie)} label="10 Play" hint="Check if listed" path="free" />
            </>
          ) : (
            <p className="path-section-desc muted" style={{ gridColumn: '1 / -1', margin: 0 }}>
              Switch region to Australia for FTA catch-up apps.
            </p>
          )}
        </div>
      </section>

      <section className="path-section" aria-labelledby={`stream-${movie.id}`}>
        <div className="path-section-head">
          <span className="step-num" aria-hidden="true">
            {nextStep()}
          </span>
          <span className="path-badge path-stream">
            <span aria-hidden="true">📡 </span>Stream
          </span>
          <h3 id={`stream-${movie.id}`}>Stream (subscription)</h3>
        </div>
        <p className="path-section-desc">Opens a search — check if listed.</p>
        <div className="store-btn-grid">
          <StoreButton href={netflixSearchUrl(movie)} label="Netflix" hint="Check if listed" path="stream" />
          <StoreButton href={primeVideoSearchUrl(movie)} label="Prime Video" hint="Check if listed" path="stream" />
          <StoreButton href={disneyPlusSearchUrl(movie)} label="Disney+" hint="Check if listed" path="stream" />
          {showAuStreamers ? (
            <>
              <StoreButton href={stanSearchUrl(movie)} label="Stan" hint="Check if listed" path="stream" />
              <StoreButton href={bingeSearchUrl(movie)} label="Binge" hint="Check if listed" path="stream" />
            </>
          ) : null}
          <StoreButton href={appleTvSearchUrl(movie, region)} label="Apple TV+" hint="Check if listed" path="stream" />
        </div>
      </section>

      <section className="path-section" aria-labelledby={`borrow-${movie.id}`}>
        <div className="path-section-head">
          <span className="step-num" aria-hidden="true">
            {nextStep()}
          </span>
          <span className="path-badge path-borrow">
            <span aria-hidden="true">📚 </span>Borrow
          </span>
          <h3 id={`borrow-${movie.id}`}>Borrow (library)</h3>
        </div>
        <p className="path-section-desc">Often needs a library card. Stock varies.</p>
        <div className="store-btn-grid">
          <StoreButton href={kanopySearchUrl(movie)} label="Kanopy" hint="Library" path="borrow" />
          <StoreButton href={beamafilmSearchUrl(movie)} label="Beamafilm" hint="Library" path="borrow" />
        </div>
      </section>

      <section className="path-section" aria-labelledby={`rent-${movie.id}`}>
        <div className="path-section-head">
          <span className="step-num" aria-hidden="true">
            {nextStep()}
          </span>
          <span className="path-badge path-buy">
            <span aria-hidden="true">🛒 </span>Buy
          </span>
          <h3 id={`rent-${movie.id}`}>Rent or buy</h3>
        </div>
        <p className="path-section-desc">Prices &amp; rights vary — verify on the store.</p>
        <div className="store-btn-grid">
          <StoreButton href={appleTvSearchUrl(movie, region)} label="Apple TV" hint="See store" path="buy" />
          <StoreButton href={googlePlayMoviesSearchUrl(movie)} label="Google Play" hint="See store" path="buy" />
          <StoreButton href={youtubeMoviesSearchUrl(movie)} label="YouTube Movies" hint="See store" path="buy" />
          <StoreButton href={amazonMovieSearchUrl(movie, region)} label={amazonLabel(region)} hint="See store" path="buy" />
        </div>
      </section>
    </div>
  )
}
