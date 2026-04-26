import styles from './Skeleton.module.css'

export function Skeleton({ className = '', style }) {
  return <div className={`${styles.sk} ${className}`.trim()} style={style} aria-hidden />
}
