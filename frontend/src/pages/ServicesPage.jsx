import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { getServices } from '@/api/services'
import { ServiceCard } from '@/components/sections/ServiceCard'
import { Skeleton } from '@/components/ui/Skeleton'
import otherPassportsImage from '@assets/image/other_passpots.jpeg'
import { unwrapList } from '@/utils/apiList'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './ServicesPage.module.css'

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

export function ServicesPage() {
  const { t } = useTranslation()
  const [list, setList] = useState(null)
  const parallaxFrameRef = useRef(null)
  const parallaxMoverRef = useRef(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const strength = 0.32
    const maxShift = 64
    let rafId = 0

    const tick = () => {
      rafId = 0
      const frame = parallaxFrameRef.current
      const mover = parallaxMoverRef.current
      if (!frame || !mover) return
      const rect = frame.getBoundingClientRect()
      const vh = window.innerHeight
      const centerOffset = rect.top + rect.height / 2 - vh / 2
      const y = clamp(-centerOffset * strength, -maxShift, maxShift)
      mover.style.transform = `translate3d(0, ${y}px, 0)`
    }

    const schedule = () => {
      if (rafId) return
      rafId = requestAnimationFrame(tick)
    }

    tick()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  useEffect(() => {
    let c = false
    ;(async () => {
      try {
        const data = await getServices()
        if (!c) setList(unwrapList(data))
      } catch {
        if (!c) setList([])
      }
    })()
    return () => {
      c = true
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>{t('servicesPage.title')}</title>
        <meta name="description" content={t('servicesPage.metaDesc')} />
      </Helmet>
      <div className="section">
        <div className="container">
          <h1 className={styles.h1}>{t('servicesPage.h1')}</h1>
          <figure ref={parallaxFrameRef} className={styles.parallaxFrame}>
            <div ref={parallaxMoverRef} className={styles.parallaxMover}>
              <img
                src={otherPassportsImage}
                alt=""
                className={styles.parallaxImg}
                width={625}
                height={350}
                decoding="async"
              />
            </div>
          </figure>
          <div className={styles.grid}>
            {list === null
              ? [...Array(9)].map((_, i) => <Skeleton key={i} style={{ height: 280 }} />)
              : list.map((s) => (
                  <ServiceCard key={s.slug} service={s} />
                ))}
          </div>
        </div>
      </div>
    </>
  )
}
