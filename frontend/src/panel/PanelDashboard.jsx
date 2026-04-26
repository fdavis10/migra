import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { panelApi } from './panelApi'
import './panel.css'

export function PanelDashboard() {
  const [data, setData] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data: d } = await panelApi.get('panel/stats/')
        if (!cancelled) setData(d)
      } catch {
        if (!cancelled) setErr('Не удалось загрузить сводку')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const L = data?.leads

  return (
    <>
      <h1 className="panelH1">Обзор</h1>
      {err ? <p className="panelErr">{err}</p> : null}
      {L ? (
        <div className="panelRow">
          <div className="panelStat">
            <strong>{L.total}</strong>
            <span className="panelMuted">заявок всего</span>
          </div>
          <div className="panelStat">
            <strong>{L.new}</strong>
            <span className="panelMuted">новых</span>
          </div>
          <div className="panelStat">
            <strong>{L.modal}</strong>
            <span className="panelMuted">с форм</span>
          </div>
          <div className="panelStat">
            <strong>{L.chat}</strong>
            <span className="panelMuted">из чата</span>
          </div>
        </div>
      ) : !err ? (
        <p className="panelMuted">Загрузка…</p>
      ) : null}
      {data?.news ? (
        <div className="panelCard" style={{ marginBottom: '24px' }}>
          <p style={{ margin: '0 0 8px' }}>
            <strong>Новости:</strong> {data.news.total}, черновиков: {data.news.unpublished}
          </p>
          <Link to="/panel/news" className="panelBtn" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            Управление блогом
          </Link>
        </div>
      ) : null}
      <div className="panelCard">
        <p style={{ margin: 0 }} className="panelMuted">
          Публичный сайт по-прежнему на основных URL. Эта панель — только для сотрудников.
        </p>
      </div>
    </>
  )
}
