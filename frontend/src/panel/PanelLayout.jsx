import { useState } from 'react'
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
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
          ☰
        </button>
        Панель
      </div>
      <aside className={`${styles.sidebar} ${menuOpen ? styles.open : ''}`}>
        <div className={styles.brand}>Миграционный сервис «Резидент» — панель</div>
        <nav className={styles.nav} onClick={() => setMenuOpen(false)}>
          <NavLink to="/panel" end className={navCls}>
            Обзор
          </NavLink>
          <NavLink to="/panel/leads" className={navCls}>
            Заявки
          </NavLink>
          <NavLink to="/panel/news" className={navCls}>
            Блог (новости)
          </NavLink>
          <NavLink to="/panel/site" className={navCls}>
            Контент сайта
          </NavLink>
        </nav>
        <div className={styles.footer}>
          <button type="button" className={styles.logout} onClick={logout}>
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
