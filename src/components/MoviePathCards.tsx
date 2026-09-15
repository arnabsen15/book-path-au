import type { ReactNode } from 'react'
import { useRegion } from '../context/RegionContext'
import { useSuburb } from '../hooks/useSuburb'
import type { Movie } from '../types'
import { amazonSearchLabel } from '../utils/links'
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

function MoreDetails({
  summary,
  children,
  className,
}: {
  summary: string
  children: ReactNode
  className?: string
}) {
  return (
    <details className={`more-stores${className ? ` ${className}` : ''}`}>
      <summary>{summary}</summary>
      <div className="more-stores-body">{children}</div>
    </details>
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

  return (
    <div className="movie-decision">
      <div className="decision-header">
        <div className="decision-poster" aria-hidden={!movie.coverUrl}>
          {movie.coverUrl ? (
            <img
              className="decision-poster-img"
              src={movie.coverUrl}
              alt=""
              loading="lazy"
              width={96}
              height={144}
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <div className="decision-poster-img placeholder">🎬</div>
          )}
        </div>
        <div className="decision-header-text">
          <h3 className="decision-title">{movie.title}</h3>
          <p className="decision-year">{movie.year ? String(movie.year) : 'Film'}</p>
        </div>
      </div>

      <section className="decision-step decision-step-primary" aria-labelledby={`jw-${movie.id}`}>
        <p className="decision-step-label" id={`jw-${movie.id}`}>
          Step 1 · Best next step
        </p>
        <a className="hero-cta decision-jw-hero" href={justWatchUrl} target="_blank" rel="noopener noreferrer">
          <span className="hero-cta-body">
            <span className="hero-cta-title">See where it’s streaming</span>
            <span className="hero-cta-sub">
              Netflix, Prime, Disney+, free TV, rent &amp; buy for your country
            </span>
          </span>
          <span className="hero-cta-arrow" aria-hidden="true">
            →
          </span>
        </a>
        <p className="decision-jw-helper">Opens JustWatch for {region.name}</p>
      </section>

      <section className="decision-step decision-step-secondary" aria-label="Other ways to watch">
        <p className="decision-step-label">Step 2 · Or try one of these</p>
        <div className="decision-card-row">
          <div className="decision-card decision-card-cinema">
            <div className="decision-card-icon" aria-hidden="true">
              🎟️
            </div>
            <h4 className="decision-card-title">Cinema near me</h4>
            <label className="suburb-field suburb-field-compact" htmlFor={`suburb-${movie.id}`}>
              <span className="sr-only">Suburb / area</span>
              <input
                id={`suburb-${movie.id}`}
                type="text"
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
                placeholder={hint}
                autoComplete="address-level2"
                onClick={(e) => e.stopPropagation()}
              />
            </label>
            <a className="decision-card-cta" href={showtimesUrl} target="_blank" rel="noopener noreferrer">
              Showtimes near {placeLabel} →
            </a>
          </div>

          <div className="decision-card decision-card-fta">
            <div className="decision-card-icon" aria-hidden="true">
              🌿
            </div>
            <h4 className="decision-card-title">Free catch-up TV</h4>
            {region.showAuFta ? (
              <MoreDetails summary="Search FTA apps" className="fta-panel">
                <div className="store-btn-grid">
                  <StoreButton href={sbsOnDemandSearchUrl(movie)} label="SBS On Demand" path="free" />
                  <StoreButton href={abcIviewSearchUrl(movie)} label="ABC iview" path="free" />
                  <StoreButton href={sevenPlusSearchUrl(movie)} label="7plus" hint="Google site search" path="free" />
                  <StoreButton href={nineNowSearchUrl(movie)} label="9Now" path="free" />
                  <StoreButton href={tenPlaySearchUrl(movie)} label="10 Play" hint="Google site search" path="free" />
                </div>
              </MoreDetails>
            ) : (
              <p className="decision-card-note">Switch region to Australia for FTA apps.</p>
            )}
          </div>

          <div className="decision-card decision-card-buy">
            <div className="decision-card-icon" aria-hidden="true">
              🛒
            </div>
            <h4 className="decision-card-title">Rent or buy</h4>
            <div className="store-btn-grid store-btn-grid-stack">
              <StoreButton href={appleTvSearchUrl(movie, region)} label="Apple TV" path="buy" />
              <StoreButton href={googlePlayMoviesSearchUrl(movie)} label="Google Play" path="buy" />
              <StoreButton href={youtubeMoviesSearchUrl(movie)} label="YouTube Movies" path="buy" />
            </div>
            <MoreDetails summary="More stores">
              <div className="store-btn-grid store-btn-grid-stack">
                <StoreButton
                  href={amazonMovieSearchUrl(movie, region)}
                  label={amazonSearchLabel(region)}
                  path="buy"
                />
              </div>
            </MoreDetails>
          </div>
        </div>
      </section>

      <MoreDetails summary="More options" className="decision-more">
        <div className="decision-more-grid">
          <StoreButton href={netflixSearchUrl(movie)} label="Netflix" path="stream" />
          <StoreButton href={primeVideoSearchUrl(movie)} label="Prime Video" path="stream" />
          <StoreButton href={disneyPlusSearchUrl(movie)} label="Disney+" path="stream" />
          {showAuStreamers ? (
            <>
              <StoreButton href={stanSearchUrl(movie)} label="Stan" path="stream" />
              <StoreButton href={bingeSearchUrl(movie)} label="Binge" path="stream" />
            </>
          ) : null}
          <StoreButton href={kanopySearchUrl(movie)} label="Kanopy" hint="Library" path="borrow" />
          <StoreButton href={beamafilmSearchUrl(movie)} label="Beamafilm" hint="Library" path="borrow" />
          <StoreButton
            href={internetArchiveMoviesSearchUrl(movie)}
            label="Internet Archive"
            hint="Public domain?"
            path="free"
          />
          {movie.free.available && movie.free.links.length > 0
            ? movie.free.links.map((link) => (
                <StoreButton
                  key={`${link.label}-${link.url}`}
                  href={link.url}
                  label={link.label}
                  hint="Free"
                  path="free"
                />
              ))
            : null}
          {showAuCinemas ? (
            <>
              <StoreButton href={villageCinemasSearchUrl(movie)} label="Village Cinemas" path="cinema" />
              <StoreButton href={hoytsSearchUrl(movie)} label="HOYTS" path="cinema" />
              <StoreButton href={eventCinemasSearchUrl(movie)} label="Event Cinemas" path="cinema" />
            </>
          ) : null}
        </div>
        <p className="decision-trust">Search links only — we don’t track live availability.</p>
      </MoreDetails>
    </div>
  )
}
