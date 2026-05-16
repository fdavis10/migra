import { CITY_GROUPS } from '@/content/cityOptions'
import { CITY_DISPLAY_EN } from '@/content/cityNamesEn'

const GROUP_TITLE_EN = {
  'Москва и Московская область': 'Moscow and Moscow Oblast',
  'Страны СНГ': 'CIS countries',
  'Страны Мира': 'Countries worldwide',
}

/** UI label for a stored city/country name (localStorage keeps Russian). */
export function getCityDisplayName(ruName, locale) {
  if (locale !== 'en' || !ruName) return ruName
  return CITY_DISPLAY_EN[ruName] ?? ruName
}

export function getCityGroups(locale) {
  if (locale !== 'en') return CITY_GROUPS
  return CITY_GROUPS.map((g) => ({
    ...g,
    title: GROUP_TITLE_EN[g.title] ?? g.title,
  }))
}
