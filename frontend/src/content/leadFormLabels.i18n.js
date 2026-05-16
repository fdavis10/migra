/** English labels for lead form `<option>` text; submitted `value` stays Russian. */
const CITIZENSHIP_EN = {
  Таджикистан: 'Tajikistan',
  Узбекистан: 'Uzbekistan',
  Кыргызстан: 'Kyrgyzstan',
  Украина: 'Ukraine',
  Беларусь: 'Belarus',
  Казахстан: 'Kazakhstan',
  Молдова: 'Moldova',
  Армения: 'Armenia',
  Азербайджан: 'Azerbaijan',
  'Другая страна': 'Other country',
}

const REGION_EN = {
  Москва: 'Moscow',
  'Московская область': 'Moscow Oblast',
  'Санкт-Петербург и ЛО': 'Saint Petersburg and Leningrad Oblast',
  'Другой регион': 'Another region',
}

export function citizenshipOptionLabel(value, locale) {
  if (locale !== 'en' || !value) return value
  return CITIZENSHIP_EN[value] ?? value
}

export function regionOptionLabel(value, locale) {
  if (locale !== 'en' || !value) return value
  return REGION_EN[value] ?? value
}
