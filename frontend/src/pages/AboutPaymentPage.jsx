import { Helmet } from 'react-helmet-async'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { getPaymentMethods } from '@/content/pricingExtras.i18n'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './AboutPage.module.css'

export function AboutPaymentPage() {
  const { t, locale } = useTranslation()
  return (
    <>
      <Helmet>
        <title>{t('aboutPaymentPage.title')}</title>
        <meta name="description" content={t('aboutPaymentPage.metaDesc')} />
      </Helmet>
      <div className="section">
        <div className="container">
          <AboutSubNav />
          <h1 className={styles.h1}>{t('aboutPaymentPage.h1')}</h1>
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
