import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { getPrices } from '@/api/prices'
import { Card } from '@/components/ui/Card'
import { PriceCategoryAccordion } from '@/components/sections/PriceCategoryAccordion'
import { Skeleton } from '@/components/ui/Skeleton'
import { getDiscountCards, getPaymentMethods } from '@/content/pricingExtras.i18n'
import { useTranslation } from '@/i18n/useTranslation'
import { unwrapList } from '@/utils/apiList'
import styles from './PricesPage.module.css'

/** Квота и РВП — фиксированный порядок; остальные — по полю order с бэкенда. */
function sortPriceCategories(list) {
  if (!list?.length) return list
  const priority = (cat) => {
    if (cat.service_slug === 'kvota-rvp') return 0
    if (cat.service_slug === 'rvp') return 1
    return 2
  }
  return [...list].sort((a, b) => {
    const d = priority(a) - priority(b)
    if (d !== 0) return d
    return (Number(a.order) || 0) - (Number(b.order) || 0) || (Number(a.id) || 0) - (Number(b.id) || 0)
  })
}

export function PricesPage() {
  const { t, locale } = useTranslation()
  const [cats, setCats] = useState(null)
  useEffect(() => {
    let c = false
    ;(async () => {
      try {
        const data = await getPrices()
        if (!c) setCats(sortPriceCategories(unwrapList(data)))
      } catch {
        if (!c) setCats([])
      }
    })()
    return () => {
      c = true
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>{t('pricesPage.metaTitle')}</title>
        <meta name="description" content={t('pricesPage.metaDesc')} />
      </Helmet>
      <div className="section">
        <div className="container">
          <h1 className={styles.h1}>{t('pricesPage.h1')}</h1>
          <p className={styles.lead}>{t('pricesPage.lead')}</p>

          {cats === null
            ? [...Array(4)].map((_, i) => <Skeleton key={i} style={{ height: 160, marginBottom: 24 }} />)
            : cats.map((cat) => <PriceCategoryAccordion key={cat.id} category={cat} />)}

          <h2 className={styles.h2}>{t('pricesPage.discountTitle')}</h2>
          <div className={styles.discGrid}>
            {getDiscountCards(locale).map((d) => (
              <Card key={d.title} className={styles.discCard}>
                <span className={styles.discBadge}>{d.discount}</span>
                <h3>{d.title}</h3>
                <p>{d.text}</p>
              </Card>
            ))}
          </div>

          <h2 className={styles.h2}>{t('pricesPage.paymentTitle')}</h2>
          <ul className={styles.pay}>
            {getPaymentMethods(locale).map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
