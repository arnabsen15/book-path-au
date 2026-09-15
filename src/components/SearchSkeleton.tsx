export function SearchSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="skeleton-list" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-cover shimmer" />
          <div className="skeleton-lines">
            <div className="skeleton-line shimmer w-70" />
            <div className="skeleton-line shimmer w-45" />
            <div className="skeleton-chips">
              <span className="skeleton-chip shimmer" />
              <span className="skeleton-chip shimmer" />
              <span className="skeleton-chip shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
