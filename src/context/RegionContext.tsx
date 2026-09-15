import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  getRegion,
  loadStoredRegion,
  storeRegion,
  type RegionCode,
  type RegionConfig,
} from '../region'

interface RegionContextValue {
  regionCode: RegionCode
  region: RegionConfig
  setRegionCode: (code: RegionCode) => void
}

const RegionContext = createContext<RegionContextValue | null>(null)

export function RegionProvider({ children }: { children: ReactNode }) {
  const [regionCode, setRegionCodeState] = useState<RegionCode>(() =>
    typeof window !== 'undefined' ? loadStoredRegion() : 'AU',
  )

  useEffect(() => {
    storeRegion(regionCode)
  }, [regionCode])

  const value = useMemo<RegionContextValue>(
    () => ({
      regionCode,
      region: getRegion(regionCode),
      setRegionCode: setRegionCodeState,
    }),
    [regionCode],
  )

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>
}

export function useRegion(): RegionContextValue {
  const ctx = useContext(RegionContext)
  if (!ctx) throw new Error('useRegion must be used within RegionProvider')
  return ctx
}
