import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { getReviews } from '@/api/reviews'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { unwrapList } from '@/utils/apiList'
import styles from './ReviewsPage.module.css'

const FILTERS = ['Все', 'РВП', 'ВНЖ', 'Гражданство РФ', 'Прочее']

export function ReviewsPage() {
  const [list, setList] = useState(null)
  const [filter, setFilter] = useState('Все')

  useEffect(() => {
    let c = false
    ;(async () => {
      try {
        const data = await getReviews()
        if (!c) setList(unwrapList(data))
      } catch {
        if (!c) setList([])
      }
    })()
    return () => {
      c = true
    }
  }, [])

  const filtered = useMemo(() => {
    if (!list) return []
    if (filter === 'Все') return list
    if (filter === 'Прочее') {
      return list.filter(
        (r) => !['РВП', 'ВНЖ', 'Гражданство РФ'].some((k) => (r.service || '').includes(k)),
      )
    }
    return list.filter((r) => (r.service || '').includes(filter.replace(' РФ', '')))
  }, [list, filter])

  const avg =
    list?.length > 0 ? (list.reduce((s, r) => s + (r.rating || 5), 0) / list.length).toFixed(1) : '—'

  return (
    <>
      <Helmet>
        <title>Отзывы — РЕЗИДЕНТ</title>
        <meta name="description" content="Отзывы клиентов миграционного сервиса РЕЗИДЕНТ." />
      </Helmet>
      <div className="section">
        <div className="container">
          <AboutSubNav />
          <h1 className={styles.h1}>Отзывы наших клиентов</h1>
          <p className={styles.rating}>
            Средняя оценка: <strong>{avg}</strong> / 5
          </p>
          <div className={styles.filters}>
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={f === filter ? styles.fActive : styles.f}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className={styles.grid}>
            {list === null
              ? [...Array(6)].map((_, i) => <Skeleton key={i} style={{ height: 160 }} />)
              : filtered.map((r) => (
                  <Card key={r.id} className={styles.card}>
                    <div className={styles.head}>
                      <span className={styles.avatar}>{r.name?.slice(0, 1)}</span>
                      <div>
                        <strong>{r.name}</strong>
                        <div className={styles.svc}>{r.service}</div>
                      </div>
                    </div>
                    <p className={styles.text}>{r.text}</p>
                    <footer className={styles.src}>{r.source}</footer>
                  </Card>
                ))}
          </div>
        </div>
      </div>
    </>
  )
}
