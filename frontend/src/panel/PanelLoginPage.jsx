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
        <h1 className="panelH1" style={{ marginBottom: '8px' }}>
          Вход в панель
        </h1>
        <p className="panelMuted" style={{ marginBottom: '24px' }}>
          Учётная запись Django с флагом <code>is_staff</code> (создаётся через{' '}
          <code>createsuperuser</code> или в стандартном <code>/admin/</code>).
        </p>
        {err ? <p className="panelErr">{err}</p> : null}
        <form className="panelForm" onSubmit={onSubmit}>
          <label>
            Логин
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Пароль
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="panelBtn" disabled={loading}>
            {loading ? 'Вход…' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}
