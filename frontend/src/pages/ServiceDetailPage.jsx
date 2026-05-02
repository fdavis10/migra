import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ArrowPathRoundedSquareIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  GiftIcon,
  InformationCircleIcon,
  LightBulbIcon,
  LinkIcon,
  ListBulletIcon,
  QuestionMarkCircleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { getService, getServices } from '@/api/services'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Accordion } from '@/components/sections/Accordion'
import { ServiceLeadForm } from '@/components/sections/ServiceLeadForm'
import { useLeadModal } from '@/context/LeadModalContext'
import { useTranslation } from '@/i18n/useTranslation'
import { formatRub, priceLine } from '@/utils/money'
import { unwrapList } from '@/utils/apiList'
import styles from './ServiceDetailPage.module.css'

const SERVICE_HERO_IMAGES = {
  'kvota-rvp': { src: '/images/kvota_rvp.jpg', width: 1152, height: 768 },
  rvp: { src: '/images/rvp.jpg', width: 736, height: 491 },
  vnzh: { src: '/images/vnz.jpg', width: 600, height: 400 },
  grazhdanstvo: { src: '/images/graz_rf.jpg', width: 1024, height: 683 },
  'pasport-rf': { src: '/images/pass.jpg', width: 735, height: 490 },
  rnr: { src: '/images/rnr.jpg', width: 1200, height: 800 },
  'zapret-na-vezd': { src: '/images/znv.jpg', width: 1200, height: 800 },
  deportaciya: { src: '/images/deport.jpg', width: 1000, height: 667 },
  vydvorenie: { src: '/images/admin.jpg', width: 900, height: 600 },
  'vremennoe-ubezhishhe': { src: '/images/vubezh.jpg', width: 907, height: 605 },
  'ustanovlenie-lichnosti': { src: '/images/person.jpg', width: 735, height: 490 },
  rvpo: { src: '/images/vnzh.jpg', width: 1200, height: 1091 },
  repatriaciya: { src: '/images/repart.jpg', width: 736, height: 414 },
  konsultaciya: { src: '/images/perplan.jpg', width: 736, height: 736 },
  bezhencz: { src: '/images/bezh.jpg', width: 867, height: 577 },
  'vyhod-iz-grazhdanstva': { src: '/images/grrf.jpg', width: 1198, height: 631 },
  patent: { src: '/images/patent.jpg', width: 1199, height: 660 },
}

function DetailSection({ icon: Icon, title, children, muted = false, bodyClassName = '' }) {
  return (
    <section className={muted ? `section ${styles.muted}` : 'section'}>
      <div className="container">
        <div className={styles.detailPanel}>
          <header className={styles.panelHeader}>
            {Icon ? (
              <span className={styles.panelIcon} aria-hidden>
                <Icon className={styles.panelIconSvg} />
              </span>
            ) : null}
            <h2 className={`sectionTitle ${styles.panelTitle}`}>{title}</h2>
          </header>
          <div className={[styles.panelBody, bodyClassName].filter(Boolean).join(' ')}>{children}</div>
        </div>
      </div>
    </section>
  )
}

function groupContentSections(sections) {
  if (!Array.isArray(sections) || sections.length === 0) return []
  const groups = []
  let current = []
  for (const block of sections) {
    const isH2 = block.type === 'heading' && block.level !== 3
    if (isH2 && current.length > 0) {
      groups.push(current)
      current = [block]
    } else {
      current.push(block)
    }
  }
  if (current.length) groups.push(current)
  return groups
}

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
          sizes="(max-width: 1200px) 100vw, 900px"
          loading="lazy"
          decoding="async"
        />
        {block.caption ? <figcaption className={styles.figureCap}>{block.caption}</figcaption> : null}
      </figure>
    )
  }
  if (block.type === 'callout' && block.text) {
    const variant = ['info', 'tip', 'warning'].includes(block.variant) ? block.variant : 'info'
    const CalloutIcon =
      variant === 'warning' ? ExclamationTriangleIcon : variant === 'tip' ? LightBulbIcon : InformationCircleIcon
    return (
      <aside key={i} className={`${styles.callout} ${styles[`callout_${variant}`]}`}>
        <CalloutIcon className={styles.calloutIcon} aria-hidden />
        <p className={styles.calloutText}>{block.text}</p>
      </aside>
    )
  }
  return null
}

