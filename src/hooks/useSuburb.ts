import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'path-au-suburb'
const DEFAULT_HINT = 'Manor Lakes'

export function useSuburb() {
  const [suburb, setSuburbState] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setSuburbState(raw)
    } catch {
      /* ignore */
    }
    setReady(true)
  }, [])

  const setSuburb = useCallback((value: string) => {
    setSuburbState(value)
    try {
      if (value.trim()) localStorage.setItem(STORAGE_KEY, value.trim())
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  return { suburb, setSuburb, ready, hint: DEFAULT_HINT }
}
