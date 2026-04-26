import styles from './Card.module.css'

export function Card({ children, className = '', as: Comp = 'div', ...rest }) {
  return (
    <Comp className={`${styles.card} ${className}`.trim()} {...rest}>
      {children}
    </Comp>
  )
}
