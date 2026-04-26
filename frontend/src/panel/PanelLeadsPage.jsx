import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { panelApi } from './panelApi'
import './panel.css'

const SOURCES = [
  { value: '', label: 'Все источники' },
  { value: 'modal', label: 'Модальные формы' },
  { value: 'chat', label: 'Чат' },
  { value: 'other', label: 'Другое' },
]

const STATUSES = [
  { value: '', label: 'Все статусы' },
  { value: 'new', label: 'Новая' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'done', label: 'Завершена' },
  { value: 'spam', label: 'Спам' },
]

const STATUS_LABEL = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Завершена',
  spam: 'Спам',
}

const SOURCE_LABEL = {
  modal: 'Форма',
  chat: 'Чат',
  other: 'Другое',
}

export function PanelLeadsPage() {
  const [search, setSearch] = useSearchParams()
  const source = search.get('source') || ''
  const status = search.get('status') || ''
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const setSource = (v) => {
    const next = new URLSearchParams(search)
    if (v) next.set('source', v)
    else next.delete('source')
    setSearch(next, { replace: true })
  }
  const setStatus = (v) => {
    const next = new URLSearchParams(search)
    if (v) next.set('status', v)
    else next.delete('status')
    setSearch(next, { replace: true })
  }

  const load = useCallback(async () => {
    setLoading(true)
    setErr('')
    try {
      const params = {}
      if (source) params.source = source
      if (status) params.status = status
      const { data } = await panelApi.get('panel/leads/', { params })
      setRows(data.results ?? data)
    } catch {
      setErr('Не удалось загрузить заявки')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [source, status])

  useEffect(() => {
    load()
  }, [load])

  const patchStatus = async (id, next) => {
    try {
      await panelApi.patch(`panel/leads/${id}/`, { status: next })
      await load()
    } catch {
      setErr('Не удалось сохранить статус')
    }
  }

  return (
    <>
      <h1 className="panelH1">Заявки</h1>
      <p className="panelMuted" style={{ marginBottom: '16px' }}>
        Отдельно: обращения из{' '}
        <Link to="/panel/leads?source=modal">модальных форм</Link> и из{' '}
        <Link to="/panel/leads?source=chat">чата со специалистом</Link>
        .
      </p>
      <div className="panelCard" style={{ marginBottom: '16px' }}>
        <div className="panelRow" style={{ marginBottom: 0 }}>
          <label>
            Источник
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              style={{ marginTop: 6 }}
            >
              {SOURCES.map((o) => (
                <option key={o.value || 'all'} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Статус
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ marginTop: 6 }}
            >
              {STATUSES.map((o) => (
                <option key={o.value || 'all'} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      {err ? <p className="panelErr">{err}</p> : null}
      {loading ? (
        <p className="panelMuted">Загрузка…</p>
      ) : (
        <div className="panelCard" style={{ overflowX: 'auto' }}>
          <table className="panelTable">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Телефон</th>
                <th>Имя</th>
                <th>Источник</th>
                <th>Услуга / страница</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="panelMuted">{new Date(r.created_at).toLocaleString('ru-RU')}</td>
                  <td>{r.phone}</td>
                  <td>{r.name || '—'}</td>
                  <td>{SOURCE_LABEL[r.source] || r.source}</td>
                  <td>
                    <div>{r.service || '—'}</div>
                    <div className="panelMuted">{r.source_page || ''}</div>
                  </td>
                  <td>
                    <select
                      value={r.status}
                      onChange={(e) => patchStatus(r.id, e.target.value)}
                      aria-label={`Статус заявки ${r.id}`}
                    >
                      {STATUSES.filter((x) => x.value).map((o) => (
                        <option key={o.value} value={o.value}>
                          {STATUS_LABEL[o.value]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length ? <p className="panelMuted">Нет заявок</p> : null}
        </div>
      )}
    </>
  )
}
