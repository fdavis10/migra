import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { getPromotions } from '@/api/promos'
import { PromoDetailsLink } from '@/components/promotions/PromoDetailsLink'
import { RedConsultSweepButton } from '@/components/promotions/RedConsultSweepButton'
import { Card } from '@/components/ui/Card'
import { useLeadModal } from '@/context/LeadModalContext'
import { CountdownTimer } from '@/components/sections/CountdownTimer'
import { Skeleton } from '@/components/ui/Skeleton'
import { useTranslation } from '@/i18n/useTranslation'
import { unwrapList } from '@/utils/apiList'
import styles from './PromotionsPage.module.css'

export function PromotionsPage() {
  const { t } = useTranslation()
  const { openModal } = useLeadModal()
  const [list, setList] = useState(null)
  useEffect(() => {
    let c = false
    ;(async () => {
      try {
        const data = await getPromotions()
        if (!c) setList(unwrapList(data))
      } catch {
        if (!c) setList([])
      }
    })()
    return () => {
      c = true
    }
  }, [])

  const until = list?.[0]?.expires_at

  return (
    <>
      <Helmet>
        <title>{t('promotionsPage.title')}</title>
        <meta name="description" content={t('promotionsPage.metaDesc')} />
      </Helmet>
      <div className="section">
        <div className="container">
          <h1 className={styles.h1}>{t('promotionsPage.h1')}</h1>
          <div className={styles.timer}>
            <CountdownTimer until={until} />
          </div>
          <div className={styles.grid}>
            {list === null
              ? [...Array(5)].map((_, i) => <Skeleton key={i} style={{ height: 140 }} />)
              : list.map((p) => (
                  <Card key={p.id} className={styles.card}>
                    <span className={styles.disc}>{p.discount}</span>
                    <h2>{p.title}</h2>
                    <PromoDetailsLink promotionId={p.id} />
                  </Card>
                ))}
          </div>
          <div className={styles.listFooter}>
            <RedConsultSweepButton type="button" onClick={() => openModal(t('promotionsPage.h1'))}>
              {t('promotionsPage.freeConsultCta')}
            </RedConsultSweepButton>
          </div>
        </div>
      </div>
    </>
  )
}
