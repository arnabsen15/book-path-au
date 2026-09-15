import { useRegion } from '../context/RegionContext'

export function About() {
  const { region } = useRegion()

  return (
    <article className="about">
      <h1>About Path AU</h1>
      <p>
        Path AU helps people find <strong>legal</strong> ways to read or watch — Free, Borrow,
        Stream/Listen, or Buy. Use the region selector (currently <strong>{region.name}</strong>)
        to tailor outbound storefront links. We don’t invent live catalogues per region — only
        search URL patterns.
      </p>

      <h2>How to use</h2>
      <p>
        Search a title, open one result, then follow the recommended next step (JustWatch for
        movies, Trove/Libby for books). Extra stores stay collapsed under “More…”. All outbound
        buttons are search links only — we don’t track live catalogues or claim a title is listed.
      </p>

      <section className="legal-notice" aria-labelledby="legal-heading">
        <h2 id="legal-heading">Legal &amp; disclaimer</h2>
        <p>
          Path AU is a personal hobby project for book and movie lovers. It is not a shop, not a
          cinema, and not a streaming service. We do not sell products, take payments, hold stock,
          host films, or arrange delivery.
        </p>
        <p>
          Links to Amazon, Apple, Google, Netflix, Prime Video, JustWatch, FTA catch-up apps
          (SBS On Demand, ABC iview, 7plus, 9Now, 10 Play), Kanopy, Beamafilm, Booktopia, Dymocks,
          Readings, Audible, libraries, and free public-domain sites are convenient references
          only. Path AU is not affiliated with, endorsed by, or sponsored by Netflix, Amazon,
          Apple, Google, or any other retailer or streamer unless we later join an official
          affiliate programme and disclose that.
        </p>
        <p>
          Information is provided in good faith for personal, non-commercial use. We do not
          guarantee prices, availability, or delivery times — always check the destination site.
          We do not host or distribute copyrighted books, audiobooks, or films. Links ≠ live
          availability. Region only changes which search base URLs we build.
        </p>
      </section>

      <h2>Region selector</h2>
      <p>
        Choose Australia, United States, United Kingdom, New Zealand, or India. Your choice is
        saved in localStorage. Australian free-to-air catch-up search links appear when Australia
        is selected. {region.note}
      </p>

      <h2>Books</h2>
      <p>
        Live search uses the Open Library Search API. Seeded favourites keep indicative AUD
        prices; live-only hits show “See store”. Free · Borrow · Listen · Buy paths only — no
        piracy.
      </p>

      <h2>Movies</h2>
      <p>
        Seed catalogue plus keyless Wikipedia OpenSearch (optional{' '}
        <code>VITE_TMDB_API_KEY</code> for TMDB posters). Paths: Free · Borrow · Stream · Buy.
        JustWatch is the primary “where to watch” aggregator. FTA catch-up links are search-only —
        we never claim a title is on that service unless we know.
      </p>

      <h2>What we stand for</h2>
      <ul>
        <li>
          <strong>No piracy.</strong> Only legitimate free / public-domain sources when known.
        </li>
        <li>
          <strong>Libraries &amp; FTA.</strong> Borrow and free-with-ads catch-up are first-class
          options for Australian users.
        </li>
        <li>
          <strong>Honesty.</strong> Outbound search links are not proof of stock or rights.
        </li>
      </ul>

      <h2>Partners &amp; press</h2>
      <p>
        Streaming platforms, publishers &amp; partners:{' '}
        <a href="mailto:arnabsen1@proton.me">arnabsen1@proton.me</a>
      </p>
      <p className="muted">
        Path AU remains a hobby project — contact does not change the disclaimer above.
      </p>
    </article>
  )
}
