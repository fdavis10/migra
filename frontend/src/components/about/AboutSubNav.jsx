import { NavLink } from 'react-router-dom'
import { ABOUT_NAV_ITEMS } from '@/content/aboutNav'
import styles from './AboutSubNav.module.css'

export function AboutSubNav() {
  return (
    <nav className={styles.nav} aria-label="Разделы о компании">
      {ABOUT_NAV_ITEMS.map((item) => (
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
