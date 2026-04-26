import { useEffect, useRef, useState } from 'react'
import promoPassport from '../../../../assets/passport.webp'
import styles from './PromoParallaxCountdown.module.css'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatRuDate(isoDate) {
  if (!isoDate) return ''
  const [y, m, d] = isoDate.split('-').map(Number)
  if (!y || !m || !d) return ''
  return new Date(y, m - 1, d).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function useParallaxTranslateY(containerRef) {
  const [ty, setTy] = useState(0)

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    let raf = 0
    const update = () => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const range = vh + rect.height
      const scrolled = vh - rect.top
      const p = Math.max(0, Math.min(1, scrolled / range))
      const maxPx = Math.min(140, Math.max(56, rect.height * 0.5))
      setTy((p - 0.5) * 2 * maxPx)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [containerRef])

  return ty
}

export function PromoParallaxCountdown({ untilIso, countdownDate }) {
  const wrapRef = useRef(null)
  const innerRef = useRef(null)
  const ty = useParallaxTranslateY(wrapRef)
  const [parts, setParts] = useState(null)

  useEffect(() => {
    if (!untilIso) {
      setParts(null)
      return
    }
    const end = new Date(untilIso).getTime()
    const tick = () => {
      const d = Math.max(0, end - Date.now())
      const days = Math.floor(d / 86400000)
      const h = Math.floor((d % 86400000) / 3600000)
      const m = Math.floor((d % 3600000) / 60000)
      const s = Math.floor((d % 60000) / 1000)
      setParts({ days, h, m, s, expired: d === 0 })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [untilIso])

  useEffect(() => {
    const inner = innerRef.current
    if (inner) inner.style.transform = `translate3d(0, ${ty}px, 0) scale(1.14)`
  }, [ty])

  const dateLabel = formatRuDate(countdownDate)

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <div ref={innerRef} className={styles.inner}>
        <img
          src={promoPassport}
          alt=""
          className={styles.img}
          width={1400}
          height={900}
          decoding="async"
        />
      </div>
      <div className={styles.scrim} aria-hidden />
      {untilIso && parts && !parts.expired ? (
        <div className={styles.overlay}>
          <div className={styles.glass}>
            <p className={styles.kicker}>До конца акции{dateLabel ? ` · ${dateLabel}` : ''}</p>
            <div className={styles.digits} role="timer" aria-live="polite">
              <div className={styles.cell}>
                <span className={styles.num}>{parts.days}</span>
                <span className={styles.unit}>дн</span>
              </div>
              <div className={styles.cell}>
                <span className={styles.num}>{pad(parts.h)}</span>
                <span className={styles.unit}>час</span>
              </div>
              <div className={styles.cell}>
                <span className={styles.num}>{pad(parts.m)}</span>
                <span className={styles.unit}>мин</span>
              </div>
              <div className={styles.cell}>
                <span className={styles.num}>{pad(parts.s)}</span>
                <span className={styles.unit}>сек</span>
              </div>
            </div>
            <p className={styles.hint}>Время по Москве (конец указанного дня)</p>
          </div>
        </div>
      ) : untilIso && parts?.expired ? (
        <div className={styles.overlay}>
          <div className={`${styles.glass} ${styles.glassMuted}`}>
            <p className={styles.kicker}>Период акции завершён</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
