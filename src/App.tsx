import { useState } from 'react'
import { About } from './pages/About'
import { Home } from './pages/Home'
import './App.css'

type Page = 'home' | 'about'

export default function App() {
  const [page, setPage] = useState<Page>('home')

  return (
    <div className="app">
      <header className="site-header">
        <a
          href="#home"
          className="logo"
          onClick={(e) => {
            e.preventDefault()
            setPage('home')
          }}
        >
          Book Path AU
        </a>
        <nav>
          <button
            type="button"
            className={page === 'home' ? 'nav-active' : ''}
            onClick={() => setPage('home')}
          >
            Home
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

      <main>{page === 'home' ? <Home /> : <About />}</main>

      <footer className="site-footer">
        <p>Free · Borrow · Listen · Buy — legal paths only.</p>
        <p className="muted">
          We don’t warehouse, sell, or deliver books. Prices and availability are on each
          retailer’s or library’s site.
        </p>
      </footer>
    </div>
  )
}
