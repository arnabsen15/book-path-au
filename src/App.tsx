import { useState } from 'react'
import { RegionSelector } from './components/RegionSelector'
import { useRegion } from './context/RegionContext'
import { About } from './pages/About'
import { Home } from './pages/Home'
import { Movies } from './pages/Movies'
import './App.css'

type Page = 'books' | 'movies' | 'about'

export default function App() {
  const [page, setPage] = useState<Page>('books')
  const { region } = useRegion()

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

      <main>
        {page === 'books' ? <Home /> : page === 'movies' ? <Movies /> : <About />}
      </main>

      <footer className="site-footer">
        <p>Free · Borrow · Stream/Listen · Buy — legal paths only ({region.name}).</p>
        <p className="muted footer-disclaimer">
          Hobby project for book &amp; movie lovers · Not a shop · Not affiliated with retailers or
          streamers
        </p>
        <p className="muted footer-disclaimer">
          Streaming platforms, publishers &amp; partners:{' '}
          <a href="mailto:arnabsen1@proton.me">arnabsen1@proton.me</a>
        </p>
      </footer>
    </div>
  )
}
