import styles from './HeroIllustration.module.css'

export function HeroIllustration() {
  return (
    <div className={styles.wrap} aria-hidden>
      <img
        src="/images/main_image.jpg"
        alt=""
        className={styles.heroImg}
        width={1400}
        height={1050}
        sizes="(max-width: 1023px) 100vw, 50vw"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  )
}
