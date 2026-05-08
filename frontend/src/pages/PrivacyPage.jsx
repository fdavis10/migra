import { Helmet } from 'react-helmet-async'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './PrivacyPage.module.css'

function renderText(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const emailRegex = /([\w.+-]+@[\w-]+\.[\w.-]+)/g
  const parts = []
  let lastIndex = 0
  const matches = []
  let m
  while ((m = urlRegex.exec(text)) !== null) {
    matches.push({ start: m.index, end: m.index + m[0].length, value: m[0], kind: 'url' })
  }
  while ((m = emailRegex.exec(text)) !== null) {
    matches.push({ start: m.index, end: m.index + m[0].length, value: m[0], kind: 'email' })
  }
  matches.sort((a, b) => a.start - b.start)
  matches.forEach((match, idx) => {
    if (match.start < lastIndex) return
    if (match.start > lastIndex) parts.push(text.slice(lastIndex, match.start))
    if (match.kind === 'url') {
      parts.push(
        <a key={`u-${idx}`} href={match.value} target="_blank" rel="noopener noreferrer">
          {match.value}
        </a>,
      )
    } else {
      parts.push(
        <a key={`e-${idx}`} href={`mailto:${match.value}`}>
          {match.value}
        </a>,
      )
    }
    lastIndex = match.end
  })
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts.length ? parts : text
}

function renderValue(label, value) {
  if (/e-?mail/i.test(label)) {
    return (
      <a href={`mailto:${value}`} className={styles.kvLink}>
        {value}
      </a>
    )
  }
  if (/телефон|phone/i.test(label)) {
    const tel = value.replace(/[^+\d]/g, '')
    return (
      <a href={`tel:${tel}`} className={styles.kvLink}>
        {value}
      </a>
    )
  }
  return value
}

function Block({ block }) {
  if (block.type === 'p') {
    return <p className={styles.p}>{renderText(block.text)}</p>
  }
  if (block.type === 'ul') {
    return (
      <ul className={styles.ul}>
        {block.items.map((item, i) => (
          <li key={i}>{renderText(item)}</li>
        ))}
      </ul>
    )
  }
  if (block.type === 'kv') {
    return (
      <dl className={styles.kv}>
        {block.items.map((row, i) => (
          <div key={i} className={styles.kvRow}>
            <dt className={styles.kvLabel}>{row.label}</dt>
            <dd className={styles.kvValue}>{renderValue(row.label, row.value)}</dd>
          </div>
        ))}
      </dl>
    )
  }
  return null
}

export function PrivacyPage() {
  const { t } = useTranslation()
  const sections = t('privacyPage.sections')
  const safeSections = Array.isArray(sections) ? sections : []
  return (
    <>
      <Helmet>
        <title>{t('privacyPage.title')}</title>
        <meta name="description" content={t('privacyPage.metaDesc')} />
      </Helmet>
      <div className="section">
        <div className={`container ${styles.wrap}`}>
          <h1 className={styles.h1}>{t('privacyPage.h1')}</h1>
          {safeSections.map((section) => (
            <section key={section.id} className={styles.section} id={section.id}>
              <h2 className={styles.h2}>{section.title}</h2>
              {(section.blocks || []).map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
