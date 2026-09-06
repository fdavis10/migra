import { useState } from 'react'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'
import { isPanelAuthenticated, setTokens } from './authStorage'
import { panelApiBaseURL } from './panelApi'
import './panel.css'
import styles from './PanelLoginPage.module.css'

export function PanelLoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  if (isPanelAuthenticated()) {
    return <Navigate to="/panel" replace />
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const { data } = await axios.post(`${panelApiBaseURL}/panel/auth/token/`, {
        username,
        password,
      })
      setTokens(data.access, data.refresh)
      navigate('/panel', { replace: true })
    } catch (ex) {
      const d = ex.response?.data
      const msg =
        d?.detail ||
        (typeof d === 'object' && d?.non_field_errors?.[0]) ||
        Object.values(d || {})[0]?.[0] ||
        'Не удалось войти'
      setErr(String(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`panelShell ${styles.center}`}>
      <div className={`panelCard ${styles.box}`}>
        <header className={styles.header}>
          <div className={styles.brandMark} aria-hidden>
            Р
          </div>
          <h1 className={styles.brandTitle}>Резидент</h1>
          <p className={styles.brandSub}>Панель управления сайтом</p>
        </header>

        <div className={styles.body}>
          {err ? <p className={styles.err} role="alert">{err}</p> : null}
          <form className={styles.form} onSubmit={onSubmit}>
            <label className={styles.field}>
              Логин
              <input
                className={styles.input}
                type="text"
                name="username"
                autoComplete="username"
                placeholder="Введите логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <label className={styles.field}>
              Пароль
              <input
                className={styles.input}
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? 'Вход…' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
