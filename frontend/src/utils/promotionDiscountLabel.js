/**
 * Shows a leading " - " before the discount value when it does not already start with a dash
 * (e.g. "20%" → " - 20%").
 */
export function formatPromotionDiscountLabel(discount) {
  if (discount == null) return discount
  const trimmed = String(discount).trim()
  if (!trimmed) return discount
  if (/^[-−–]/.test(trimmed)) return trimmed
  return ` - ${trimmed}`
}
