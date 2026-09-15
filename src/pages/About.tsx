export function About() {
  return (
    <article className="about">
      <h1>About Book Path AU</h1>
      <p>
        Book Path AU helps people in Australia find the best <strong>legal</strong> way to get a
        book: Free, Borrow, Listen, or Buy. We don’t sell books, host files, or track library
        stock in real time.
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
          Booktopia, Dymocks, Google Play Books, Apple Books, Audible.au, and Spotify. Prices and
          delivery live on those sites. We don’t sell or ship books.
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
