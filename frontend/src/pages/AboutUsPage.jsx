import { Helmet } from 'react-helmet-async'
import { BuildingOffice2Icon, UserGroupIcon } from '@heroicons/react/24/outline'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { getAboutCompanyParagraphs } from '@/content/about.i18n'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './AboutPage.module.css'

function AboutIllustration() {
  return (
    <div className={styles.illuCluster} aria-hidden>
      <UserGroupIcon className={styles.illuLg} />
      <BuildingOffice2Icon className={styles.illuSm} />
    </div>
  )
}

export function AboutUsPage() {
  const { t, locale } = useTranslation()
  const paragraphs = getAboutCompanyParagraphs(locale)
  return (
    <>
      <Helmet>
        <title>{t('aboutUsPage.title')}</title>
        <meta name="description" content={t('aboutUsPage.metaDesc')} />
      </Helmet>
      <div className="section">
        <div className="container">
          <AboutSubNav />
          <div className={styles.grid2}>
            <div>
              <h1 className={styles.h1}>{t('aboutUsPage.h1')}</h1>
              {paragraphs.map((para, i) => (
                <p key={i} className={styles.p}>
                  {para}
                </p>
              ))}
            </div>
            <AboutIllustration />
          </div>
        </div>
      </div>
    </>
  )
}
