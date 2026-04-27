import { useEffect, useState } from 'react'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './CountdownTimer.module.css'

function pad(n) {
  return String(n).padStart(2, '0')
}

export function CountdownTimer({ until }) {
  const { t } = useTranslation()
  const [left, setLeft] = useState(null)

  useEffect(() => {
    if (!until) return
    const end = new Date(until).getTime()
    const tick = () => {
      const d = Math.max(0, end - Date.now())
      const days = Math.floor(d / 86400000)
      const h = Math.floor((d % 86400000) / 3600000)
      const m = Math.floor((d % 3600000) / 60000)
      const s = Math.floor((d % 60000) / 1000)
      setLeft({ days, h, m, s })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [until])

  if (!until || !left) return null
  return (
    <div className={styles.root}>
      <span className={styles.label}>{t('countdownSection.monthEnd')}</span>
      <span className={styles.time}>
        {left.days}
        {t('countdownSection.daySuffix')} {pad(left.h)}:{pad(left.m)}:{pad(left.s)}
      </span>
    </div>
  )
}
