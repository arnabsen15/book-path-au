import { useState, type ReactNode } from 'react'
import { useRegion } from '../context/RegionContext'
import type { Book } from '../types'
import { PRICES_DISCLAIMER, formatAud, formatPricesUpdated } from '../types'
import {
  amazonAuSearchUrl,
  amazonSearchLabel,
  audibleAuSearchUrl,
  audibleLabel,
  booktopiaSearchUrl,
  dymocksSearchUrl,
  readingsSearchUrl,
  googlePlayAudiobookSearchUrl,
  googlePlayBooksSearchUrl,
  kindleAuSearchUrl,
  appleBooksSearchUrl,
  libbyUrl,
  spotifyAudiobookSearchUrl,
  troveSearchUrl,
} from '../utils/links'

interface PathCardsProps {
  book: Book
}

function PriceTag({ amount, label }: { amount?: number; label?: string }) {
  if (label) {
    return (
      <span className={`price-tag ${label === 'Free' ? 'free-tag' : label === 'Library' ? 'library-tag' : ''}`}>
        {label}
      </span>
    )
  }
  if (typeof amount === 'number') {
    return <span className="price-tag">{formatAud(amount)}</span>
  }
  return <span className="price-tag">See store</span>
}

function MoreDetails({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <details className="more-stores">
      <summary>{summary}</summary>
      <div className="more-stores-body">{children}</div>
    </details>
  )
}

