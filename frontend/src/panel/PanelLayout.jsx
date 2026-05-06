import { useState } from 'react'
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BuildingLibraryIcon,
  Cog6ToothIcon,
  GlobeAltIcon,
  HomeIcon,
  NewspaperIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { clearTokens, isPanelAuthenticated } from './authStorage'
import './panel.css'
import styles from './PanelLayout.module.css'

export function PanelLayout() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!isPanelAuthenticated()) {
    return <Navigate to="/panel/login" replace />
  }

  const logout = () => {
    clearTokens()
    navigate('/panel/login', { replace: true })
  }

  const navCls = ({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`

  return (
    <div className="panelShell">
      <div className={styles.mobileBar}>
        <button type="button" className={styles.burger} onClick={() => setMenuOpen((o) => !o)} aria-label="Меню">
          <Bars3Icon className={styles.burgerIcon} aria-hidden />
        </button>
        <span className={styles.mobileTitle}>Резидент · CMS</span>
      </div>
      <aside className={`${styles.sidebar} ${menuOpen ? styles.open : ''}`}>
        <div className={styles.brand}>
          <span className={styles.brandTitle}>Резидент</span>
          <span className={styles.brandSub}>Панель управления сайтом</span>
        </div>
        <nav className={styles.nav} onClick={() => setMenuOpen(false)}>
          <p className={styles.navSection}>Рабочий стол</p>
          <NavLink to="/panel" end className={navCls}>
            <HomeIcon className={styles.navIcon} aria-hidden />
            Дашборд
          </NavLink>
          <p className={styles.navSection}>Клиенты</p>
          <NavLink to="/panel/leads" className={navCls}>
            <UserGroupIcon className={styles.navIcon} aria-hidden />
            Заявки
          </NavLink>
          <p className={styles.navSection}>Контент</p>
          <NavLink to="/panel/news" className={navCls}>
            <NewspaperIcon className={styles.navIcon} aria-hidden />
            Блог
          </NavLink>
          <NavLink to="/panel/site" className={navCls}>
            <Cog6ToothIcon className={styles.navIcon} aria-hidden />
            Настройки сайта
          </NavLink>
          <p className={styles.navSection}>Внешнее</p>
          <a href="/" className={styles.navLink} target="_blank" rel="noreferrer">
            <GlobeAltIcon className={styles.navIcon} aria-hidden />
            Публичный сайт
          </a>
          <a href="/admin/" className={styles.navLink} target="_blank" rel="noreferrer">
            <BuildingLibraryIcon className={styles.navIcon} aria-hidden />
            Django Admin
          </a>
        </nav>
        <div className={styles.footer}>
          <button type="button" className={styles.logout} onClick={logout}>
            <ArrowRightOnRectangleIcon className={styles.navIcon} aria-hidden />
            Выйти
          </button>
        </div>
      </aside>
      <div className="panelMain">
        <Outlet />
      </div>
    </div>
  )
}
