import { Helmet } from 'react-helmet-async'
import { Card } from '@/components/ui/Card'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { WhyUsHeroIcon } from '@/components/icons/WhyUsHeroIcon'
import { getWhyUs } from '@/content/marketing.i18n'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './AboutPage.module.css'

export function AboutAdvantagesPage() {
  const { t, locale } = useTranslation()
  const whyUs = getWhyUs(locale)
  return (
    <>
      <Helmet>
        <title>{t('aboutAdvantagesPage.title')}</title>
        <meta name="description" content={t('aboutAdvantagesPage.metaDesc')} />
      </Helmet>
      <div className="section">
        <div className="container">
          <AboutSubNav />
          <h1 className={styles.h1}>{t('aboutAdvantagesPage.h1')}</h1>
          <div className={styles.why}>
            {whyUs.map((b) => (
              <Card key={b.title} className={styles.whyCard}>
                <span className={styles.whyIconWrap} aria-hidden>
                  <WhyUsHeroIcon variant={b.icon} />
                </span>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
