import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getNews } from '@/api/news'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { mediaUrl } from '@/utils/mediaUrl'
import styles from './NewsPage.module.css'

export function NewsPage() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)

  useEffect(() => {
    let c = false
    ;(async () => {
      try {
        const d = await getNews(page)
        if (!c) setData(d)
      } catch {
        if (!c) setData({ results: [], count: 0 })
      }
    })()
    return () => {
      c = true
    }
  }, [page])

  const results = Array.isArray(data) ? data : data?.results || []
  const count = data?.count ?? results.length
  const pageSize = 12
  const totalPages = Math.max(1, Math.ceil(count / pageSize))

  return (
    <>
      <Helmet>
        <title>Новости — РЕЗИДЕНТ</title>
        <meta name="description" content="Новости миграционного законодательства." />
      </Helmet>
      <div className="section">
        <div className={`container ${styles.layout}`}>
          <div>
            <h1 className={styles.h1}>Новости миграционного законодательства</h1>
            <div className={styles.grid}>
              {data === null
                ? [...Array(6)].map((_, i) => <Skeleton key={i} style={{ height: 200 }} />)
                : results.map((n) => (
                    <Card key={n.slug} className={styles.card}>
                      {mediaUrl(n.image) ? (
                        <Link to={`/novosti/${n.slug}`} className={styles.thumbWrap}>
                          <img
                            src={mediaUrl(n.image)}
                            alt=""
                            className={styles.thumb}
                            width={640}
                            height={360}
                            loading="lazy"
                            decoding="async"
                          />
                        </Link>
                      ) : null}
                      <time className={styles.date}>
                        {n.published_at ? new Date(n.published_at).toLocaleDateString('ru-RU') : ''}
                      </time>
                      {n.category ? <span className={styles.cat}>{n.category}</span> : null}
                      <h2 className={styles.title}>
                        <Link to={`/novosti/${n.slug}`}>{n.title}</Link>
                      </h2>
                      <p className={styles.exc}>{n.excerpt}</p>
                      <Link to={`/novosti/${n.slug}`} className={styles.read}>
                        Читать далее
                      </Link>
                    </Card>
                  ))}
            </div>
            {totalPages > 1 ? (
              <div className={styles.pag}>
                <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Назад
                </button>
                <span>
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Вперёд
                </button>
              </div>
            ) : null}
          </div>
          <aside className={styles.side}>
            <Card className={styles.sideCard}>
              <h3>Популярное</h3>
              <ul className={styles.sideList}>
                {results.slice(0, 4).map((n) => (
                  <li key={n.slug}>
                    <Link to={`/novosti/${n.slug}`}>{n.title}</Link>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className={styles.sideCard}>
              <h3>Подписка</h3>
              <p className={styles.small}>Скоро — рассылка об изменениях в законодательстве.</p>
            </Card>
          </aside>
        </div>
      </div>
    </>
  )
}
