import friendPacket from '@assets/image/friend_packet.png'

/**
 * Card art for promotions (1:1). Order 1 — bundled asset; остальные — /public/images/promotions/.
 * Keys match `order` from the API (seed_initial / seed_demo).
 */
const BY_ORDER = {
  1: friendPacket,
  2: '/images/promotions/02-family.png',
  3: '/images/promotions/03-employer.png',
  4: '/images/promotions/04-perspective.png',
  5: '/images/promotions/05-child.png',
  6: '/images/promotions/06-student.png',
  7: '/images/promotions/07-test.png',
}

export function promotionCardImageSrc(promotion) {
  const order = Number(promotion?.order)
  if (!Number.isFinite(order) || order < 1) return null
  return BY_ORDER[order] ?? null
}
