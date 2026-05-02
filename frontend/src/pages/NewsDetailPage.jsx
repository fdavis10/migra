import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getNews, getNewsItem } from '@/api/news'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useLeadModal } from '@/context/LeadModalContext'
import { useTranslation } from '@/i18n/useTranslation'
import { mediaUrl } from '@/utils/mediaUrl'
import styles from './NewsDetailPage.module.css'

export function NewsDetailPage() {
  const { slug } = useParams()
  const { openModal } = useLeadModal()
  const { t, locale } = useTranslation()
  const dateLocale = locale === 'en' ? 'en-US' : 'ru-RU'
  const [article, setArticle] = useState(null)
  const [related, setRelated] = useState([])
  const [err, setErr] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const a = await getNewsItem(slug)
        const list = await getNews(1)
        const results = Array.isArray(list) ? list : list?.results || []
        if (!cancelled) {
          setArticle(a)
          setRelated(results.filter((x) => x.slug !== slug).slice(0, 3))
        }
      } catch {
        if (!cancelled) setErr(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug])

  if (err) {
    return (
      <div className="section container">
        <p>{t('newsDetailPage.notFound')}</p>
        <Link to="/novosti">{t('newsDetailPage.toNews')}</Link>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="section container">
        <Skeleton style={{ height: 240 }} />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>
          {article.title} {t('common.titleSuffix')}
        </title>
        <meta name="description" content={article.excerpt} />
      </Helmet>
      <article className="section">
        <div className="container">
          <header className={styles.head}>
            <time>
              {article.published_at ? new Date(article.published_at).toLocaleDateString(dateLocale) : ''}
            </time>
            {article.category ? <span className={styles.cat}>{article.category}</span> : null}
            <h1 className={styles.h1}>{article.title}</h1>
          </header>
          {mediaUrl(article.image) ? (
            <figure className={styles.featuredFig}>
              <img
                src={mediaUrl(article.image)}
                alt=""
                className={styles.featuredImg}
                width={960}
                height={540}
                sizes="(max-width: 1200px) 100vw, 960px"
                decoding="async"
                fetchPriority="high"
              />
            </figure>
          ) : null}
          <div className={styles.body} dangerouslySetInnerHTML={{ __html: article.content }} />

          <h2 className={styles.h2}>{t('newsDetailPage.related')}</h2>
          <ul className={styles.rel}>
            {related.map((n) => (
              <li key={n.slug}>
                <Link to={`/novosti/${n.slug}`}>{n.title}</Link>
              </li>
            ))}
          </ul>

          <Card className={styles.cta}>
            <p>{t('newsDetailPage.cta')}</p>
            <Button type="button" variant="primary" onClick={() => openModal()}>
              {t('header.ctaConsultation')}
            </Button>
          </Card>
        </div>
      </article>
    </>
  )
}
