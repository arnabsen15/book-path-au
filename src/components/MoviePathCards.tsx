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

function MoreDetails({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <details className="more-stores">
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
    <div className="movie-paths">
      <p className="pathway-note global-trust">
        Search links only — we don’t track live availability.
      </p>

      <nav className="path-jump" aria-label="Paths">
        <a href={`#stream-${movie.id}`}>Stream</a>
        <a href={`#free-${movie.id}`}>Free</a>
        <a href={`#borrow-${movie.id}`}>Borrow</a>
        <a href={`#cinema-${movie.id}`}>Cinema</a>
        <a href={`#buy-${movie.id}`}>Buy</a>
      </nav>

      <section className="path-section path-section-stream" id={`stream-${movie.id}`} aria-labelledby={`stream-h-${movie.id}`}>
        <div className="path-section-head">
          <span className="path-badge path-stream">
            <span aria-hidden="true">📡 </span>Stream
          </span>
          <h3 id={`stream-h-${movie.id}`}>Stream</h3>
        </div>
        <a className="hero-cta" href={justWatchUrl} target="_blank" rel="noopener noreferrer">
          <span className="hero-cta-body">
            <span className="hero-cta-kicker">Recommended · {region.name}</span>
            <span className="hero-cta-title">Search on JustWatch</span>
            <span className="hero-cta-sub">Best next step — where it’s listed to stream, rent, or buy.</span>
          </span>
          <span className="hero-cta-arrow" aria-hidden="true">
            →
          </span>
        </a>
        <MoreDetails summary="More stores">
          <div className="store-btn-grid">
            <StoreButton href={netflixSearchUrl(movie)} label="Search on Netflix" path="stream" />
            <StoreButton href={primeVideoSearchUrl(movie)} label="Search on Prime Video" path="stream" />
            <StoreButton href={disneyPlusSearchUrl(movie)} label="Search on Disney+" path="stream" />
            {showAuStreamers ? (
              <>
                <StoreButton href={stanSearchUrl(movie)} label="Search on Stan" path="stream" />
                <StoreButton href={bingeSearchUrl(movie)} label="Search on Binge" path="stream" />
              </>
            ) : null}
            <StoreButton
              href={appleTvSearchUrl(movie, region)}
              label="Search on Apple TV+"
              path="stream"
            />
          </div>
        </MoreDetails>
      </section>

      <section className="path-section" id={`free-${movie.id}`} aria-labelledby={`free-h-${movie.id}`}>
        <div className="path-section-head">
          <span className="path-badge path-free">
            <span aria-hidden="true">🌿 </span>Free
          </span>
          <h3 id={`free-h-${movie.id}`}>Free</h3>
        </div>
        {movie.free.available && movie.free.links.length > 0 ? (
          <>
            <p className="path-section-desc">{movie.free.note}</p>
            <div className="store-btn-grid">
              {movie.free.links.slice(0, 2).map((link) => (
                <StoreButton
                  key={`${link.label}-${link.url}`}
                  href={link.url}
                  label={link.label.startsWith('Search') ? link.label : `Search on ${link.label}`}
                  hint="Free"
                  path="free"
                />
              ))}
            </div>
            {movie.free.links.length > 2 ? (
              <MoreDetails summary="More free sources">
                <div className="store-btn-grid">
                  {movie.free.links.slice(2).map((link) => (
                    <StoreButton
                      key={`${link.label}-${link.url}`}
                      href={link.url}
                      label={link.label.startsWith('Search') ? link.label : `Search on ${link.label}`}
                      hint="Free"
                      path="free"
                    />
                  ))}
                </div>
              </MoreDetails>
            ) : null}
          </>
        ) : (
          <>
            <StoreButton
              href={internetArchiveMoviesSearchUrl(movie)}
              label="Search on Internet Archive"
              hint="Public domain?"
              path="free"
            />
            {!movie.free.available && movie.free.note ? (
              <p className="path-section-desc muted">{movie.free.note}</p>
            ) : null}
          </>
        )}

        {region.showAuFta ? (
          <MoreDetails summary="Free catch-up TV (AU)">
            <p className="path-section-desc">
              Best from Australia. Search only — we don’t claim this title is listed.
            </p>
            <div className="store-btn-grid">
              <StoreButton href={sbsOnDemandSearchUrl(movie)} label="Search on SBS On Demand" path="free" />
              <StoreButton href={abcIviewSearchUrl(movie)} label="Search on ABC iview" path="free" />
              <StoreButton
                href={sevenPlusSearchUrl(movie)}
                label="7plus (Google search)"
                hint="No deep-link"
                path="free"
              />
              <StoreButton
                href={nineNowSearchUrl(movie)}
                label="Search on 9Now"
                hint="Best from Australia"
                path="free"
              />
              <StoreButton
                href={tenPlaySearchUrl(movie)}
                label="10 Play (Google search)"
                hint="Stays on 10play"
                path="free"
              />
            </div>
          </MoreDetails>
        ) : (
          <p className="path-section-desc muted">Switch region to Australia for FTA catch-up apps.</p>
        )}
      </section>

      <section className="path-section" id={`borrow-${movie.id}`} aria-labelledby={`borrow-h-${movie.id}`}>
        <div className="path-section-head">
          <span className="path-badge path-borrow">
            <span aria-hidden="true">📚 </span>Borrow
          </span>
          <h3 id={`borrow-h-${movie.id}`}>Borrow</h3>
        </div>
        <StoreButton href={kanopySearchUrl(movie)} label="Search on Kanopy" hint="Library" path="borrow" />
        <MoreDetails summary="More libraries">
          <div className="store-btn-grid">
            <StoreButton
              href={beamafilmSearchUrl(movie)}
              label="Search on Beamafilm"
              hint="Library"
              path="borrow"
            />
          </div>
        </MoreDetails>
      </section>

      <section
        className="path-section path-section-cinema"
        id={`cinema-${movie.id}`}
        aria-labelledby={`cinema-h-${movie.id}`}
      >
        <div className="path-section-head">
          <span className="path-badge path-cinema">
            <span aria-hidden="true">🎟️ </span>Cinema
          </span>
          <h3 id={`cinema-h-${movie.id}`}>Cinema</h3>
        </div>
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
          <span className="cinema-cta-body">
            <span className="cinema-cta-title">Find sessions near {placeLabel}</span>
            <span className="cinema-cta-sub">Google showtimes search</span>
          </span>
          <span className="cinema-cta-arrow" aria-hidden="true">
            →
          </span>
        </a>
        {showAuCinemas ? (
          <MoreDetails summary="More cinemas">
            <div className="store-btn-grid">
              <StoreButton
                href={villageCinemasSearchUrl(movie)}
                label="Village (Google search)"
                path="cinema"
              />
              <StoreButton href={hoytsSearchUrl(movie)} label="HOYTS (Google search)" path="cinema" />
              <StoreButton
                href={eventCinemasSearchUrl(movie)}
                label="Event (Google search)"
                path="cinema"
              />
            </div>
          </MoreDetails>
        ) : null}
      </section>

      <section className="path-section" id={`buy-${movie.id}`} aria-labelledby={`buy-h-${movie.id}`}>
        <div className="path-section-head">
          <span className="path-badge path-buy">
            <span aria-hidden="true">🛒 </span>Buy
          </span>
          <h3 id={`buy-h-${movie.id}`}>Rent or buy</h3>
        </div>
        <div className="store-btn-grid">
          <StoreButton
            href={appleTvSearchUrl(movie, region)}
            label="Search on Apple TV"
            path="buy"
          />
          <StoreButton href={googlePlayMoviesSearchUrl(movie)} label="Search on Google Play" path="buy" />
          <StoreButton
            href={amazonMovieSearchUrl(movie, region)}
            label={amazonSearchLabel(region)}
            path="buy"
          />
        </div>
        <MoreDetails summary="More…">
          <div className="store-btn-grid">
            <StoreButton href={youtubeMoviesSearchUrl(movie)} label="Search on YouTube Movies" path="buy" />
          </div>
        </MoreDetails>
      </section>
    </div>
  )
}
