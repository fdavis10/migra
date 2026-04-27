import { ABOUT_COMPANY, FOUNDER_LETTER } from '@/content/about'
import { ABOUT_COMPANY_EN, FOUNDER_LETTER_EN } from '@/content/about.en'

export function getAboutCompanyParagraphs(locale) {
  const text = locale === 'en' ? ABOUT_COMPANY_EN : ABOUT_COMPANY
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export function getFounderLetterParagraphs(locale) {
  const text = locale === 'en' ? FOUNDER_LETTER_EN : FOUNDER_LETTER
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
}
