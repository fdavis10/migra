import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import styles from './CookieBanner.module.css'

const KEY = 'resident_cookie_ok'

export function CookieBanner() {
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
    <div className={styles.bar} role="dialog" aria-label="Файлы cookie">
      <p className={styles.text}>
        Мы используем cookie для удобства работы сайта. Продолжая пользоваться сайтом, вы соглашаетесь с
        обработкой данных.
      </p>
      <Button type="button" size="sm" onClick={accept}>
        Принять
      </Button>
    </div>
  )
}
