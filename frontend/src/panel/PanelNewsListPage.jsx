import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { panelApi } from './panelApi'
import './panel.css'

export function PanelNewsListPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await panelApi.get('panel/news/')
        if (!cancelled) setRows(data.results ?? data)
      } catch {
        if (!cancelled) setErr('Не удалось загрузить новости')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <h1 className="panelH1">Блог (новости)</h1>
      <Link to="/panel/news/new" className="panelBtn" style={{ textDecoration: 'none', display: 'inline-flex', marginBottom: 24 }}>
        + Новая запись
      </Link>
      {err ? <p className="panelErr">{err}</p> : null}
      {loading ? (
        <p className="panelMuted">Загрузка…</p>
      ) : (
        <div className="panelCard" style={{ overflowX: 'auto' }}>
          <table className="panelTable">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Заголовок</th>
                <th>Slug</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="panelMuted">{new Date(r.published_at).toLocaleDateString('ru-RU')}</td>
                  <td>
                    <Link to={`/panel/news/${r.id}`}>{r.title}</Link>
                  </td>
                  <td>
                    <code>{r.slug}</code>
                  </td>
                  <td>{r.is_published ? 'На сайте' : 'Черновик'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length ? <p className="panelMuted">Нет записей</p> : null}
        </div>
      )}
    </>
  )
}
