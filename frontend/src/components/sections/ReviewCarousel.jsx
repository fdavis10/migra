import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import styles from './ReviewCarousel.module.css'

export function ReviewCarousel({ reviews }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!reviews?.length) return
    const t = setInterval(() => setI((v) => (v + 1) % reviews.length), 6000)
    return () => clearInterval(t)
  }, [reviews])
  if (!reviews?.length) return null
  const r = reviews[i]
  return (
    <div className={styles.wrap}>
      <Card className={styles.card}>
        <div className={styles.avatar}>{r.name?.slice(0, 1) || '?'}</div>
        <p className={styles.name}>{r.name}</p>
        <p className={styles.svc}>{r.service}</p>
        <p className={styles.text}>{r.text}</p>
        <p className={styles.src}>{r.source}</p>
      </Card>
      <div className={styles.dots}>
        {reviews.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={idx === i ? styles.dotActive : styles.dot}
            aria-label={`Отзыв ${idx + 1}`}
            onClick={() => setI(idx)}
          />
        ))}
      </div>
    </div>
  )
}
