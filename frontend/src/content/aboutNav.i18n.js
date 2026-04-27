import { ABOUT_NAV_ITEMS } from '@/content/aboutNav'

const LABEL_EN = {
  '/o-kompanii': 'About us',
  '/o-kompanii/osnovatel': 'Founder',
  '/o-kompanii/preimushchestva': 'Advantages',
  '/garantii': 'Guarantees',
  '/otzyvy': 'Reviews',
  '/o-kompanii/oplata': 'Payment',
}

export function getAboutNavItems(locale) {
  if (locale !== 'en') return ABOUT_NAV_ITEMS
  return ABOUT_NAV_ITEMS.map((item) => ({
    ...item,
    label: LABEL_EN[item.to] ?? item.label,
  }))
}
