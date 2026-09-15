import { useRegion } from '../context/RegionContext'
import { REGIONS, type RegionCode } from '../region'

interface RegionSelectorProps {
  compact?: boolean
}

export function RegionSelector({ compact = false }: RegionSelectorProps) {
  const { regionCode, region, setRegionCode } = useRegion()

  if (compact) {
    return (
      <label className="region-compact" htmlFor="region-select">
        <span className="sr-only">Region</span>
        <select
          id="region-select"
          value={regionCode}
          onChange={(e) => setRegionCode(e.target.value as RegionCode)}
          title={region.note}
        >
          {REGIONS.map((r) => (
            <option key={r.code} value={r.code}>
              {r.name}
            </option>
          ))}
        </select>
      </label>
    )
  }

  return (
    <div className="region-selector">
      <label htmlFor="region-select-full">
        Region
        <select
          id="region-select-full"
          value={regionCode}
          onChange={(e) => setRegionCode(e.target.value as RegionCode)}
        >
          {REGIONS.map((r) => (
            <option key={r.code} value={r.code}>
              {r.name}
            </option>
          ))}
        </select>
      </label>
      <p className="region-note muted" role="status">
        {region.note}
      </p>
    </div>
  )
}
