import { Helmet } from 'react-helmet-async'
import { Card } from '@/components/ui/Card'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { WhyUsHeroIcon } from '@/components/icons/WhyUsHeroIcon'
import { WHY_US } from '@/content/marketing'
import styles from './AboutPage.module.css'

export function AboutAdvantagesPage() {
  return (
    <>
      <Helmet>
        <title>Преимущества — РЕЗИДЕНТ</title>
        <meta name="description" content="Почему клиенты выбирают миграционный сервис «РЕЗИДЕНТ»." />
      </Helmet>
      <div className="section">
        <div className="container">
          <AboutSubNav />
          <h1 className={styles.h1}>Преимущества</h1>
          <div className={styles.why}>
            {WHY_US.map((b) => (
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
