import { Helmet } from 'react-helmet-async'
import { BuildingOffice2Icon, UserGroupIcon } from '@heroicons/react/24/outline'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { ABOUT_COMPANY } from '@/content/about'
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
  return (
    <>
      <Helmet>
        <title>О нас — РЕЗИДЕНТ</title>
        <meta name="description" content="Миграционный сервис РЕЗИДЕНТ: команда специалистов по легализации в РФ." />
      </Helmet>
      <div className="section">
        <div className="container">
          <AboutSubNav />
          <div className={styles.grid2}>
            <div>
              <h1 className={styles.h1}>О нас</h1>
              {ABOUT_COMPANY.split('\n\n').map((para, i) => (
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