export function PathCards({ book }: PathCardsProps) {
  const { region } = useRegion()
  const librivox = book.audiobook?.librivox
  const p = book.indicativePrices
  const updated = formatPricesUpdated(book.pricesUpdated)
  const audibleUrl = audibleAuSearchUrl(book, region)
  const [showPrices, setShowPrices] = useState(false)

  const primaryFree = book.free.links.slice(0, 2)
  const moreFree = book.free.links.slice(2)

  return (
    <div className="path-grid">
      <p className="pathway-note global-trust">
        Search links only — we don’t track live availability.
      </p>

      <nav className="path-jump" aria-label="Paths">
        <a href={`#free-${book.id}`}>Free</a>
        <a href={`#borrow-${book.id}`}>Borrow</a>
        <a href={`#listen-${book.id}`}>Listen</a>
        <a href={`#buy-${book.id}`}>Buy</a>
      </nav>

      <article className="path-card path-free" id={`free-${book.id}`}>
        <h3>
          <span className="path-badge path-free">
            <span aria-hidden="true">🌿 </span>Free
          </span>
        </h3>
        {book.free.available ? (
          <>
            <p className="path-section-desc">{book.free.note}</p>
            <ul className="link-list">
              {primaryFree.map((link) => (
                <li key={`${link.label}-${link.url}`}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    Search on {link.label}
                  </a>
                  <PriceTag label="Free" />
                </li>
              ))}
            </ul>
            {moreFree.length > 0 ? (
              <MoreDetails summary="More free sources">
                <ul className="link-list">
                  {moreFree.map((link) => (
                    <li key={`${link.label}-${link.url}`}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        Search on {link.label}
                      </a>
                      <PriceTag label="Free" />
                    </li>
                  ))}
                </ul>
              </MoreDetails>
            ) : null}
          </>
        ) : (
          <p className="muted">{book.free.note || 'Not available free legally.'}</p>
        )}
      </article>

      <article className="path-card path-borrow" id={`borrow-${book.id}`}>
        <h3>
          <span className="path-badge path-borrow">
            <span aria-hidden="true">📚 </span>Borrow
          </span>
        </h3>
        <ul className="link-list">
          {region.code === 'AU' || region.code === 'NZ' ? (
            <li>
              <a href={troveSearchUrl(book)} target="_blank" rel="noopener noreferrer">
                Search Trove (NLA)
              </a>
              <PriceTag label="Library" />
            </li>
          ) : (
            <li>
              <a href={libbyUrl()} target="_blank" rel="noopener noreferrer">
                Open Libby / library apps
              </a>
              <PriceTag label="Library" />
            </li>
          )}
        </ul>
        <MoreDetails summary="More libraries">
          <ul className="link-list">
            {(region.code === 'AU' || region.code === 'NZ') && (
              <li>
                <a href={libbyUrl()} target="_blank" rel="noopener noreferrer">
                  Open Libby / library apps
                </a>
                <PriceTag label="Library" />
              </li>
            )}
            <li>
              <span className="muted">Ask your library about ebook and print holds.</span>
            </li>
          </ul>
        </MoreDetails>
      </article>

      <article className="path-card path-listen" id={`listen-${book.id}`}>
        <h3>
          <span className="path-badge path-listen">
            <span aria-hidden="true">🎧 </span>Listen
          </span>
        </h3>
        {librivox ? (
          <ul className="link-list">
            <li>
              <a href={librivox.url} target="_blank" rel="noopener noreferrer">
                Search on {librivox.label}
              </a>
              <PriceTag label="Free" />
            </li>
          </ul>
        ) : (
          <p className="muted">No free legal audiobook listed.</p>
        )}
        <ul className="link-list">
          <li>
            <a href={libbyUrl()} target="_blank" rel="noopener noreferrer">
              Open Libby / library apps
            </a>
            <PriceTag label="Library" />
          </li>
        </ul>
        <MoreDetails summary="More listen options">
          <ul className="link-list">
            {audibleUrl ? (
              <li>
                <a href={audibleUrl} target="_blank" rel="noopener noreferrer">
                  Search on {audibleLabel(region)}
                </a>
                {showPrices ? <PriceTag amount={p?.audible} /> : null}
              </li>
            ) : null}
            <li>
              <a href={googlePlayAudiobookSearchUrl(book)} target="_blank" rel="noopener noreferrer">
                Search on Google Play Audiobooks
              </a>
            </li>
            <li>
              <a href={spotifyAudiobookSearchUrl(book)} target="_blank" rel="noopener noreferrer">
                Search on Spotify
              </a>
            </li>
          </ul>
        </MoreDetails>
      </article>

      <article className="path-card path-buy" id={`buy-${book.id}`}>
        <h3>
          <span className="path-badge path-buy">
            <span aria-hidden="true">🛒 </span>Buy
          </span>
        </h3>
        <div className="price-toggle-row">
          <button
            type="button"
            className="chip"
            aria-pressed={showPrices}
            onClick={() => setShowPrices((v) => !v)}
          >
            {showPrices ? 'Hide prices' : 'Show prices'}
          </button>
        </div>
        {showPrices ? (
          <>
            <p className="disclaimer">{PRICES_DISCLAIMER}</p>
            {updated ? <p className="prices-updated">Prices last updated: {updated}</p> : null}
          </>
        ) : null}
        <ul className="link-list">
          <li>
            <a href={amazonAuSearchUrl(book, region)} target="_blank" rel="noopener noreferrer">
              {amazonSearchLabel(region)}
            </a>
            {showPrices ? <PriceTag amount={p?.amazonAu} /> : null}
          </li>
          <li>
            <a href={kindleAuSearchUrl(book, region)} target="_blank" rel="noopener noreferrer">
              Search Kindle
            </a>
            {showPrices ? <PriceTag amount={p?.kindle} /> : null}
          </li>
          <li>
            <a href={googlePlayBooksSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Search Google Play Books
            </a>
            {showPrices ? <PriceTag amount={p?.googlePlay} /> : null}
          </li>
          {region.showAuBookRetailers ? (
            <li>
              <a href={booktopiaSearchUrl(book)} target="_blank" rel="noopener noreferrer">
                Search Booktopia
              </a>
              {showPrices ? <PriceTag amount={p?.booktopia} /> : null}
            </li>
          ) : null}
        </ul>
        <MoreDetails summary="Advanced / Google site search">
          <ul className="link-list">
            <li>
              <a href={appleBooksSearchUrl(book, region)} target="_blank" rel="noopener noreferrer">
                Search on Apple
              </a>
              {showPrices ? <PriceTag amount={p?.appleBooks} /> : null}
            </li>
            {region.showAuBookRetailers ? (
              <>
                <li>
                  <a href={dymocksSearchUrl(book)} target="_blank" rel="noopener noreferrer">
                    Dymocks (Google search)
                  </a>
                  {showPrices ? <PriceTag amount={p?.dymocks} /> : null}
                </li>
                <li>
                  <a href={readingsSearchUrl(book)} target="_blank" rel="noopener noreferrer">
                    Readings (Google search)
                  </a>
                  {showPrices ? <PriceTag amount={p?.readings} /> : null}
                </li>
              </>
            ) : null}
          </ul>
        </MoreDetails>
      </article>
    </div>
  )
}
