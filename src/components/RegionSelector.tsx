import { useRegion } from '../context/RegionContext'
import { REGIONS, type RegionCode } from '../region'

export function RegionSelector() {
  const { regionCode, region, setRegionCode } = useRegion()

  return (
    <div className="region-selector">
      <label htmlFor="region-select">
        Region
        <select
          id="region-select"
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
