import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_SUBURB, SUBURB_HINT } from '../data/nowShowingLocal'

const STORAGE_KEY = 'path-au-suburb'

export function useSuburb() {
  const [suburb, setSuburbState] = useState(DEFAULT_SUBURB)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw && raw.trim()) setSuburbState(raw.trim())
      else setSuburbState(DEFAULT_SUBURB)
    } catch {
      setSuburbState(DEFAULT_SUBURB)
    }
    setReady(true)
  }, [])

  const setSuburb = useCallback((value: string) => {
    setSuburbState(value)
    try {
      const trimmed = value.trim()
      if (trimmed) localStorage.setItem(STORAGE_KEY, trimmed)
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  /** Value used in outbound cinema searches when the field is blank. */
  const effectiveSuburb = suburb.trim() || DEFAULT_SUBURB

  return { suburb, setSuburb, ready, hint: SUBURB_HINT, effectiveSuburb, defaultSuburb: DEFAULT_SUBURB }
}
