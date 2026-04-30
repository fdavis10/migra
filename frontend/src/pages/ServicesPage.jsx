import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { getServices } from '@/api/services'
import { ServiceCard } from '@/components/sections/ServiceCard'
import { Skeleton } from '@/components/ui/Skeleton'
import otherPassportsImage from '@assets/image/other_passpots.jpeg'
import { unwrapList } from '@/utils/apiList'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './ServicesPage.module.css'

export function ServicesPage() {
  const { t } = useTranslation()
  const [list, setList] = useState(null)

  useEffect(() => {
    let c = false
    ;(async () => {
      try {
        const data = await getServices()
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
        <title>{t('servicesPage.title')}</title>
        <meta name="description" content={t('servicesPage.metaDesc')} />
      </Helmet>
      <div className="section">
        <div className="container">
          <h1 className={styles.h1}>{t('servicesPage.h1')}</h1>
          <figure className={styles.parallaxFrame}>
            <div className={styles.parallaxMover}>
              <img
                src={otherPassportsImage}
                alt=""
                className={styles.parallaxImg}
                width={625}
                height={350}
                decoding="async"
              />
            </div>
          </figure>
          <div className={styles.grid}>
            {list === null
              ? [...Array(9)].map((_, i) => <Skeleton key={i} style={{ height: 280 }} />)
              : list.map((s) => (
                  <ServiceCard key={s.slug} service={s} showPrice={false} />
                ))}
          </div>
        </div>
      </div>
    </>
  )
}
