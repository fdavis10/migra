export function formatRub(amount) {
  if (amount == null || amount === '') return ''
  const n = Number(amount)
  if (Number.isNaN(n)) return String(amount)
  return `${new Intl.NumberFormat('ru-RU').format(n)} ₽`
}

/** @param {(key: string) => string} [t] Optional translator for `common.priceFrom` / `common.priceOnRequest`. */
export function priceLine(service, t) {
  const from = typeof t === 'function' ? t('common.priceFrom') : 'от'
  const tbd = typeof t === 'function' ? t('common.priceOnRequest') : 'уточняется'
  if (service.price_note) return service.price_note
  if (service.price_from != null) return `${from} ${formatRub(service.price_from)}`
  return tbd
}
