import { useCallback } from 'react'
import { useLocale } from '@/context/LanguageContext'
import { SITE_I18N } from '@/i18n/siteMessages'

function resolvePath(obj, path) {
  if (!obj || !path) return undefined
  return path.split('.').reduce((o, k) => (o != null && o[k] !== undefined ? o[k] : undefined), obj)
}

export function useTranslation() {
  const { locale } = useLocale()
  const t = useCallback(
    (key) => {
      const bundle = SITE_I18N[locale] || SITE_I18N.ru
      const fallback = SITE_I18N.ru
      return resolvePath(bundle, key) ?? resolvePath(fallback, key) ?? key
    },
    [locale],
  )
  return { t, locale }
}
