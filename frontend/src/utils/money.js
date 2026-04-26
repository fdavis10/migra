export function formatRub(amount) {
  if (amount == null || amount === '') return ''
  const n = Number(amount)
  if (Number.isNaN(n)) return String(amount)
  return `${new Intl.NumberFormat('ru-RU').format(n)} ₽`
}

export function priceLine(service) {
  if (service.price_note) return service.price_note
  if (service.price_from != null) return `от ${formatRub(service.price_from)}`
  return 'уточняется'
}
