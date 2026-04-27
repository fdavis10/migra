import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './SitemapPage.module.css'

const LINK_KEYS = [
  ['/', 'linkHome'],
  ['/o-kompanii', 'linkAbout'],
  ['/o-kompanii/osnovatel', 'linkFounder'],
  ['/o-kompanii/preimushchestva', 'linkAdv'],
  ['/o-kompanii/oplata', 'linkPay'],
  ['/uslugi', 'linkServices'],
  ['/ceny', 'linkPrices'],
  ['/akcii', 'linkPromo'],
  ['/garantii', 'linkGuarantees'],
  ['/otzyvy', 'linkReviews'],
  ['/novosti', 'linkNews'],
  ['/faq', 'linkFaq'],
  ['/kontakty', 'linkContacts'],
  ['/privacy', 'linkPrivacy'],
]

export function SitemapPage() {
  const { t } = useTranslation()
  return (
    <>
      <Helmet>
        <title>{t('sitemapPage.title')}</title>
      </Helmet>
      <div className="section">
        <div className="container">
          <h1 className={styles.h1}>{t('sitemapPage.h1')}</h1>
          <ul className={styles.list}>
            {LINK_KEYS.map(([to, key]) => (
              <li key={to}>
                <Link to={to}>{t(`sitemapPage.${key}`)}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
