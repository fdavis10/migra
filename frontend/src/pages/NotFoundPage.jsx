import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import btn from '@/components/ui/Button.module.css'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <>
      <Helmet>
        <title>{t('notFound.title')}</title>
      </Helmet>
      <div className={`section ${styles.wrap}`}>
        <div className="container">
          <h1 className={styles.code}>404</h1>
          <p className={styles.text}>{t('notFound.text')}</p>
          <Link to="/" className={`${btn.btn} ${btn.primary} ${btn.md}`}>
            {t('notFound.home')}
          </Link>
          <ul className={styles.links}>
            <li>
              <Link to="/uslugi/rvp">{t('notFound.linkRvp')}</Link>
            </li>
            <li>
              <Link to="/uslugi/vnzh">{t('notFound.linkVnzh')}</Link>
            </li>
            <li>
              <Link to="/uslugi/grazhdanstvo">{t('notFound.linkCitizenship')}</Link>
            </li>
            <li>
              <Link to="/ceny">{t('notFound.linkPrices')}</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
