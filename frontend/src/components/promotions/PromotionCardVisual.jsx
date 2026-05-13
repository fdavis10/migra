import { promotionCardImageSrc } from '@/utils/promotionCardImage'
import styles from './PromotionCardVisual.module.css'

export function PromotionCardVisual({ promotion, className = '', embedInCard = false }) {
  const src = promotionCardImageSrc(promotion)
  if (!src) return null
  return (
    <div
      className={`${styles.wrap} ${embedInCard ? styles.embedInCard : ''} ${className}`.trim()}
    >
      <img
        src={src}
        alt=""
        className={styles.img}
        width={512}
        height={512}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
