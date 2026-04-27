import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { getReviews } from '@/api/reviews'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { useTranslation } from '@/i18n/useTranslation'
import { unwrapList } from '@/utils/apiList'
import styles from './ReviewsPage.module.css'

const FILTER_KEYS = ['all', 'rvp', 'vnzh', 'cit', 'other']

function reviewFilterLabel(key, t) {
  const paths = {
    all: 'reviewsPage.filterAll',
    rvp: 'reviewsPage.filterRvp',
    vnzh: 'reviewsPage.filterVnzh',
    cit: 'reviewsPage.filterCit',
    other: 'reviewsPage.filterOther',
  }
  return t(paths[key] || paths.all)
}

/** Match review to filter using service_slug (preferred) + RU/EN legacy labels */
function matchesReviewFilter(r, filterKey) {
  const slug = (r.service_slug || '').trim().toLowerCase()
  const label = `${r.service || ''} `.toLowerCase()
  if (filterKey === 'all') return true
  if (filterKey === 'rvp') {
    return slug === 'rvp' || label.includes('рвп') || /\btrp\b/.test(label)
  }
  if (filterKey === 'vnzh') {
    return slug === 'vnzh' || label.includes('внж') || /\bprp\b/.test(label) || label.includes('permanent residence')
  }
  if (filterKey === 'cit') {
    return (
      slug === 'grazhdanstvo' ||
      label.includes('гражданство') ||
      label.includes('citizenship of') ||
      label.includes('citizenship')
    )
  }
  if (filterKey === 'other') {
    if (slug && ['rvp', 'vnzh', 'grazhdanstvo'].includes(slug)) return false
    if (label.includes('рвп') || label.includes('внж') || label.includes('гражданство')) return false
    if (/\btrp\b/.test(label) || /\bprp\b/.test(label) || label.includes('permanent residence')) return false
    if (label.includes('citizenship')) return false
    return true
  }
  return true
}

export function ReviewsPage() {
  const { t } = useTranslation()
  const [list, setList] = useState(null)
  const [filter, setFilter] = useState('all')

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
    return list.filter((r) => matchesReviewFilter(r, filter))
  }, [list, filter])

  const avg =
    list?.length > 0 ? (list.reduce((s, r) => s + (r.rating || 5), 0) / list.length).toFixed(1) : '—'

  return (
    <>
      <Helmet>
        <title>{t('reviewsPage.title')}</title>
        <meta name="description" content={t('reviewsPage.metaDesc')} />
      </Helmet>
      <div className="section">
        <div className="container">
          <AboutSubNav />
          <h1 className={styles.h1}>{t('reviewsPage.h1')}</h1>
          <p className={styles.rating}>
            {t('reviewsPage.avg')} <strong>{avg}</strong> {t('reviewsPage.outOf')}
          </p>
          <div className={styles.filters}>
            {FILTER_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                className={key === filter ? styles.fActive : styles.f}
                onClick={() => setFilter(key)}
              >
                {reviewFilterLabel(key, t)}
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
