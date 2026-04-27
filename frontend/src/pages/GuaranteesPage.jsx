import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getGuarantees } from '@/api/guarantees'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useTranslation } from '@/i18n/useTranslation'
import { unwrapList } from '@/utils/apiList'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { GuaranteeHeroIcon } from '@/components/icons/GuaranteeHeroIcon'
import { GUARANTEE_IMAGE_BY_ICON } from '@/content/guaranteeImages'
import styles from './GuaranteesPage.module.css'

export function GuaranteesPage() {
  const { t } = useTranslation()
  const [list, setList] = useState(null)
  useEffect(() => {
    let c = false
    ;(async () => {
      try {
        const data = await getGuarantees()
        if (!c) setList(unwrapList(data))
      } catch {
        if (!c) setList([])
      }
    })()
    return () => {
      c = true
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>{t('guaranteesPage.title')}</title>
        <meta name="description" content={t('guaranteesPage.metaDesc')} />
      </Helmet>
      <div className="section">
        <div className="container">
          <AboutSubNav />
          <h1 className={styles.h1}>{t('guaranteesPage.h1')}</h1>
          <div className={styles.grid}>
            {list === null
              ? [...Array(4)].map((_, i) => (
                  <Skeleton key={i} className={styles.cardSkel} />
                ))
              : list.map((g) => (
                  <Card key={g.id} className={styles.card}>
                    <div className={styles.media} aria-hidden>
                      {GUARANTEE_IMAGE_BY_ICON[g.icon] ? (
                        <img
                          src={GUARANTEE_IMAGE_BY_ICON[g.icon]}
                          alt=""
                          className={styles.cardImg}
                          width={400}
                          height={400}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <span className={styles.iconFallback}>
                          <GuaranteeHeroIcon name={g.icon} />
                        </span>
                      )}
                    </div>
                    <div className={styles.cardText}>
                      <h2>{g.title}</h2>
                      <p>{g.description}</p>
                    </div>
                  </Card>
                ))}
          </div>
          <Card className={styles.cta}>
            <p>{t('guaranteesPage.cta')}</p>
            <p>
              <Link to="/otzyvy">{t('guaranteesPage.reviews')}</Link>
              {' · '}
              <Link to="/uslugi">{t('guaranteesPage.services')}</Link>
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}
