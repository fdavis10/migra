/** Веб-клиент MAX (иконка MAX не должна вести на VK). */
export const MAX_MESSENGER_WEB_URL = 'https://web.max.ru/'

/** Нормализация отображаемого номера к цифрам 7XXXXXXXXXX (РФ). */
export function normalizePhoneDigitsE164Ru(displayPhone) {
  let d = String(displayPhone ?? '')
    .replace(/\D/g, '')
    .trim()
  if (d.length === 10 && /^9\d{9}$/.test(d)) d = `7${d}`
  if (d.length === 11 && d.startsWith('8')) d = `7${d.slice(1)}`
  if (d.length !== 11 || !d.startsWith('7')) return ''
  return d
}

export function whatsappUrlFromPhone(displayPhone) {
  const d = normalizePhoneDigitsE164Ru(displayPhone)
  return d ? `https://wa.me/${d}` : ''
}

/** Чат в Telegram по номеру (международный формат без пробелов). */
export function telegramUrlFromPhone(displayPhone) {
  const d = normalizePhoneDigitsE164Ru(displayPhone)
  return d ? `https://t.me/+${d}` : ''
}

export function maxMessengerHref(maxUrlFromSite) {
  const u = String(maxUrlFromSite ?? '').trim()
  return u || MAX_MESSENGER_WEB_URL
}
