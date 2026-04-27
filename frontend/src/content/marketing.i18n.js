import { COUNTRIES_HELP, WHY_US, WORK_STEPS } from '@/content/marketing'
import { COUNTRY_NAMES_EN, WHY_US_EN, WORK_STEPS_EN } from '@/content/marketing.en'

export function getWhyUs(locale) {
  return locale === 'en' ? WHY_US_EN : WHY_US
}

export function getWorkSteps(locale) {
  return locale === 'en' ? WORK_STEPS_EN : WORK_STEPS
}

export function getCountriesHelp(locale) {
  if (locale !== 'en') return COUNTRIES_HELP
  return COUNTRIES_HELP.map((c) => ({
    ...c,
    name: COUNTRY_NAMES_EN[c.code] ?? c.name,
  }))
}
