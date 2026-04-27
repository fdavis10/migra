import { NavLink } from 'react-router-dom'
import { getAboutNavItems } from '@/content/aboutNav.i18n'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './AboutSubNav.module.css'

export function AboutSubNav() {
  const { t, locale } = useTranslation()
  const items = getAboutNavItems(locale)
  return (
    <nav className={styles.nav} aria-label={t('aboutSubNav.aria')}>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/o-kompanii'}
          className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
