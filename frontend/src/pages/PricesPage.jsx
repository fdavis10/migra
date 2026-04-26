import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { getPrices } from '@/api/prices'
import { Card } from '@/components/ui/Card'
import { PriceTable } from '@/components/sections/PriceTable'
import { Skeleton } from '@/components/ui/Skeleton'
import { DISCOUNT_CARDS, PAYMENT_METHODS } from '@/content/pricingExtras'
import { unwrapList } from '@/utils/apiList'
import styles from './PricesPage.module.css'

export function PricesPage() {
  const [cats, setCats] = useState(null)
  useEffect(() => {
    let c = false
    ;(async () => {
      try {
        const data = await getPrices()
        if (!c) setCats(unwrapList(data))
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
        <title>Цены — РЕЗИДЕНТ</title>
        <meta name="description" content="Прайс-лист миграционного сервиса. Фиксированные цены в договоре." />
      </Helmet>
      <div className="section">
        <div className="container">
          <h1 className={styles.h1}>Прайс-лист миграционного сервиса «РЕЗИДЕНТ»</h1>
          <p className={styles.lead}>
            Фиксированные цены. Окончательная стоимость прописывается в договоре и не меняется.
          </p>

          {cats === null
            ? [...Array(4)].map((_, i) => <Skeleton key={i} style={{ height: 160, marginBottom: 24 }} />)
            : cats.map((cat) => (
                <section key={cat.id} className={styles.block}>
                  <h2 className={styles.catTitle}>{cat.title}</h2>
                  <PriceTable category={cat} />
                </section>
              ))}

          <h2 className={styles.h2}>Гибкая система скидок — от 7% до 16%</h2>
          <div className={styles.discGrid}>
            {DISCOUNT_CARDS.map((d) => (
              <Card key={d.title} className={styles.discCard}>
                <span className={styles.discBadge}>{d.discount}</span>
                <h3>{d.title}</h3>
                <p>{d.text}</p>
              </Card>
            ))}
          </div>

          <h2 className={styles.h2}>Способы оплаты</h2>
          <ul className={styles.pay}>
            {PAYMENT_METHODS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
