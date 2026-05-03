import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { getPromotion, getPromotions } from '@/api/promos'
import { RedConsultSweepButton } from '@/components/promotions/RedConsultSweepButton'
import { Skeleton } from '@/components/ui/Skeleton'
import { useLeadModal } from '@/context/LeadModalContext'
import { useTranslation } from '@/i18n/useTranslation'
import { unwrapList } from '@/utils/apiList'
import styles from './PromotionDetailPage.module.css'

export function PromotionDetailPage() {
  const { promotionId } = useParams()
  const { t, locale } = useTranslation()
  const { openModal } = useLeadModal()
  const [promo, setPromo] = useState(undefined)
  const [promoList, setPromoList] = useState([])
  const [err, setErr] = useState(false)

  const idNum = parseInt(promotionId, 10)
  const validId = promotionId != null && /^\d+$/.test(String(promotionId)) && idNum > 0

  useEffect(() => {
    let c = false
    ;(async () => {
      try {
        const data = await getPromotions()
        if (!c) setPromoList(unwrapList(data))
      } catch {
        if (!c) setPromoList([])
      }
    })()
    return () => {
      c = true
    }
  }, [])

  useEffect(() => {
    if (!validId) return
    setPromo(undefined)
    setErr(false)
    let c = false
    ;(async () => {
      try {
        const data = await getPromotion(idNum)
        if (!c) {
          setPromo(data)
          setErr(false)
        }
      } catch {
        if (!c) {
          setErr(true)
          setPromo(null)
        }
      }
    })()
    return () => {
      c = true
    }
  }, [idNum, validId])

  const nav = useMemo(() => {
    if (!promo?.id || !promoList.length) return { prev: null, next: null, idx: -1 }
    const idx = promoList.findIndex((p) => p.id === promo.id)
    if (idx < 0) return { prev: null, next: null, idx: -1 }
    const prev = idx > 0 ? promoList[idx - 1].id : null
    const next = idx < promoList.length - 1 ? promoList[idx + 1].id : null
    return { prev, next, idx }
  }, [promo, promoList])

  if (!validId || err) {
    return (
      <div className="section">
        <div className={`container ${styles.narrow}`}>
          <p>{t('promotionsPage.detailNotFound')}</p>
          <Link className={styles.errBack} to="/akcii">
            {t('promotionsPage.backToAll')}
          </Link>
        </div>
      </div>
    )
  }

  if (promo === undefined) {
    return (
      <div className="section">
        <div className={`container ${styles.narrow}`}>
          <Skeleton style={{ height: 200 }} />
        </div>
      </div>
    )
  }

  const dateLocale = locale === 'en' ? 'en-US' : 'ru-RU'
  const until =
    promo.expires_at != null
      ? new Date(promo.expires_at).toLocaleString(dateLocale, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : null

  return (
    <>
      <Helmet>
        <title>
          {promo.title} — {t('promotionsPage.h1')}
        </title>
        <meta name="description" content={(promo.description || '').slice(0, 200)} />
      </Helmet>
      <div className="section">
        <div className={`container ${styles.narrow}`}>
          <p className={styles.back}>
            <Link to="/akcii">{t('promotionsPage.backToAll')}</Link>
          </p>
          <div className={styles.titleRow}>
            <h1 className={styles.h1}>{promo.title}</h1>
            <span className={styles.disc}>{promo.discount}</span>
          </div>
          {until ? (
            <p className={styles.until}>
              {t('promotionsPage.validUntil')}: {until}
            </p>
          ) : null}
          <div className={styles.body}>{promo.description}</div>

          <footer className={styles.footer}>
            <RedConsultSweepButton
              type="button"
              className={styles.consultBtn}
              onClick={() => openModal(promo.title)}
            >
              {t('promotionsPage.freeConsultCta')}
            </RedConsultSweepButton>

            <nav className={styles.pager} aria-label={t('promotionsPage.promoNavAria')}>
              {nav.prev != null ? (
                <Link className={styles.pagerSide} to={`/akcii/${nav.prev}`}>
                  <ChevronLeftIcon className={styles.pagerSideIcon} aria-hidden />
                  {t('promotionsPage.promoNavPrev')}
                </Link>
              ) : (
                <span className={`${styles.pagerSide} ${styles.pagerSideDisabled}`}>
                  <ChevronLeftIcon className={styles.pagerSideIcon} aria-hidden />
                  {t('promotionsPage.promoNavPrev')}
                </span>
              )}

              <Link className={styles.pagerAll} to="/akcii">
                {t('promotionsPage.promoNavAll')}
              </Link>

              {nav.next != null ? (
                <Link className={styles.pagerSide} to={`/akcii/${nav.next}`}>
                  {t('promotionsPage.promoNavNext')}
                  <ChevronRightIcon className={styles.pagerSideIcon} aria-hidden />
                </Link>
              ) : (
                <span className={`${styles.pagerSide} ${styles.pagerSideDisabled}`}>
                  {t('promotionsPage.promoNavNext')}
                  <ChevronRightIcon className={styles.pagerSideIcon} aria-hidden />
                </span>
              )}
            </nav>
          </footer>
        </div>
      </div>
    </>
  )
}
