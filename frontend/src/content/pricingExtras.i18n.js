import { DISCOUNT_CARDS, PAYMENT_METHODS } from './pricingExtras'
import { DISCOUNT_CARDS_EN, PAYMENT_METHODS_EN } from './pricingExtras.en'

export function getDiscountCards(locale) {
  return locale === 'en' ? DISCOUNT_CARDS_EN : DISCOUNT_CARDS
}

export function getPaymentMethods(locale) {
  return locale === 'en' ? PAYMENT_METHODS_EN : PAYMENT_METHODS
}
