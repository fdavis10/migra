import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CITY_STORAGE_KEY, DEFAULT_CITY } from '@/content/cityOptions'

const CityContext = createContext(null)

function readStoredCity() {
  try {
    const v = localStorage.getItem(CITY_STORAGE_KEY)
    return v && v.trim() ? v.trim() : DEFAULT_CITY
  } catch {
    return DEFAULT_CITY
  }
}

export function CityProvider({ children }) {
  const [city, setCityState] = useState(() => readStoredCity())

  const setCity = useCallback((next) => {
    const label = typeof next === 'string' && next.trim() ? next.trim() : DEFAULT_CITY
    setCityState(label)
    try {
      localStorage.setItem(CITY_STORAGE_KEY, label)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(() => ({ city, setCity }), [city, setCity])

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>
}

export function useCity() {
  const ctx = useContext(CityContext)
  if (!ctx) throw new Error('useCity outside CityProvider')
  return ctx
}
