/** @param {'ru' | 'en'} [locale] Number grouping; currency symbol unchanged. */
export function formatRub(amount, locale = 'ru') {
  if (amount == null || amount === '') return ''
  const n = Number(amount)
  if (Number.isNaN(n)) return String(amount)
  const tag = locale === 'en' ? 'en-US' : 'ru-RU'
  return `${new Intl.NumberFormat(tag).format(n)} ₽`
}

/**
 * @param {object} service
 * @param {(key: string) => string} [t] Translator for `common.priceFrom` / `common.priceOnRequest`.
 * @param {'ru' | 'en'} [locale]
 */
export function priceLine(service, t, locale = 'ru') {
  const from = typeof t === 'function' ? t('common.priceFrom') : 'от'
  const tbd = typeof t === 'function' ? t('common.priceOnRequest') : 'уточняется'
  if (service.price_note) return service.price_note
  if (service.price_from != null) return `${from} ${formatRub(service.price_from, locale)}`
  return tbd
}
