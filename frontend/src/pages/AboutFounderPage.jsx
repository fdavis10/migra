import { Helmet } from 'react-helmet-async'
import { Card } from '@/components/ui/Card'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { FOUNDER_LETTER } from '@/content/about'
import styles from './AboutPage.module.css'

export function AboutFounderPage() {
  return (
    <>
      <Helmet>
        <title>Основатель — РЕЗИДЕНТ</title>
        <meta name="description" content="Письмо основателя миграционного сервиса «РЕЗИДЕНТ» Андрея Степанова." />
      </Helmet>
      <div className="section">
        <div className="container">
          <AboutSubNav />
          <h1 className={styles.h1}>Основатель</h1>
          <Card className={styles.quote}>
            <span className={styles.qmark} aria-hidden>
              “
            </span>
            {FOUNDER_LETTER.split('\n\n').map((para, i) => (
              <p key={i} className={styles.letter}>
                {para}
              </p>
            ))}
            <footer className={styles.sign}>
              Андрей Степанов
              <br />
              <span className={styles.role}>Основатель миграционного сервиса «РЕЗИДЕНТ»</span>
            </footer>
          </Card>
        </div>
      </div>
    </>
  )
}
