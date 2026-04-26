import { Button } from '@/components/ui/Button'
import styles from './PromoFeaturedTiles.module.css'

/**
 * Два промо-блока под сеткой акций: тест на скидку и flip-карточка «Вместе выгоднее».
 */
export function PromoFeaturedTiles({ onConsult }) {
  return (
    <div className={styles.row}>
      <div className={styles.tileStatic} aria-label="Акция: тест на скидку">
        <p className={styles.tileStaticText}>
          Пройдите простой тест из 6 вопросов и получите скидку <span className={styles.accent}>7%</span>
        </p>
      </div>

      <div className={styles.flipScene} tabIndex={0} aria-label="Акция для пар: наведите для подробностей">
        <div className={styles.flipInner}>
          <div className={styles.faceFront}>
            <img
              src="/images/consulatation.webp"
              alt=""
              className={styles.faceImg}
              width={900}
              height={600}
              loading="lazy"
              decoding="async"
            />
            <span className={styles.frontHint}>Наведите, чтобы узнать условия</span>
          </div>
          <div className={styles.faceBack}>
            <div className={styles.backContent}>
              <p className={styles.backKicker}>ВМЕСТЕ ВЫГОДНЕЕ</p>
              <p className={styles.backDiscount}>СКИДКА 10%</p>
              <p className={styles.backLead}>Для семейных пар при одновременном оформлении</p>
              <Button type="button" size="md" onClick={onConsult}>
                Бесплатная консультация
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
