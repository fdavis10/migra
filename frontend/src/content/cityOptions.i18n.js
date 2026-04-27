import { CITY_GROUPS } from '@/content/cityOptions'

const GROUP_TITLE_EN = {
  'Москва и Московская область': 'Moscow and Moscow Oblast',
  'Страны СНГ': 'CIS countries',
  'Страны Мира': 'Countries worldwide',
}

export function getCityGroups(locale) {
  if (locale !== 'en') return CITY_GROUPS
  return CITY_GROUPS.map((g) => ({
    ...g,
    title: GROUP_TITLE_EN[g.title] ?? g.title,
  }))
}
