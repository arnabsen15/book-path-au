import type { Book } from '../types'
import { CompareTable } from './CompareTable'
import { PathCards } from './PathCards'

interface BookResultProps {
  book: Book
}

export function BookResult({ book }: BookResultProps) {
  return (
    <section className="book-result" id={book.id}>
      <header className="book-header">
        <h2>{book.title}</h2>
        <p className="book-meta">
          {book.author}
          {book.year ? ` · ${book.year}` : ''}
          {book.isbn ? ` · ISBN ${book.isbn}` : ''}
        </p>
        <p className="path-legend">Free · Borrow · Listen · Buy</p>
      </header>
      <PathCards book={book} />
      <CompareTable book={book} />
    </section>
  )
}
