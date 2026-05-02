import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { PriceTable } from '@/components/sections/PriceTable'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './PriceCategoryAccordion.module.css'

function CtaFillLink({ to, variant, children }) {
  const linkClass = variant === 'order' ? styles.ctaOrder : styles.ctaDetails
  return (
    <Link to={to} className={`${styles.ctaLink} ${linkClass}`}>
      <span className={styles.ctaSheath}>
        <span className={styles.ctaFill} aria-hidden />
        <span className={styles.ctaLabel}>
          <span className={styles.ctaTextBase}>{children}</span>
          <span className={styles.ctaTextOver} aria-hidden>
            {children}
          </span>
        </span>
      </span>
    </Link>
  )
}

export function PriceCategoryAccordion({ category }) {
  const { t } = useTranslation()
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const slug = category?.service_slug

  const detailHref = slug ? `/uslugi/${slug}` : '/uslugi'
  const orderHref = slug ? `/uslugi/${slug}#zayavka` : '/kontakty'

  if (!category?.items?.length) return null

  return (
    <section className={styles.block}>
      <h2 className={styles.catTitle}>
        <button
          type="button"
          className={styles.trigger}
          aria-expanded={open}
          aria-controls={panelId}
          id={`${panelId}-label`}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.triggerText}>{category.title}</span>
          <ChevronDownIcon className={open ? styles.chevronOpen : styles.chevron} aria-hidden />
        </button>
      </h2>
      <div
        id={panelId}
        role="region"
        aria-labelledby={`${panelId}-label`}
        className={styles.panel}
        data-open={open}
      >
        <div className={styles.panelInner} {...(!open ? { inert: '' } : {})}>
          <PriceTable category={category} />
          <div className={styles.actions}>
            <CtaFillLink to={detailHref} variant="details">
              {t('pricesPage.moreAboutService')}
            </CtaFillLink>
            <CtaFillLink to={orderHref} variant="order">
              {t('pricesPage.orderService')}
            </CtaFillLink>
          </div>
        </div>
      </div>
    </section>
  )
}
