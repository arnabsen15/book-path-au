interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
  suggestions: string[]
}

export function SearchBox({ value, onChange, suggestions }: SearchBoxProps) {
  return (
    <div className="search-box">
      <label htmlFor="book-search" className="sr-only">
        Search books
      </label>
      <input
        id="book-search"
        type="search"
        placeholder="Search by title, author, or ISBN…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
      {value.trim() === '' && (
        <div className="chips">
          <span className="chips-label">Try:</span>
          {suggestions.map((chip) => (
            <button
              key={chip}
              type="button"
              className="chip"
              onClick={() => onChange(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
