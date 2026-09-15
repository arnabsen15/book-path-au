import type { Book } from '../types'
import {
  amazonAuSearchUrl,
  appleBooksSearchUrl,
  audibleAuSearchUrl,
  booktopiaSearchUrl,
  dymocksSearchUrl,
  readingsSearchUrl,
  googlePlayAudiobookSearchUrl,
  googlePlayBooksSearchUrl,
  kindleAuSearchUrl,
  libbyUrl,
  spotifyAudiobookSearchUrl,
  troveSearchUrl,
} from '../utils/links'

interface CompareTableProps {
  book: Book
}

interface CompareRow {
  path: string
  option: string
  format: string
  note: string
  url?: string
  available: boolean
}

export function CompareTable({ book }: CompareTableProps) {
  const rows: CompareRow[] = []

  if (book.free.available) {
    for (const link of book.free.links) {
      rows.push({
        path: 'Free',
        option: link.label,
        format: 'Ebook / text',
        note: 'Public domain or open access',
        url: link.url,
        available: true,
      })
    }
  } else {
    rows.push({
      path: 'Free',
      option: 'Legal free ebook',
      format: '—',
      note: book.free.note || 'Not free legally',
      available: false,
    })
  }

  rows.push({
    path: 'Borrow',
    option: 'Trove (NLA)',
    format: 'Print / ebook search',
    note: 'Find libraries holding this title',
    url: troveSearchUrl(book),
    available: true,
  })
  rows.push({
    path: 'Borrow',
    option: 'Libby / BorrowBox',
    format: 'Ebook / audiobook',
    note: 'Needs your library card; stock varies',
    url: libbyUrl(),
    available: true,
  })

  if (book.audiobook?.librivox) {
    rows.push({
      path: 'Listen',
      option: book.audiobook.librivox.label,
      format: 'Audiobook (free)',
      note: 'Public-domain recording',
      url: book.audiobook.librivox.url,
      available: true,
    })
  } else {
    rows.push({
      path: 'Listen',
      option: 'LibriVox / free audio',
      format: 'Audiobook',
      note: 'No free legal audiobook listed',
      available: false,
    })
  }

  rows.push({
    path: 'Listen',
    option: 'Audible.au',
    format: 'Audiobook',
    note: 'Buy or membership — price on site',
    url: audibleAuSearchUrl(book),
    available: true,
  })
  rows.push({
    path: 'Listen',
    option: 'Google Play Audiobooks',
    format: 'Audiobook',
    note: 'Price on store',
    url: googlePlayAudiobookSearchUrl(book),
    available: true,
  })
  rows.push({
    path: 'Listen',
    option: 'Spotify',
    format: 'Audiobook search',
    note: 'Availability depends on plan/region',
    url: spotifyAudiobookSearchUrl(book),
    available: true,
  })

  rows.push({
    path: 'Buy',
    option: 'Amazon.au',
    format: 'Print / other',
    note: 'Price & delivery on retailer site',
    url: amazonAuSearchUrl(book),
    available: true,
  })
  rows.push({
    path: 'Buy',
    option: 'Kindle (Amazon.au)',
    format: 'Ebook',
    note: 'Digital edition search',
    url: kindleAuSearchUrl(book),
    available: true,
  })
  rows.push({
    path: 'Buy',
    option: 'Google Play Books',
    format: 'Ebook',
    note: 'Price on store',
    url: googlePlayBooksSearchUrl(book),
    available: true,
  })
  rows.push({
    path: 'Buy',
    option: 'Apple Books',
    format: 'Ebook',
    note: 'Price on store',
    url: appleBooksSearchUrl(book),
    available: true,
  })
  rows.push({
    path: 'Buy',
    option: 'Booktopia',
    format: 'Print / ebook',
    note: 'Australian retailer',
    url: booktopiaSearchUrl(book),
    available: true,
  })
  rows.push({
    path: 'Buy',
    option: 'Dymocks',
    format: 'Print',
    note: 'Australian retailer',
    url: dymocksSearchUrl(book),
    available: true,
  })
  rows.push({
    path: 'Buy',
    option: 'Readings',
    format: 'Print / ebook',
    note: 'Australian independent bookseller',
    url: readingsSearchUrl(book),
    available: true,
  })

  return (
    <div className="compare-section">
      <h3>Compare ways to get this book</h3>
      <p className="compare-disclaimer">
        We don’t show live prices in this MVP. Each link opens that store or catalogue so you
        can compare price and format there. We don’t sell, ship, or host books or audio.
      </p>

      <div className="compare-chips" aria-label="Quick store links">
        {rows
          .filter((r) => r.url)
          .map((r) => (
            <a
              key={`${r.path}-${r.option}`}
              className={`store-chip path-${r.path.toLowerCase()}`}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="chip-path">{r.path}</span>
              {r.option}
            </a>
          ))}
      </div>

      <div className="compare-table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col">Path</th>
              <th scope="col">Option</th>
              <th scope="col">Format</th>
              <th scope="col">Notes</th>
              <th scope="col">Link</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.path}-${row.option}`} className={row.available ? '' : 'row-unavailable'}>
                <td>
                  <span className={`path-badge path-${row.path.toLowerCase()}`}>{row.path}</span>
                </td>
                <td>{row.option}</td>
                <td>{row.format}</td>
                <td>{row.note}</td>
                <td>
                  {row.url ? (
                    <a href={row.url} target="_blank" rel="noopener noreferrer">
                      Open
                    </a>
                  ) : (
                    <span className="muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
