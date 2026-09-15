import type { Book } from '../types'
import { PRICES_DISCLAIMER, formatAud, formatPricesUpdated } from '../types'
import {
  amazonAuSearchUrl,
  audibleAuSearchUrl,
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

export function PathCards({ book }: PathCardsProps) {
  const librivox = book.audiobook?.librivox
  const p = book.indicativePrices
  const updated = formatPricesUpdated(book.pricesUpdated)

  return (
    <div className="path-grid">
      <article className="path-card path-free">
        <h3>Free</h3>
        {book.free.available ? (
          <>
            <p>{book.free.note}</p>
            <ul className="link-list">
              {book.free.links.map((link) => (
                <li key={`${link.label}-${link.url}`}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                  <PriceTag label="Free" />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="muted">{book.free.note || 'Not available free legally.'}</p>
            {book.free.links.length > 0 && (
              <ul className="link-list">
                {book.free.links.map((link) => (
                  <li key={`${link.label}-${link.url}`}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </article>

      <article className="path-card path-borrow">
        <h3>Borrow</h3>
        <p>
          Check your local library catalogue — for example Wyndham Library or Yarra Plenty
          Regional Library (YPRL). We don’t track live stock.
        </p>
        <ul className="link-list">
          <li>
            <a href={troveSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Search Trove (NLA)
            </a>
            <PriceTag label="Library" />
          </li>
        </ul>
        <p className="hint">Tip: ask your library about ebook and print holds.</p>
      </article>

      <article className="path-card path-listen">
        <h3>Listen</h3>
        {librivox ? (
          <>
            <p>Free public-domain audiobook may be available:</p>
            <ul className="link-list">
              <li>
                <a href={librivox.url} target="_blank" rel="noopener noreferrer">
                  {librivox.label}
                </a>
                <PriceTag label="Free" />
              </li>
            </ul>
          </>
        ) : (
          <p className="muted">No free legal audiobook listed for this title.</p>
        )}
        <p>
          Borrow via Libby, BorrowBox, or OverDrive with your library card. Availability
          varies by library — we don’t claim live stock.
        </p>
        <ul className="link-list">
          <li>
            <a href={libbyUrl()} target="_blank" rel="noopener noreferrer">
              Libby
            </a>
            <PriceTag label="Library" />
          </li>
          <li>
            <a href={troveSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Trove / library search
            </a>
            <PriceTag label="Library" />
          </li>
        </ul>
        <p className="hint">Buy or stream (we don’t host audio):</p>
        <ul className="link-list">
          <li>
            <a href={audibleAuSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Audible.au
            </a>
            <PriceTag amount={p?.audible} />
          </li>
          <li>
            <a href={googlePlayAudiobookSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Google Play Audiobooks
            </a>
            <PriceTag />
          </li>
          <li>
            <a href={spotifyAudiobookSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Spotify
            </a>
            <PriceTag />
          </li>
        </ul>
      </article>

      <article className="path-card path-buy">
        <h3>Buy</h3>
        <p className="disclaimer">{PRICES_DISCLAIMER}</p>
        {updated ? <p className="prices-updated">Prices last updated: {updated}</p> : null}
        <ul className="link-list">
          <li>
            <a href={amazonAuSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Amazon.au
            </a>
            <PriceTag amount={p?.amazonAu} />
          </li>
          <li>
            <a href={kindleAuSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Kindle
            </a>
            <PriceTag amount={p?.kindle} />
          </li>
          <li>
            <a href={googlePlayBooksSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Google Play Books
            </a>
            <PriceTag amount={p?.googlePlay} />
          </li>
          <li>
            <a href={appleBooksSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Apple Books
            </a>
            <PriceTag amount={p?.appleBooks} />
          </li>
          <li>
            <a href={booktopiaSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Booktopia
            </a>
            <PriceTag amount={p?.booktopia} />
          </li>
          <li>
            <a href={dymocksSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Dymocks
            </a>
            <PriceTag amount={p?.dymocks} />
          </li>
          <li>
            <a href={readingsSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Readings
            </a>
            <PriceTag amount={p?.readings} />
          </li>
        </ul>
      </article>
    </div>
  )
}
