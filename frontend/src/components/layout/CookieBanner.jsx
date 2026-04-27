import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './CookieBanner.module.css'

const KEY = 'resident_cookie_ok'

export function CookieBanner() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    try {
      localStorage.setItem(KEY, '1')
    } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className={styles.bar} role="dialog" aria-label={t('cookie.aria')}>
      <p className={styles.text}>{t('cookie.text')}</p>
      <Button type="button" size="sm" onClick={accept}>
        {t('cookie.accept')}
      </Button>
    </div>
  )
}
