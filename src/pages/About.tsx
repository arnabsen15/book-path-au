export function About() {
  return (
    <article className="about">
      <h1>About Book Path AU</h1>
      <p>
        Book Path AU helps people in Australia find the best <strong>legal</strong> way to get a
        book: Free, Borrow, Listen, or Buy.
      </p>

      <section className="legal-notice" aria-labelledby="legal-heading">
        <h2 id="legal-heading">Legal &amp; disclaimer</h2>
        <p>
          Book Path AU is a personal hobby project created to help book lovers in Australia find
          legal ways to read, borrow, listen to, or buy books. It is not a business, not a
          bookstore, and not a commercial service. We do not sell products, take payments for
          books, hold stock, or arrange delivery.
        </p>
        <p>
          Links to Amazon, Kindle, Google Play Books, Apple Books, Booktopia, Dymocks, Readings,
          Audible, libraries, and free public-domain sites are provided only as convenient
          references for readers. Book Path AU is not affiliated with, endorsed by, or sponsored
          by those organisations unless we later join an official affiliate programme and disclose
          that.
        </p>
        <p>
          Information is provided in good faith for personal, non-commercial use by book lovers.
          We do not guarantee prices, availability, or delivery times — always check the
          destination site. We do not host or distribute copyrighted books or audiobooks.
        </p>
      </section>

      <h2>Indicative prices</h2>
      <p>
        Where we show dollar amounts, they are <strong>manual indicative prices in AUD</strong>,
        not live scrapes from retailers. Someone updated them by hand (last updated date appears
        on each book result). Editions, discounts, and stock change often — always verify the
        price on the retailer site before you buy.
      </p>
      <p>
        Free sources (Project Gutenberg, Wikisource, Open Library, LibriVox) and library borrow
        paths are labelled Free or Library — we never invent a fake dollar price for those.
      </p>
      <p className="disclaimer">
        Indicative prices in AUD — not live. Check the store for today’s price.
      </p>

      <h2>What we stand for</h2>
      <ul>
        <li>
          <strong>No piracy.</strong> We only link to legitimate free sources (e.g. Project
          Gutenberg, Open Library, Wikisource, LibriVox) when a work is public domain or openly
          licensed — and we say so honestly when it isn’t.
        </li>
        <li>
          <strong>Libraries first.</strong> Borrowing via Trove, your local library, Libby,
          BorrowBox, or OverDrive is often the best path. Examples like Wyndham or YPRL are
          illustrative only.
        </li>
        <li>
          <strong>Retailers for buying.</strong> Outbound search links to Amazon.au, Kindle,
          Booktopia, Dymocks, Readings, Google Play Books, Apple Books, Audible.au, and Spotify.
          Indicative AUD figures are a starting point only — final price is always on those sites.
        </li>
        <li>
          <strong>Affiliate-ready later.</strong> No affiliate tags in this MVP. If we add them,
          we’ll disclose clearly.
        </li>
      </ul>

      <h2>Hosting</h2>
      <p>
        This site is a static app hosted on GitHub Pages. Catalogue data is seeded for the MVP —
        not a live inventory feed.
      </p>

      <h2>Australia-focused</h2>
      <p>
        Links and tips favour Australian readers: Trove, AU retailers, and local library apps.
      </p>
    </article>
  )
}
