import { Fragment } from 'react'
import { Link } from 'react-router-dom'

/** Inner text between ** ** → service slug (longest match first). RU + EN API copy. */
const PROMO_SERVICE_INNER_TO_SLUG = [
  ['гражданства России', 'grazhdanstvo'],
  ['получение гражданства', 'grazhdanstvo'],
  ['получения гражданства', 'grazhdanstvo'],
  ['Russian Federation citizenship', 'grazhdanstvo'],
  ['citizenship acquisition', 'grazhdanstvo'],
  ['citizenship of Russia', 'grazhdanstvo'],
  ['Citizenship', 'grazhdanstvo'],
  ['permanent residence', 'vnzh'],
  ['TRP for study', 'rvpo'],
  ['TRP for education', 'rvpo'],
  ['work permit', 'rnr'],
  ['Гражданства', 'grazhdanstvo'],
  ['гражданства', 'grazhdanstvo'],
  ['ВНЖ', 'vnzh'],
  ['РВПО', 'rvpo'],
  ['РНР', 'rnr'],
  ['РВП', 'rvp'],
  ['TRP', 'rvp'],
  ['PRP', 'vnzh'],
]

function slugForMarkedInner(inner) {
  const t = inner.trim()
  for (const [label, slug] of PROMO_SERVICE_INNER_TO_SLUG) {
    if (t === label) return slug
  }
  return null
}

/**
 * Renders promotion description: newlines preserved, **Label** → Link to /uslugi/:slug when mapped.
 */
export function PromoDescriptionBody({ text, className, linkClassName = '' }) {
  if (text == null || text === '') return null

  const parts = String(text).split(/(\*\*[^*]+\*\*)/g)

  return (
    <div className={className}>
      {parts.map((part, i) => {
        const m = /^\*\*([^*]+)\*\*$/.exec(part)
        if (!m) {
          return <Fragment key={i}>{part}</Fragment>
        }
        const inner = m[1]
        const slug = slugForMarkedInner(inner)
        if (!slug) {
          return <Fragment key={i}>{inner}</Fragment>
        }
        return (
          <Link key={i} to={`/uslugi/${slug}`} className={linkClassName}>
            {inner}
          </Link>
        )
      })}
    </div>
  )
}
