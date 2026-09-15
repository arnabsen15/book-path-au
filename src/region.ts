export type RegionCode = 'AU' | 'US' | 'GB' | 'NZ' | 'IN'

export interface RegionConfig {
  code: RegionCode
  name: string
  /** JustWatch country path segment */
  justWatch: 'au' | 'us' | 'uk' | 'nz' | 'in'
  amazonHost: string
  audibleHost: string | null
  appleBooksLocale: string
  appleTvLocale: string
  /** Show AU free-to-air catch-up search links */
  showAuFta: boolean
  /** AU specialist book retailers */
  showAuBookRetailers: boolean
  /** Default cinema city for showtimes Google search */
  cinemaCity: string
  note: string
}

export const REGIONS: RegionConfig[] = [
  {
    code: 'AU',
    name: 'Australia',
    justWatch: 'au',
    amazonHost: 'www.amazon.com.au',
    audibleHost: 'www.audible.com.au',
    appleBooksLocale: 'au',
    appleTvLocale: 'au',
    showAuFta: true,
    showAuBookRetailers: true,
    cinemaCity: 'Melbourne',
    note: 'Links are tailored for Australia; availability still depends on the store.',
  },
  {
    code: 'US',
    name: 'United States',
    justWatch: 'us',
    amazonHost: 'www.amazon.com',
    audibleHost: 'www.audible.com',
    appleBooksLocale: 'us',
    appleTvLocale: 'us',
    showAuFta: false,
    showAuBookRetailers: false,
    cinemaCity: 'New York',
    note: 'Links are tailored for the United States; availability still depends on the store.',
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    justWatch: 'uk',
    amazonHost: 'www.amazon.co.uk',
    audibleHost: 'www.audible.co.uk',
    appleBooksLocale: 'gb',
    appleTvLocale: 'gb',
    showAuFta: false,
    showAuBookRetailers: false,
    cinemaCity: 'London',
    note: 'Links are tailored for the United Kingdom; availability still depends on the store.',
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    justWatch: 'nz',
    amazonHost: 'www.amazon.com.au',
    audibleHost: 'www.audible.com.au',
    appleBooksLocale: 'nz',
    appleTvLocale: 'nz',
    showAuFta: false,
    showAuBookRetailers: true,
    cinemaCity: 'Auckland',
    note: 'Links are tailored for New Zealand (AU storefronts where NZ lacks one); availability still depends on the store.',
  },
  {
    code: 'IN',
    name: 'India',
    justWatch: 'in',
    amazonHost: 'www.amazon.in',
    audibleHost: 'www.audible.in',
    appleBooksLocale: 'in',
    appleTvLocale: 'in',
    showAuFta: false,
    showAuBookRetailers: false,
    cinemaCity: 'Mumbai',
    note: 'Links are tailored for India; availability still depends on the store.',
  },
]

export const DEFAULT_REGION: RegionCode = 'AU'
export const REGION_STORAGE_KEY = 'path-au-region'

export function getRegion(code: RegionCode): RegionConfig {
  return REGIONS.find((r) => r.code === code) ?? REGIONS[0]
}

export function loadStoredRegion(): RegionCode {
  try {
    const raw = localStorage.getItem(REGION_STORAGE_KEY)
    if (raw && REGIONS.some((r) => r.code === raw)) return raw as RegionCode
  } catch {
    /* ignore */
  }
  return DEFAULT_REGION
}

export function storeRegion(code: RegionCode): void {
  try {
    localStorage.setItem(REGION_STORAGE_KEY, code)
  } catch {
    /* ignore */
  }
}
