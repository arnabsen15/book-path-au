import { useRegion } from '../context/RegionContext'
import type { Book, IndicativePrices } from '../types'
import {
  PRICES_DISCLAIMER,
  formatAud,
  formatPricesUpdated,
} from '../types'
import {
  amazonAuSearchUrl,
  amazonLabel,
  appleBooksSearchUrl,
  audibleAuSearchUrl,
  audibleLabel,
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

type PriceDisplay = { kind: 'money'; amount: number } | { kind: 'label'; text: string } | { kind: 'see' }

interface CompareRow {
  path: string
  option: string
  format: string
  note: string
  url?: string
  available: boolean
  price: PriceDisplay
  priceKey?: keyof IndicativePrices
}

function moneyFrom(prices: IndicativePrices | undefined, key: keyof IndicativePrices): PriceDisplay {
  const n = prices?.[key]
  if (typeof n === 'number') return { kind: 'money', amount: n }
  return { kind: 'see' }
}

function priceCell(price: PriceDisplay): string {
  if (price.kind === 'money') return formatAud(price.amount)
  if (price.kind === 'label') return price.text
  return 'See store'
}

export function CompareTable({ book }: CompareTableProps) {
  const { region } = useRegion()
  const p = book.indicativePrices
  const updated = formatPricesUpdated(book.pricesUpdated)
  const rows: CompareRow[] = []
  const audibleUrl = audibleAuSearchUrl(book, region)

  if (book.free.available) {
    for (const link of book.free.links) {
      rows.push({
        path: 'Free',
        option: link.label,
        format: 'Ebook / text',
        note: 'Public domain or open access',
        url: link.url,
        available: true,
        price: { kind: 'label', text: 'Free' },
      })
    }
  } else {
    rows.push({
      path: 'Free',
      option: 'Legal free ebook',
      format: '—',
      note: book.free.note || 'Not free legally',
      available: false,
      price: { kind: 'label', text: '—' },
    })
  }

  if (region.code === 'AU' || region.code === 'NZ') {
    rows.push({
      path: 'Borrow',
      option: 'Trove (NLA)',
      format: 'Print / ebook search',
      note: 'Find libraries holding this title',
      url: troveSearchUrl(book),
      available: true,
      price: { kind: 'label', text: 'Library' },
    })
  }
  rows.push({
    path: 'Borrow',
    option: 'Open Libby / library apps',
    format: 'Ebook / audiobook',
    note: 'Opens Libby — no title deep-link; stock varies by library',
    url: libbyUrl(),
    available: true,
    price: { kind: 'label', text: 'Library' },
  })

  if (book.audiobook?.librivox) {
    rows.push({
      path: 'Listen',
      option: book.audiobook.librivox.label,
      format: 'Audiobook (free)',
      note: 'Public-domain recording',
      url: book.audiobook.librivox.url,
      available: true,
      price: { kind: 'label', text: 'Free' },
    })
  } else {
    rows.push({
      path: 'Listen',
      option: 'LibriVox / free audio',
      format: 'Audiobook',
      note: 'No free legal audiobook listed',
      available: false,
      price: { kind: 'label', text: '—' },
    })
  }

  if (audibleUrl) {
    rows.push({
      path: 'Listen',
      option: audibleLabel(region),
      format: 'Audiobook',
      note: 'Buy or membership — verify on site',
      url: audibleUrl,
      available: true,
      price: moneyFrom(p, 'audible'),
      priceKey: 'audible',
    })
  }
  rows.push({
    path: 'Listen',
    option: 'Google Play Audiobooks',
    format: 'Audiobook',
    note: 'Price on store',
    url: googlePlayAudiobookSearchUrl(book),
    available: true,
    price: { kind: 'see' },
  })
  rows.push({
    path: 'Listen',
    option: 'Spotify',
    format: 'Audiobook search',
    note: 'Availability depends on plan/region',
    url: spotifyAudiobookSearchUrl(book),
    available: true,
    price: { kind: 'see' },
  })

  rows.push({
    path: 'Buy',
    option: amazonLabel(region),
    format: 'Print / other',
    note: 'Title + author search — verify listing',
    url: amazonAuSearchUrl(book, region),
    available: true,
    price: moneyFrom(p, 'amazonAu'),
    priceKey: 'amazonAu',
  })
  rows.push({
    path: 'Buy',
    option: 'Kindle',
    format: 'Ebook',
    note: 'Digital edition',
    url: kindleAuSearchUrl(book, region),
    available: true,
    price: moneyFrom(p, 'kindle'),
    priceKey: 'kindle',
  })
  rows.push({
    path: 'Buy',
    option: 'Google Play Books',
    format: 'Ebook',
    note: 'Digital edition',
    url: googlePlayBooksSearchUrl(book),
    available: true,
    price: moneyFrom(p, 'googlePlay'),
    priceKey: 'googlePlay',
  })
  rows.push({
    path: 'Buy',
    option: 'Apple Books',
    format: 'Ebook',
    note: 'Digital edition',
    url: appleBooksSearchUrl(book, region),
    available: true,
    price: moneyFrom(p, 'appleBooks'),
    priceKey: 'appleBooks',
  })
  if (region.showAuBookRetailers) {
    rows.push({
      path: 'Buy',
      option: 'Booktopia',
      format: 'Print / ebook',
      note: 'Australian retailer',
      url: booktopiaSearchUrl(book),
      available: true,
      price: moneyFrom(p, 'booktopia'),
      priceKey: 'booktopia',
    })
    rows.push({
      path: 'Buy',
      option: 'Dymocks (Google site search)',
      format: 'Print',
      note: 'Store search via Google — verify on Dymocks',
      url: dymocksSearchUrl(book),
      available: true,
      price: moneyFrom(p, 'dymocks'),
      priceKey: 'dymocks',
    })
    rows.push({
      path: 'Buy',
      option: 'Readings (Google site search)',
      format: 'Print / ebook',
      note: 'Store search via Google — verify on Readings',
      url: readingsSearchUrl(book),
      available: true,
      price: moneyFrom(p, 'readings'),
      priceKey: 'readings',
    })
  }

  return (
    <div className="compare-section">
      <h3>Compare ways to get this book</h3>
      <p className="compare-disclaimer">{PRICES_DISCLAIMER}</p>
      <p className="compare-disclaimer muted">{region.note} Links ≠ live availability.</p>
      {updated ? (
        <p className="prices-updated">Prices last updated: {updated}</p>
      ) : null}

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
              <span className="chip-option">{r.option}</span>
              <span className="chip-price">{priceCell(r.price)}</span>
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
              <th scope="col">Indicative price</th>
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
                <td className="price-cell">{priceCell(row.price)}</td>
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
