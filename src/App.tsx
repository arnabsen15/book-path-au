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
        <a
          href="#books"
          className="logo"
          onClick={(e) => {
            e.preventDefault()
            setPage('books')
          }}
        >
          Path AU
        </a>
        <nav>
          <button
            type="button"
            className={page === 'books' ? 'nav-active' : ''}
            onClick={() => setPage('books')}
          >
            Books
          </button>
          <button
            type="button"
            className={page === 'movies' ? 'nav-active' : ''}
            onClick={() => setPage('movies')}
          >
            Movies
          </button>
          <button
            type="button"
            className={page === 'about' ? 'nav-active' : ''}
            onClick={() => setPage('about')}
          >
            About
          </button>
        </nav>
      </header>

      <RegionSelector />

      <main>
        {page === 'books' ? <Home /> : page === 'movies' ? <Movies /> : <About />}
      </main>

      <footer className="site-footer">
        <p>Free · Borrow · Stream/Listen · Buy — legal paths only ({region.name}).</p>
        <p className="muted footer-disclaimer">
          Hobby project for book &amp; movie lovers · Not a shop · Not affiliated with retailers or
          streamers
        </p>
      </footer>
    </div>
  )
}
