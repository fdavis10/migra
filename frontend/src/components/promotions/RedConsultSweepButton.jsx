import styles from './RedConsultSweepButton.module.css'

export function RedConsultSweepButton({ children, className = '', onClick, type = 'button' }) {
  return (
    <button type={type} className={`${styles.root} ${className}`.trim()} onClick={onClick}>
      <span className={styles.fill} aria-hidden />
      <span className={styles.label}>{children}</span>
    </button>
  )
}
