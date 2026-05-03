import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './PromoDetailsLink.module.css'

export function PromoDetailsLink({ promotionId, className = '' }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [pressed, setPressed] = useState(false)
  const navDone = useRef(false)

  const go = useCallback(() => {
    if (navDone.current) return
    navDone.current = true
    navigate(`/akcii/${promotionId}`)
  }, [navigate, promotionId])

  const arm = useCallback(() => {
    if (navDone.current || pressed) return
    setPressed(true)
  }, [pressed])

  useEffect(() => {
    if (!pressed) return
    const tid = window.setTimeout(go, 500)
    return () => window.clearTimeout(tid)
  }, [pressed, go])

  const onPointerDown = useCallback(
    (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      arm()
    },
    [arm],
  )

  const onFillTransitionEnd = useCallback(
    (e) => {
      if (e.propertyName !== 'transform') return
      go()
    },
    [go],
  )

  return (
    <button
      type="button"
      className={`${styles.root} ${pressed ? styles.pressed : ''} ${className}`.trim()}
      onPointerDown={onPointerDown}
      onClick={arm}
    >
      <span
        className={`${styles.fill} ${pressed ? styles.fillOn : ''}`.trim()}
        aria-hidden
        onTransitionEnd={onFillTransitionEnd}
      />
      <span className={styles.label}>{t('promotionsPage.moreDetails')}</span>
    </button>
  )
}
