import styles from './HeroIllustration.module.css'

export function HeroIllustration() {
  return (
    <div className={styles.wrap} aria-hidden>
      <img
        src="/images/judge.webp"
        alt=""
        className={styles.heroImg}
        width={640}
        height={480}
        decoding="async"
      />
    </div>
  )
}
