import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './Modal.module.css'

export function Modal({ open, title, onClose, children, footer, wide }) {
  const { t } = useTranslation()
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className={styles.backdrop} role="presentation" onMouseDown={onClose}>
      <div
        className={`${styles.dialog} ${wide ? styles.dialogWide : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.head}>
          {title ? (
            <h2 id="modal-title" className={styles.title}>
              {title}
            </h2>
          ) : null}
          <button type="button" className={styles.close} onClick={onClose} aria-label={t('modal.closeAria')}>
            ×
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}
