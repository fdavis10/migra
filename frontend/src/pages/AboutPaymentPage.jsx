import { Helmet } from 'react-helmet-async'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { PAYMENT_METHODS } from '@/content/pricingExtras'
import styles from './AboutPage.module.css'

export function AboutPaymentPage() {
  return (
    <>
      <Helmet>
        <title>Оплата — РЕЗИДЕНТ</title>
        <meta name="description" content="Способы оплаты услуг миграционного сервиса «РЕЗИДЕНТ»." />
      </Helmet>
      <div className="section">
        <div className="container">
          <AboutSubNav />
          <h1 className={styles.h1}>Способы оплаты</h1>
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
