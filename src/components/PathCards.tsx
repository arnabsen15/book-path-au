import type { Book } from '../types'
import {
  amazonAuSearchUrl,
  audibleAuSearchUrl,
  booktopiaSearchUrl,
  dymocksSearchUrl,
  readingsSearchUrl,
  googlePlayAudiobookSearchUrl,
  libbyUrl,
  spotifyAudiobookSearchUrl,
  troveSearchUrl,
} from '../utils/links'

interface PathCardsProps {
  book: Book
}

export function PathCards({ book }: PathCardsProps) {
  const librivox = book.audiobook?.librivox

  return (
    <div className="path-grid">
      <article className="path-card path-free">
        <h3>Free</h3>
        {book.free.available ? (
          <>
            <p>{book.free.note}</p>
            <ul className="link-list">
              {book.free.links.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="muted">{book.free.note || 'Not available free legally.'}</p>
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
          </li>
          <li>
            <a href={troveSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Trove / library search
            </a>
          </li>
        </ul>
        <p className="hint">Buy or stream (we don’t host audio):</p>
        <ul className="link-list">
          <li>
            <a href={audibleAuSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Audible.au
            </a>
          </li>
          <li>
            <a href={googlePlayAudiobookSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Google Play Audiobooks
            </a>
          </li>
          <li>
            <a href={spotifyAudiobookSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Spotify
            </a>
          </li>
        </ul>
      </article>

      <article className="path-card path-buy">
        <h3>Buy</h3>
        <p className="disclaimer">
          Prices and delivery are on the retailer’s site. We don’t sell or ship books.
        </p>
        <ul className="link-list">
          <li>
            <a href={amazonAuSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Amazon.au
            </a>
          </li>
          <li>
            <a href={booktopiaSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Booktopia
            </a>
          </li>
          <li>
            <a href={dymocksSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Dymocks
            </a>
          </li>
          <li>
            <a href={readingsSearchUrl(book)} target="_blank" rel="noopener noreferrer">
              Readings
            </a>
          </li>
        </ul>
      </article>
    </div>
  )
}
