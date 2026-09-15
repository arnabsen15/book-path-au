import { useEffect, useState } from 'react'
import { RegionSelector } from './components/RegionSelector'
import { useRegion } from './context/RegionContext'
import { About } from './pages/About'
import { Home } from './pages/Home'
import { Movies } from './pages/Movies'
import './App.css'

type Page = 'books' | 'movies' | 'about'

const PAGE_KEY = 'path-au-page'

function readStoredPage(): Page {
  try {
    const v = localStorage.getItem(PAGE_KEY)
    if (v === 'books' || v === 'movies' || v === 'about') return v
  } catch {
    /* ignore */
  }
  return 'books'
}

export default function App() {
  const [page, setPage] = useState<Page>(readStoredPage)
  const { region } = useRegion()

  useEffect(() => {
    try {
      localStorage.setItem(PAGE_KEY, page)
    } catch {
      /* ignore */
    }
  }, [page])

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <a
            href="#books"
            className="logo"
            onClick={(e) => {
              e.preventDefault()
              setPage('books')
            }}
          >
            <span className="logo-mark" aria-hidden="true">
              ◆
            </span>
            Path AU
          </a>

          <nav className="nav-pills" aria-label="Primary">
            <button
              type="button"
              className={page === 'books' ? 'nav-active' : ''}
              onClick={() => setPage('books')}
              aria-current={page === 'books' ? 'page' : undefined}
            >
              Books
            </button>
            <button
              type="button"
              className={page === 'movies' ? 'nav-active' : ''}
              onClick={() => setPage('movies')}
              aria-current={page === 'movies' ? 'page' : undefined}
            >
              Movies
            </button>
            <button
              type="button"
              className={page === 'about' ? 'nav-active' : ''}
              onClick={() => setPage('about')}
              aria-current={page === 'about' ? 'page' : undefined}
            >
              About
            </button>
          </nav>

          <RegionSelector compact />
        </div>
      </header>

      <main>{page === 'books' ? <Home /> : page === 'movies' ? <Movies /> : <About />}</main>

      <footer className="site-footer">
        <p className="footer-trust">
          Legal discovery only · Not affiliated · Availability varies ({region.name}).
        </p>
      </footer>
    </div>
  )
}
