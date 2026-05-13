import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { PromoDetailsLink } from '@/components/promotions/PromoDetailsLink'
import { PromotionCardVisual } from '@/components/promotions/PromotionCardVisual'
import styles from './PromoSpotlightBanner.module.css'

const ROTATE_MS = 5000

function shuffleInPlace(arr) {
  const a = arr
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickTriple(promos) {
  const n = promos.length
  if (n === 0) return null
  if (n === 1) return { left: null, center: promos[0], right: null }
  const centerIdx = Math.floor(Math.random() * n)
  const center = promos[centerIdx]
  const rest = promos.filter((_, i) => i !== centerIdx)
  shuffleInPlace(rest)
  if (n === 2) {
    const side = rest[0]
    return { left: side, center, right: side }
  }
  const left = rest[0]
  const right = rest[1] ?? rest[0]
  return { left, center, right }
}

function SpotlightCard({ promo, variant }) {
  if (!promo) {
    return null
  }
  const isCenter = variant === 'center'
  const shellClass = isCenter ? styles.centerShell : styles.sideShell
  return (
    <div className={shellClass} {...(isCenter ? {} : { 'aria-hidden': true })}>
      <Card className={styles.card}>
        <PromotionCardVisual promotion={promo} embedInCard />
        <div className={styles.body}>
          <span className={styles.disc}>{promo.discount}</span>
          <h3 className={styles.title}>{promo.title}</h3>
          {isCenter ? <PromoDetailsLink promotionId={promo.id} /> : null}
        </div>
      </Card>
    </div>
  )
}

export function PromoSpotlightBanner({ promos }) {
  const [triple, setTriple] = useState(null)

  useEffect(() => {
    if (!promos || promos.length === 0) {
      setTriple(null)
      return undefined
    }
    const run = () => setTriple(pickTriple(promos))
    run()
    const id = window.setInterval(run, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [promos])

  if (promos !== null && (!promos || promos.length === 0)) {
    return null
  }

  if (promos === null) {
    return (
      <div className={styles.row}>
        <Skeleton className={`${styles.skeletonCol} ${styles.sideCol}`} />
        <Skeleton className={`${styles.skeletonCol} ${styles.centerCol}`} style={{ minHeight: 320 }} />
        <Skeleton className={`${styles.skeletonCol} ${styles.sideCol}`} />
      </div>
    )
  }

  if (!triple) return null

  const singleCenter = !triple.left && !triple.right

  return (
    <div className={`${styles.row} ${singleCenter ? styles.rowSingle : ''}`.trim()}>
      <div className={styles.sideCol}>
        <SpotlightCard promo={triple.left} variant="side" />
      </div>
      <div className={styles.centerCol}>
        <SpotlightCard key={triple.center.id} promo={triple.center} variant="center" />
      </div>
      <div className={styles.sideCol}>
        <SpotlightCard promo={triple.right} variant="side" />
      </div>
    </div>
  )
}
