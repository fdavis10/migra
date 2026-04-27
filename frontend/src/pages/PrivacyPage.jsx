import { Helmet } from 'react-helmet-async'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './PrivacyPage.module.css'

export function PrivacyPage() {
  const { t } = useTranslation()
  return (
    <>
      <Helmet>
        <title>{t('privacyPage.title')}</title>
      </Helmet>
      <div className="section">
        <div className={`container ${styles.wrap}`}>
          <h1>{t('privacyPage.h1')}</h1>
          <p>{t('privacyPage.p1')}</p>
          <p>{t('privacyPage.p2')}</p>
        </div>
      </div>
    </>
  )
}
