import { useRegion } from '../context/RegionContext'
import type { Movie } from '../types'
import { amazonLabel } from '../utils/links'
import {
  abcIviewSearchUrl,
  amazonMovieSearchUrl,
  appleTvSearchUrl,
  beamafilmSearchUrl,
  cinemaShowtimesSearchUrl,
  googlePlayMoviesSearchUrl,
  internetArchiveMoviesSearchUrl,
  justWatchSearchUrl,
  kanopySearchUrl,
  netflixSearchUrl,
  nineNowSearchUrl,
  primeVideoSearchUrl,
  sbsOnDemandSearchUrl,
  sevenPlusSearchUrl,
  tenPlaySearchUrl,
  youtubeMoviesSearchUrl,
} from '../utils/movieLinks'

interface MoviePathCardsProps {
  movie: Movie
}

export function MoviePathCards({ movie }: MoviePathCardsProps) {
  const { region } = useRegion()

  return (
    <div className="path-grid">
      <article className="path-card path-free">
        <h3>Free</h3>
        {movie.free.available ? (
          <>
            <p>{movie.free.note}</p>
            <ul className="link-list">
              {movie.free.links.map((link) => (
                <li key={`${link.label}-${link.url}`}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                  <span className="price-tag free-tag">Free</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="muted">{movie.free.note || 'Not free legally.'}</p>
        )}
        <p className="hint">Also check Internet Archive for possible public-domain copies:</p>
        <ul className="link-list">
          <li>
            <a href={internetArchiveMoviesSearchUrl(movie)} target="_blank" rel="noopener noreferrer">
              Search Internet Archive
            </a>
          </li>
        </ul>

        {region.showAuFta ? (
          <>
            <p className="hint" style={{ marginTop: '0.75rem' }}>
              Free with ads / FTA catch-up (AU) — search only; we don’t claim this title is listed:
            </p>
            <ul className="link-list">
              <li>
                <a href={sbsOnDemandSearchUrl(movie)} target="_blank" rel="noopener noreferrer">
                  SBS On Demand
                </a>
              </li>
              <li>
                <a href={abcIviewSearchUrl(movie)} target="_blank" rel="noopener noreferrer">
                  ABC iview
                </a>
              </li>
              <li>
                <a href={sevenPlusSearchUrl(movie)} target="_blank" rel="noopener noreferrer">
                  7plus
                </a>
              </li>
              <li>
                <a href={nineNowSearchUrl(movie)} target="_blank" rel="noopener noreferrer">
                  9Now
                </a>
              </li>
              <li>
                <a href={tenPlaySearchUrl(movie)} target="_blank" rel="noopener noreferrer">
                  10 Play
                </a>
              </li>
            </ul>
          </>
        ) : (
          <p className="hint" style={{ marginTop: '0.75rem' }}>
            Australian free-to-air catch-up apps are hidden for {region.name}. Switch region to
            Australia to see SBS / iview / 7plus / 9Now / 10 Play search links.
          </p>
        )}
      </article>

      <article className="path-card path-borrow">
        <h3>Borrow</h3>
        <p>
          Library streaming (Kanopy, Beamafilm, and similar) often needs a library card. We don’t
          track live catalogue stock — search links only.
        </p>
        <ul className="link-list">
          <li>
            <a href={kanopySearchUrl(movie)} target="_blank" rel="noopener noreferrer">
              Kanopy search
            </a>
            <span className="price-tag library-tag">Library</span>
          </li>
          <li>
            <a href={beamafilmSearchUrl(movie)} target="_blank" rel="noopener noreferrer">
              Beamafilm search
            </a>
            <span className="price-tag library-tag">Library</span>
          </li>
        </ul>
        <p className="hint">Ask your local library which streaming apps they support.</p>
      </article>

      <article className="path-card path-stream">
        <h3>Stream</h3>
        <p>
          Primary “where to watch” aggregator for {region.name}. Search links only — we don’t claim
          availability on any service.
        </p>
        <ul className="link-list">
          <li>
            <a href={justWatchSearchUrl(movie, region)} target="_blank" rel="noopener noreferrer">
              JustWatch ({region.justWatch.toUpperCase()})
            </a>
            <span className="price-tag">Aggregator</span>
          </li>
        </ul>
        <p className="hint">Also try these storefront searches:</p>
        <ul className="link-list">
          <li>
            <a href={primeVideoSearchUrl(movie)} target="_blank" rel="noopener noreferrer">
              Prime Video
            </a>
          </li>
          <li>
            <a href={appleTvSearchUrl(movie, region)} target="_blank" rel="noopener noreferrer">
              Apple TV
            </a>
          </li>
          <li>
            <a href={googlePlayMoviesSearchUrl(movie)} target="_blank" rel="noopener noreferrer">
              Google Play Movies
            </a>
          </li>
          <li>
            <a href={youtubeMoviesSearchUrl(movie)} target="_blank" rel="noopener noreferrer">
              YouTube Movies
            </a>
          </li>
          <li>
            <a href={netflixSearchUrl(movie)} target="_blank" rel="noopener noreferrer">
              Netflix search
            </a>
          </li>
        </ul>
      </article>

      <article className="path-card path-buy">
        <h3>Buy / rent</h3>
        <p className="disclaimer">Outbound search links — prices and rights vary by region. Verify on the store.</p>
        <ul className="link-list">
          <li>
            <a href={appleTvSearchUrl(movie, region)} target="_blank" rel="noopener noreferrer">
              Apple TV
            </a>
            <span className="price-tag">See store</span>
          </li>
          <li>
            <a href={googlePlayMoviesSearchUrl(movie)} target="_blank" rel="noopener noreferrer">
              Google Play Movies
            </a>
            <span className="price-tag">See store</span>
          </li>
          <li>
            <a href={youtubeMoviesSearchUrl(movie)} target="_blank" rel="noopener noreferrer">
              YouTube Movies
            </a>
            <span className="price-tag">See store</span>
          </li>
          <li>
            <a href={amazonMovieSearchUrl(movie, region)} target="_blank" rel="noopener noreferrer">
              {amazonLabel(region)}
            </a>
            <span className="price-tag">See store</span>
          </li>
        </ul>
        <p className="hint" style={{ marginTop: '0.75rem' }}>
          Cinema (no scraping — Google search only):
        </p>
        <ul className="link-list">
          <li>
            <a href={cinemaShowtimesSearchUrl(movie, region)} target="_blank" rel="noopener noreferrer">
              Check sessions ({region.cinemaCity})
            </a>
          </li>
        </ul>
      </article>
    </div>
  )
}
