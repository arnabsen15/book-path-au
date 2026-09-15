interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  suggestions: string[]
  loading?: boolean
}

export function SearchBox({ value, onChange, onSubmit, suggestions, loading }: SearchBoxProps) {
  return (
    <div className="search-box">
      <form
        className="search-form"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit?.()
        }}
      >
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
          aria-busy={loading || undefined}
        />
        <button type="submit" className="search-submit">
          Search
        </button>
      </form>
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
