import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/content/languageOptions'

function normalizeLocale(raw) {
  const v = typeof raw === 'string' ? raw.trim().toLowerCase() : ''
  if (v === 'ru' || v === 'en') return v
  return DEFAULT_LOCALE
}

function readStoredLocale() {
  try {
    return normalizeLocale(localStorage.getItem(LOCALE_STORAGE_KEY))
  } catch {
    return DEFAULT_LOCALE
  }
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(() => readStoredLocale())

  const setLocale = useCallback((next) => {
    const v = normalizeLocale(next)
    if (v === locale) return
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, v)
    } catch {
      /* ignore */
    }
    if (typeof window !== 'undefined') {
      window.location.reload()
    } else {
      setLocaleState(v)
    }
  }, [locale])

  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'ru'
  }, [locale])

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLocale outside LanguageProvider')
  return ctx
}
