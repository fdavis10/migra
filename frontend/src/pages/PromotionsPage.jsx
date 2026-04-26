import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { getPromotions } from '@/api/promos'
import { Card } from '@/components/ui/Card'
import { CountdownTimer } from '@/components/sections/CountdownTimer'
import { Skeleton } from '@/components/ui/Skeleton'
import { unwrapList } from '@/utils/apiList'
import styles from './PromotionsPage.module.css'

export function PromotionsPage() {
  const [list, setList] = useState(null)
  useEffect(() => {
    let c = false
    ;(async () => {
      try {
        const data = await getPromotions()
        if (!c) setList(unwrapList(data))
      } catch {
        if (!c) setList([])
      }
    })()
    return () => {
      c = true
    }
  }, [])

  const until = list?.[0]?.expires_at

  return (
    <>
      <Helmet>
        <title>Акции — РЕЗИДЕНТ</title>
        <meta name="description" content="Акции и специальные предложения миграционного сервиса РЕЗИДЕНТ." />
      </Helmet>
      <div className="section">
        <div className="container">
          <h1 className={styles.h1}>Акции и специальные предложения</h1>
          <div className={styles.timer}>
            <CountdownTimer until={until} />
          </div>
          <div className={styles.grid}>
            {list === null
              ? [...Array(6)].map((_, i) => <Skeleton key={i} style={{ height: 140 }} />)
              : list.map((p) => (
                  <Card key={p.id} className={styles.card}>
                    <span className={styles.disc}>{p.discount}</span>
                    <h2>{p.title}</h2>
                    <p>{p.description}</p>
                  </Card>
                ))}
          </div>
        </div>
      </div>
    </>
  )
}
