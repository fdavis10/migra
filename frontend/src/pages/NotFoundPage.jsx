import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import btn from '@/components/ui/Button.module.css'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Страница не найдена — РЕЗИДЕНТ</title>
      </Helmet>
      <div className={`section ${styles.wrap}`}>
        <div className="container">
          <h1 className={styles.code}>404</h1>
          <p className={styles.text}>Такой страницы нет. Вернитесь на главную или выберите услугу.</p>
          <Link to="/" className={`${btn.btn} ${btn.primary} ${btn.md}`}>
            На главную
          </Link>
          <ul className={styles.links}>
            <li>
              <Link to="/uslugi/rvp">РВП</Link>
            </li>
            <li>
              <Link to="/uslugi/vnzh">ВНЖ</Link>
            </li>
            <li>
              <Link to="/uslugi/grazhdanstvo">Гражданство РФ</Link>
            </li>
            <li>
              <Link to="/ceny">Цены</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
