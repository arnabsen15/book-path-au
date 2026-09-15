interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  suggestions: string[]
  loading?: boolean
  placeholder?: string
  label?: string
  inputId?: string
}

export function SearchBox({
  value,
  onChange,
  onSubmit,
  suggestions,
  loading,
  placeholder = 'Search by title, author, or ISBN…',
  label = 'Search books',
  inputId = 'book-search',
}: SearchBoxProps) {
  return (
    <div className="search-box sticky-search">
      <form
        className="search-form"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit?.()
        }}
      >
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <div className="search-input-wrap">
          <span className="search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            id={inputId}
            type="search"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoComplete="off"
            aria-busy={loading || undefined}
          />
          {loading ? <span className="search-spinner" aria-hidden="true" /> : null}
        </div>
        <button type="submit" className="search-submit">
          Search
        </button>
      </form>
      {value.trim() === '' && (
        <div className="chips">
          <span className="chips-label">Try:</span>
          {suggestions.map((chip) => (
            <button key={chip} type="button" className="chip" onClick={() => onChange(chip)}>
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