export function ServiceDetailPage() {
  const { slug } = useParams()
  const { openModal } = useLeadModal()
  const { t } = useTranslation()
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
        <p>{t('serviceDetail.notFound')}</p>
        <Link to="/uslugi">{t('serviceDetail.toList')}</Link>
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
  const heroVisual = SERVICE_HERO_IMAGES[slug]

  return (
    <>
      <Helmet>
        <title>
          {svc.title} {t('common.titleSuffix')}
        </title>
        <meta name="description" content={svc.short_desc} />
      </Helmet>

      <section className={styles.hero}>
        <div
          className={`container ${styles.heroGrid} ${heroVisual ? styles.heroGridSplit : ''}`}
        >
          <div className={styles.heroMain}>
            <h1 className={styles.h1}>{svc.title}</h1>
            <p className={styles.price}>{priceLine(svc, t)}</p>
            {introBlocks.map((t, i) => (
              <p key={i} className={styles.intro}>
                {t}
              </p>
            ))}
            <div className={styles.cta}>
              <Button type="button" size="lg" onClick={() => openModal(svc.title)}>
                {t('header.ctaConsultation')}
              </Button>
              <Link to="/ceny" className={styles.linkCeny}>
                {t('serviceDetail.priceList')}
              </Link>
            </div>
          </div>
          {heroVisual ? (
            <figure className={styles.heroFigure}>
              <img
                src={heroVisual.src}
                alt=""
                className={styles.heroImg}
                width={heroVisual.width}
                height={heroVisual.height}
                sizes="(max-width: 1023px) 100vw, 45vw"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </figure>
          ) : null}
        </div>
      </section>

      {sections.length ? (
        <section className={`section ${styles.articleSection}`}>
          <div className={`container ${styles.articleWrap}`}>
            {groupContentSections(sections).map((group, gi) => (
              <div key={gi} className={styles.proseCard}>
                <div className={styles.article}>{group.map((b, i) => renderContentSection(b, `g${gi}-${i}`))}</div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {d.why_choose?.length ? (
        <DetailSection icon={SparklesIcon} title={t('serviceDetail.whyChoose')}>
          <ul className={styles.whyGrid}>
            {d.why_choose.map((t, i) => (
              <li key={i} className={styles.whyItem}>
                <CheckCircleIcon className={styles.whyCheck} aria-hidden />
                <span className={styles.whyText}>{t}</span>
              </li>
            ))}
          </ul>
        </DetailSection>
      ) : null}

      {d.packages?.length ? (
        <DetailSection icon={GiftIcon} title={t('serviceDetail.packages')} muted>
          <div className={styles.pkgGrid}>
            {d.packages.map((p) => (
              <Card key={p.name} className={styles.pkg}>
                <h3>{p.name}</h3>
                <p className={styles.pkgPrice}>
                  {p.price ? `${t('common.priceFrom')} ${formatRub(p.price)}` : ''}
                </p>
                <p className={styles.pkgDesc}>{p.description}</p>
              </Card>
            ))}
          </div>
        </DetailSection>
      ) : null}

      {d.status_advantages?.length ? (
        <DetailSection icon={ShieldCheckIcon} title={t('serviceDetail.statusAdv')}>
          <div className={styles.advGrid}>
            {d.status_advantages.map((x) => (
              <Card key={x.title} className={styles.adv}>
                <div className={styles.advCardHead}>
                  <ShieldCheckIcon className={styles.advCardIcon} aria-hidden />
                  <strong>{x.title}</strong>
                </div>
                <p>{x.text}</p>
              </Card>
            ))}
          </div>
        </DetailSection>
      ) : null}

      {d.appeal_stages?.length ? (
        <DetailSection icon={ScaleIcon} title={t('serviceDetail.appealStages')}>
          <ol className={styles.stagesEnhanced}>
            {d.appeal_stages.map((st, idx) => {
              const stagePrice = st.price ?? st.price_from
              return (
                <li key={st.title} className={styles.stageRow}>
                  <span className={styles.stageNum}>{idx + 1}</span>
                  <div className={styles.stageBody}>
                    <strong className={styles.stageTitle}>{st.title}</strong>
                    <p className={styles.stageMeta}>
                      {stagePrice != null ? (
                        <>
                          {t('common.priceFrom')} {formatRub(stagePrice)} ·{' '}
                        </>
                      ) : null}
                      {st.duration}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </DetailSection>
      ) : null}

      {d.steps_timeline?.length ? (
        <DetailSection icon={ArrowPathRoundedSquareIcon} title={t('serviceDetail.pathCitizenship')} muted>
          <div className={styles.timeline}>
            {d.steps_timeline.map((t, i) => (
              <div key={t} className={styles.tlItem}>
                <span className={styles.tlNum}>{i + 1}</span>
                {t}
              </div>
            ))}
          </div>
        </DetailSection>
      ) : null}

      {d.risks && !richArticle ? (
        <section className="section">
          <div className="container">
            <Card className={styles.warn}>
              <div className={styles.warnHead}>
                <ExclamationTriangleIcon className={styles.warnIcon} aria-hidden />
                <h2 className={styles.warnTitle}>{t('serviceDetail.risksTitle')}</h2>
              </div>
              <p className={styles.warnText}>{d.risks}</p>
            </Card>
          </div>
        </section>
      ) : null}

      {d.documents?.length && !richArticle ? (
        <DetailSection icon={ClipboardDocumentListIcon} title={t('serviceDetail.documents')} muted>
          <ol className={styles.docsEnhanced}>
            {d.documents.map((line, i) => (
              <li key={i} className={styles.docRow}>
                <span className={styles.docNum}>{i + 1}</span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </DetailSection>
      ) : null}

      {d.steps?.length && !richArticle ? (
        <DetailSection icon={ListBulletIcon} title={t('serviceDetail.stepsWork')}>
          <ol className={styles.stepsFlow}>
            {d.steps.map((line, i) => (
              <li key={i} className={styles.stepFlowItem}>
                <span className={styles.stepFlowDot} aria-hidden />
                <div>
                  <span className={styles.stepFlowLabel}>
                    {t('serviceDetail.stepLabel')} {i + 1}
                  </span>
                  <p className={styles.stepFlowText}>{line}</p>
                </div>
              </li>
            ))}
          </ol>
        </DetailSection>
      ) : null}

      <DetailSection
        icon={ChatBubbleLeftRightIcon}
        title={t('serviceDetail.leadSection')}
        muted
        bodyClassName={styles.panelBodyLead}
      >
        <p className={styles.leadLead}>{t('serviceDetail.leadLead')}</p>
        <div id="zayavka" className={styles.leadFormWrap}>
          <ServiceLeadForm serviceTitle={svc.title} sourcePath={`/uslugi/${slug}`} />
        </div>
      </DetailSection>

      {faqItems?.length ? (
        <DetailSection icon={QuestionMarkCircleIcon} title={t('serviceDetail.faq')}>
          <Accordion items={faqItems} />
        </DetailSection>
      ) : null}

      <DetailSection icon={LinkIcon} title={t('serviceDetail.similar')}>
        <ul className={styles.simGrid}>
          {similar.map((s) => (
            <li key={s.slug}>
              <Link to={`/uslugi/${s.slug}`} className={styles.simLink}>
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </DetailSection>
    </>
  )
}
