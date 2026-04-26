import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { getServices } from '@/api/services'
import { ServiceCard } from '@/components/sections/ServiceCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { unwrapList } from '@/utils/apiList'
import styles from './ServicesPage.module.css'

export function ServicesPage() {
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
        <title>Услуги — РЕЗИДЕНТ</title>
        <meta name="description" content="Миграционные услуги для иностранных граждан: РВП, ВНЖ, гражданство РФ и другое." />
      </Helmet>
      <div className="section">
        <div className="container">
          <h1 className={styles.h1}>Миграционные услуги для иностранных граждан</h1>
          <figure className={styles.headerFig}>
            <img
              src="/images/services-header.svg"
              alt=""
              className={styles.headerImg}
              width={960}
              height={200}
              decoding="async"
            />
          </figure>
          <div className={styles.grid}>
            {list === null
              ? [...Array(9)].map((_, i) => <Skeleton key={i} style={{ height: 280 }} />)
              : list.map((s) => (
                  <ServiceCard key={s.slug} service={s} />
                ))}
          </div>
        </div>
      </div>
    </>
  )
}
