import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getService, getServices } from '@/api/services'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Accordion } from '@/components/sections/Accordion'
import { ServiceLeadForm } from '@/components/sections/ServiceLeadForm'
import { useLeadModal } from '@/context/LeadModalContext'
import { formatRub, priceLine } from '@/utils/money'
import { unwrapList } from '@/utils/apiList'
import styles from './ServiceDetailPage.module.css'

function renderContentSection(block, i) {
  if (block.type === 'paragraph' && block.text) {
    return (
      <p key={i} className={styles.articleP}>
        {block.text}
      </p>
    )
  }
  if (block.type === 'heading' && block.text) {
    const level = block.level === 3 ? 3 : 2
    if (level === 3) {
      return (
        <h3 key={i} className={styles.articleH3}>
          {block.text}
        </h3>
      )
    }
    return (
      <h2 key={i} className={styles.articleH2}>
        {block.text}
      </h2>
    )
  }
  if (block.type === 'list' && Array.isArray(block.items) && block.items.length) {
    const ListTag = block.ordered ? 'ol' : 'ul'
    const listCls = block.ordered ? styles.richOl : styles.richUl
    return (
      <ListTag key={i} className={listCls}>
        {block.items.map((item, j) => (
          <li key={j} className={styles.richLi}>
            {item}
          </li>
        ))}
      </ListTag>
    )
  }
  if (block.type === 'figure' && block.src) {
    return (
      <figure key={i} className={styles.figure}>
        <img
          src={block.src}
          alt={block.alt || ''}
          className={styles.figureImg}
          width={1200}
          height={675}
          loading="lazy"
          decoding="async"
        />
        {block.caption ? <figcaption className={styles.figureCap}>{block.caption}</figcaption> : null}
      </figure>
    )
  }
  return null
}

export function ServiceDetailPage() {
  const { slug } = useParams()
  const { openModal } = useLeadModal()
  const [status, setStatus] = useState('loading')
  const [svc, setSvc] = useState(null)
  const [all, setAll] = useState([])

  useEffect(() => {
    let c = false
    setStatus('loading')
    ;(async () => {
      try {
        const [s, a] = await Promise.all([getService(slug), getServices()])
        if (!c) {
          setSvc(s)
          setAll(unwrapList(a))
          setStatus('ok')
        }
      } catch {
        if (!c) setStatus('error')
      }
    })()
    return () => {
      c = true
    }
  }, [slug])

  if (status === 'loading' || (status === 'ok' && !svc)) {
    return (
      <div className="section container">
        <Skeleton style={{ height: 200 }} />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="section container">
        <p>Услуга не найдена.</p>
        <Link to="/uslugi">К списку услуг</Link>
      </div>
    )
  }

  const d = svc.detail || {}
  const similar = all.filter((x) => x.slug !== svc.slug).slice(0, 3)
  const introBlocks = (svc.short_desc || '')
    .split(/\n\n+/)
    .map((t) => t.trim())
    .filter(Boolean)
  const sections = Array.isArray(d.content_sections) ? d.content_sections : []
  const richArticle =
    sections.length >= 6 && sections.some((b) => b.type === 'heading' && (b.level === 2 || !b.level))
  const faqItems = d.faq?.length ? d.faq : d.faqs

  return (
    <>
      <Helmet>
        <title>{svc.title} — РЕЗИДЕНТ</title>
        <meta name="description" content={svc.short_desc} />
      </Helmet>

      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.h1}>{svc.title}</h1>
          <p className={styles.price}>{priceLine(svc)}</p>
          {introBlocks.map((t, i) => (
            <p key={i} className={styles.intro}>
              {t}
            </p>
          ))}
          <div className={styles.cta}>
            <Button type="button" size="lg" onClick={() => openModal(svc.title)}>
              Бесплатная консультация
            </Button>
            <Link to="/ceny" className={styles.linkCeny}>
              Прайс-лист
            </Link>
          </div>
        </div>
      </section>

      {sections.length ? (
        <section className={`section ${styles.articleSection}`}>
          <div className={`container ${styles.article}`}>{sections.map((b, i) => renderContentSection(b, i))}</div>
        </section>
      ) : null}

      {d.why_choose?.length ? (
        <section className="section">
          <div className="container">
            <h2 className="sectionTitle">Почему выбирают нас</h2>
            <ul className={styles.bullets}>
              {d.why_choose.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {d.packages?.length ? (
        <section className={`section ${styles.muted}`}>
          <div className="container">
            <h2 className="sectionTitle">Пакеты услуг</h2>
            <div className={styles.pkgGrid}>
              {d.packages.map((p) => (
                <Card key={p.name} className={styles.pkg}>
                  <h3>{p.name}</h3>
                  <p className={styles.pkgPrice}>{p.price ? `от ${formatRub(p.price)}` : ''}</p>
                  <p className={styles.pkgDesc}>{p.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {d.status_advantages?.length ? (
        <section className="section">
          <div className="container">
            <h2 className="sectionTitle">Преимущества статуса</h2>
            <div className={styles.advGrid}>
              {d.status_advantages.map((x) => (
                <Card key={x.title} className={styles.adv}>
                  <strong>{x.title}</strong>
                  <p>{x.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {d.appeal_stages?.length ? (
        <section className="section">
          <div className="container">
            <h2 className="sectionTitle">Этапы и ориентиры по стоимости</h2>
            <ol className={styles.stages}>
              {d.appeal_stages.map((st) => (
                <li key={st.title}>
                  <strong>{st.title}</strong> — от {formatRub(st.price)} ({st.duration})
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {d.steps_timeline?.length ? (
        <section className={`section ${styles.muted}`}>
          <div className="container">
            <h2 className="sectionTitle">Путь к гражданству</h2>
            <div className={styles.timeline}>
              {d.steps_timeline.map((t, i) => (
                <div key={t} className={styles.tlItem}>
                  <span className={styles.tlNum}>{i + 1}</span>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {d.risks && !richArticle ? (
        <section className="section">
          <div className="container">
            <Card className={styles.warn}>
              <h2 className={styles.warnTitle}>Риски самостоятельного оформления</h2>
              <p>{d.risks}</p>
            </Card>
          </div>
        </section>
      ) : null}

      {d.documents?.length && !richArticle ? (
        <section className={`section ${styles.muted}`}>
          <div className="container">
            <h2 className="sectionTitle">Необходимые документы</h2>
            <ol className={styles.docs}>
              {d.documents.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {d.steps?.length && !richArticle ? (
        <section className="section">
          <div className="container">
            <h2 className="sectionTitle">Этапы работы</h2>
            <ol className={styles.docs}>
              {d.steps.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <section className={`section ${styles.muted}`} id="zayavka">
        <div className={`container ${styles.leadSection}`}>
          <h2 className="sectionTitle">Заявка на услугу</h2>
          <p className={styles.leadLead}>
            Заполните форму — перезвоним, уточним детали и предложим удобное время встречи или онлайн-консультации.
          </p>
          <ServiceLeadForm serviceTitle={svc.title} sourcePath={`/uslugi/${slug}`} />
        </div>
      </section>

      {faqItems?.length ? (
        <section className={`section ${styles.muted}`}>
          <div className="container">
            <h2 className="sectionTitle">Частые вопросы</h2>
            <Accordion items={faqItems} />
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <h2 className="sectionTitle">Похожие услуги</h2>
          <ul className={styles.sim}>
            {similar.map((s) => (
              <li key={s.slug}>
                <Link to={`/uslugi/${s.slug}`}>{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
