import styles from './Button.module.css'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  ...rest
}) {
  const cls = [styles.btn, styles[variant], styles[size], className].filter(Boolean).join(' ')
  const inner =
    variant === 'primarySweep' ? <span className={styles.label}>{children}</span> : children
  return (
    <button type={type} className={cls} {...rest}>
      {inner}
    </button>
  )
}
