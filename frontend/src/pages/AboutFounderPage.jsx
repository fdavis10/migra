import { Helmet } from 'react-helmet-async'
import { Card } from '@/components/ui/Card'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { getFounderLetterParagraphs } from '@/content/about.i18n'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './AboutPage.module.css'

export function AboutFounderPage() {
  const { t, locale } = useTranslation()
  const letterParagraphs = getFounderLetterParagraphs(locale)
  return (
    <>
      <Helmet>
        <title>{t('aboutFounderPage.title')}</title>
        <meta name="description" content={t('aboutFounderPage.metaDesc')} />
      </Helmet>
      <div className="section">
        <div className="container">
          <AboutSubNav />
          <h1 className={styles.h1}>{t('aboutFounderPage.h1')}</h1>
          <Card className={styles.quote}>
            <span className={styles.qmark} aria-hidden>
              “
            </span>
            {letterParagraphs.map((para, i) => (
              <p key={i} className={styles.letter}>
                {para}
              </p>
            ))}
            <footer className={styles.sign}>
              {t('aboutFounderPage.signName')}
              <br />
              <span className={styles.role}>{t('aboutFounderPage.signRole')}</span>
            </footer>
          </Card>
        </div>
      </div>
    </>
  )
}
