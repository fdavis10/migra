import { useCallback, useState } from 'react'
import { PromotionDiscountQuiz } from '@/components/promotions/PromotionDiscountQuiz'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './PromoFeaturedTiles.module.css'

export function PromoFeaturedTiles({ onConsult }) {
  const { t } = useTranslation()
  const [testOpen, setTestOpen] = useState(false)
  const [quizKey, setQuizKey] = useState(0)

  const closeTest = useCallback(() => {
    setTestOpen(false)
    setQuizKey((k) => k + 1)
  }, [])

  return (
    <div className={styles.row}>
      <div
        className={`${styles.tileStatic} ${testOpen ? styles.tileStaticOpen : ''}`}
        aria-expanded={testOpen}
      >
        {!testOpen ? (
          <button
            type="button"
            className={styles.tileTeaser}
            aria-label={t('promoTiles.testAria')}
            onClick={() => setTestOpen(true)}
          >
            <p className={styles.tileStaticText}>
              {t('promoTiles.testBefore')}
              <span className={styles.accent}>5%</span>
              {t('promoTiles.testAfter')}
            </p>
          </button>
        ) : (
          <>
            <div className={styles.tileQuizToolbar}>
              <button type="button" className={styles.tileQuizClose} onClick={closeTest}>
                {t('promoTiles.closeQuiz')}
              </button>
            </div>
            <div className={styles.tileQuizBody}>
              <PromotionDiscountQuiz key={quizKey} variant="embedded" skipIdle />
            </div>
          </>
        )}
      </div>

      <div className={styles.flipScene} tabIndex={0} aria-label={t('promoTiles.couplesAria')}>
        <div className={styles.flipInner}>
          <div className={styles.faceFront}>
            <img
              src="/images/semeynaya_para2.avif"
              alt=""
              className={styles.faceImg}
              width={1200}
              height={800}
              loading="lazy"
              decoding="async"
            />
            <span className={styles.frontHint}>{t('promoTiles.hoverHint')}</span>
          </div>
          <div className={styles.faceBack}>
            <img
              src="/images/semeynaya_para.jpg"
              alt=""
              className={styles.backPhoto}
              width={1000}
              height={667}
              loading="lazy"
              decoding="async"
            />
            <div className={styles.backScrim} aria-hidden />
            <div className={styles.backContent}>
              <p className={styles.backKicker}>{t('promoTiles.backKicker')}</p>
              <p className={styles.backDiscount}>{t('promoTiles.backDiscount')}</p>
              <p className={styles.backLead}>{t('promoTiles.backLead')}</p>
              <Button type="button" size="md" onClick={onConsult}>
                {t('promoTiles.cta')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
