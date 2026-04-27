import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useLeadModal } from '@/context/LeadModalContext'
import { useTranslation } from '@/i18n/useTranslation'
import { priceLine } from '@/utils/money'
import { ServiceIcon } from '@/components/illustrations/ServiceIcon'
import btn from '@/components/ui/Button.module.css'
import styles from './ServiceCard.module.css'

export function ServiceCard({ service }) {
  const { openModal } = useLeadModal()
  const { t } = useTranslation()
  return (
    <Card className={styles.card}>
      <div className={styles.icon}>
        <ServiceIcon name={service.icon} />
      </div>
      <h3 className={styles.title}>
        <Link to={`/uslugi/${service.slug}`}>{service.title}</Link>
      </h3>
      <p className={styles.desc}>{service.short_desc}</p>
      <p className={styles.price}>{priceLine(service, t)}</p>
      <div className={styles.actions}>
        <Link
          to={`/uslugi/${service.slug}`}
          className={`${btn.btn} ${btn.outline} ${btn.sm}`}
        >
          {t('serviceCard.details')}
        </Link>
        <Button type="button" variant="primarySweep" size="sm" onClick={() => openModal(service.title)}>
          {t('serviceCard.request')}
        </Button>
      </div>
    </Card>
  )
}
