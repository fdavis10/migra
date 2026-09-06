import { useCallback, useEffect, useState } from 'react'
import { panelApi } from './panelApi'
import {
  clearTechLogsToken,
  getTechLogsToken,
  isTechLogsUnlocked,
  setTechLogsToken,
} from './techLogsAuth'
import './panel.css'
import styles from './PanelTechLogsPage.module.css'

function severityClass(sev) {
  if (sev === 'error') return styles.sevError
  if (sev === 'warning') return styles.sevWarn
  return styles.sevInfo
}

function levelClass(level) {
  const l = String(level || '').toUpperCase()
  if (l === 'ERROR' || l === 'CRITICAL') return styles.logError
  if (l === 'WARNING') return styles.logWarn
  return styles.logInfo
}

function formatTs(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('ru-RU')
  } catch {
    return iso
  }
}

export function PanelTechLogsPage() {
  const [unlocked, setUnlocked] = useState(isTechLogsUnlocked())
  const [password, setPassword] = useState('')
  const [unlockErr, setUnlockErr] = useState('')
  const [unlocking, setUnlocking] = useState(false)
  const [data, setData] = useState(null)
  const [loadErr, setLoadErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [level, setLevel] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setLoadErr('')
    try {
      const { data: d } = await panelApi.get('panel/tech-logs/', {
        params: level ? { level, limit: 200 } : { limit: 200 },
        headers: { 'X-Tech-Logs-Token': getTechLogsToken() },
      })
      setData(d)
      setUnlocked(true)
    } catch (ex) {
      const code = ex.response?.data?.code
      if (ex.response?.status === 403 && code === 'tech_locked') {
        clearTechLogsToken()
        setUnlocked(false)
        setData(null)
      } else {
        setLoadErr(ex.response?.data?.detail || 'Не удалось загрузить тех. логи')
      }
    } finally {
      setLoading(false)
    }
  }, [level])

  useEffect(() => {
    if (unlocked) load()
  }, [unlocked, load])

  const onUnlock = async (e) => {
    e.preventDefault()
    setUnlockErr('')
    setUnlocking(true)
    try {
      const { data: d } = await panelApi.post('panel/tech-logs/unlock/', { password })
      setTechLogsToken(d.token)
      setPassword('')
      setUnlocked(true)
    } catch (ex) {
      setUnlockErr(ex.response?.data?.detail || 'Неверный пароль')
    } finally {
      setUnlocking(false)
    }
  }

  const lockAgain = () => {
    clearTechLogsToken()
    setUnlocked(false)
    setData(null)
  }

  if (!unlocked) {
    return (
      <div className={styles.gateWrap}>
        <div className={styles.gateCard}>
          <p className={styles.gateEyebrow}>Логи · доступ ограничен</p>
          <h1 className={styles.gateTitle}>Технические логи</h1>
          <p className={styles.gateText}>
            Нужен секретный пароль технического администратора. Обычного входа в панель недостаточно.
          </p>
          {unlockErr ? (
            <p className={styles.gateErr} role="alert">
              {unlockErr}
            </p>
          ) : null}
          <form className={styles.gateForm} onSubmit={onUnlock}>
            <label className={styles.gateLabel}>
              Технический пароль
              <input
                className={styles.gateInput}
                type="password"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit" className={styles.gateBtn} disabled={unlocking}>
              {unlocking ? 'Проверка…' : 'Разблокировать'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const system = data?.system
  const issues = data?.issues || []
  const logs = data?.logs || []
  const counts = data?.counts

  return (
    <>
      <div className={styles.hero}>
        <div>
          <h1 className={styles.heroTitle}>Технические логи</h1>
          <p className={styles.heroSub}>
            Состояние сервера, замечания по сайту и последние записи приложения.
          </p>
        </div>
        <div className={styles.heroActions}>
          <button type="button" className={styles.ghostBtn} onClick={load} disabled={loading}>
            {loading ? 'Обновление…' : 'Обновить'}
          </button>
          <button type="button" className={styles.lockBtn} onClick={lockAgain}>
            Заблокировать
          </button>
        </div>
      </div>

      {loadErr ? <p className={styles.gateErr}>{loadErr}</p> : null}

      {system ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Сервер</h2>
          <div className={styles.sysGrid}>
            <div className={styles.sysItem}>
              <span className={styles.sysLabel}>Python</span>
              <span className={styles.sysValue}>{system.python}</span>
            </div>
            <div className={styles.sysItem}>
              <span className={styles.sysLabel}>DEBUG</span>
              <span className={styles.sysValue}>{system.django_debug ? 'ON' : 'OFF'}</span>
            </div>
            <div className={styles.sysItem}>
              <span className={styles.sysLabel}>БД</span>
              <span className={styles.sysValue}>{system.database}</span>
            </div>
            <div className={styles.sysItem}>
              <span className={styles.sysLabel}>Email</span>
              <span className={styles.sysValue}>
                {system.email_backend}
                {system.email_host_configured ? '' : ' · без пароля SMTP'}
              </span>
            </div>
            <div className={styles.sysItem}>
              <span className={styles.sysLabel}>TZ</span>
              <span className={styles.sysValue}>{system.time_zone}</span>
            </div>
            <div className={styles.sysItem}>
              <span className={styles.sysLabel}>Hosts</span>
              <span className={styles.sysValue}>{(system.allowed_hosts || []).join(', ')}</span>
            </div>
          </div>
          {counts ? (
            <p className={styles.countsLine}>
              Услуг: {counts.services} · Новостей: {counts.news} · Заявок: {counts.leads_total} (новых{' '}
              {counts.leads_new}) · SiteContent: {counts.sitecontent}
            </p>
          ) : null}
        </section>
      ) : null}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Что поправить на сайте</h2>
        {!issues.length ? (
          <p className={styles.empty}>Критических замечаний нет.</p>
        ) : (
          <ul className={styles.issueList}>
            {issues.map((issue) => (
              <li key={issue.code} className={`${styles.issue} ${severityClass(issue.severity)}`}>
                <div className={styles.issueTop}>
                  <span className={styles.issueSev}>{issue.severity}</span>
                  <strong className={styles.issueTitle}>{issue.title}</strong>
                </div>
                <p className={styles.issueDetail}>{issue.detail}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.logHead}>
          <h2 className={styles.sectionTitle}>Журнал приложения</h2>
          <select
            className={styles.levelSelect}
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            aria-label="Фильтр уровня"
          >
            <option value="">Все уровни</option>
            <option value="ERROR">ERROR</option>
            <option value="WARNING">WARNING</option>
            <option value="INFO">INFO</option>
          </select>
        </div>
        {!logs.length ? (
          <p className={styles.empty}>Пока нет записей в буфере (появятся после запросов и событий).</p>
        ) : (
          <div className={styles.logTableWrap}>
            <table className={styles.logTable}>
              <thead>
                <tr>
                  <th>Время</th>
                  <th>Уровень</th>
                  <th>Логгер</th>
                  <th>Сообщение</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((row, i) => (
                  <tr key={`${row.ts}-${i}`} className={levelClass(row.level)}>
                    <td className={styles.mono}>{formatTs(row.ts)}</td>
                    <td>
                      <span className={styles.levelPill}>{row.level}</span>
                    </td>
                    <td className={styles.mono}>{row.logger}</td>
                    <td>
                      <div className={styles.msg}>{row.message}</div>
                      {row.exc ? <pre className={styles.exc}>{row.exc}</pre> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}
