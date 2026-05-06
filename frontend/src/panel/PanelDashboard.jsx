import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { panelApi } from './panelApi'
import './panel.css'
import styles from './PanelDashboard.module.css'

function formatChartDate(iso) {
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

function formatInt(n) {
  return new Intl.NumberFormat('ru-RU').format(n ?? 0)
}

const CHART_COLORS = {
  views: '#5ba8d4',
  unique: '#a89fd6',
  leads: '#7ec8a4',
}

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

  const visitsChartData = useMemo(() => {
    const rows = data?.visits_series
    if (!Array.isArray(rows)) return []
    return rows.map((r) => ({
      ...r,
      label: formatChartDate(r.date),
    }))
  }, [data?.visits_series])

  const leadsChartData = useMemo(() => {
    const rows = data?.leads_series
    if (!Array.isArray(rows)) return []
    return rows.map((r) => ({
      ...r,
      label: formatChartDate(r.date),
    }))
  }, [data?.leads_series])

  const L = data?.leads
  const V = data?.visits_period
  const cat = data?.catalog

  return (
    <>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Дашборд</h1>
        <p className={styles.heroSub}>
          Сводка по заявкам, посещаемости публичного сайта и контенту из базы данных. Графики за последние 30 дней.
          Уникальные посетители оцениваются по анонимному идентификатору в браузере (localStorage).
        </p>
      </div>

      {err ? <p className="panelErr">{err}</p> : null}

      {!data && !err ? <p className="panelMuted">Загрузка…</p> : null}

      {L ? (
        <div className={styles.kpiGrid}>
          <div className={styles.kpi}>
            <span className={styles.kpiValue}>{formatInt(L.total)}</span>
            <span className={styles.kpiLabel}>Заявок всего</span>
          </div>
          <div className={`${styles.kpi} ${styles.kpiAccentPeach}`}>
            <span className={styles.kpiValue}>{formatInt(L.new)}</span>
            <span className={styles.kpiLabel}>Новых заявок</span>
          </div>
          <div className={`${styles.kpi} ${styles.kpiAccentMint}`}>
            <span className={styles.kpiValue}>{formatInt(L.modal)}</span>
            <span className={styles.kpiLabel}>С модальных форм</span>
          </div>
          <div className={`${styles.kpi} ${styles.kpiAccentLavend}`}>
            <span className={styles.kpiValue}>{formatInt(L.chat)}</span>
            <span className={styles.kpiLabel}>Из чата</span>
          </div>
          {V ? (
            <>
              <div className={styles.kpi}>
                <span className={styles.kpiValue}>{formatInt(V.views)}</span>
                <span className={styles.kpiLabel}>Просмотров за {V.days} дн.</span>
              </div>
              <div className={`${styles.kpi} ${styles.kpiAccentLavend}`}>
                <span className={styles.kpiValue}>{formatInt(V.unique_visitors)}</span>
                <span className={styles.kpiLabel}>Уник. браузеров за период</span>
              </div>
            </>
          ) : null}
          {data?.news ? (
            <div className={styles.kpi}>
              <span className={styles.kpiValue}>{formatInt(data.news.total)}</span>
              <span className={styles.kpiLabel}>Статей в блоге</span>
            </div>
          ) : null}
          {data?.news ? (
            <div className={`${styles.kpi} ${styles.kpiAccentPeach}`}>
              <span className={styles.kpiValue}>{formatInt(data.news.unpublished)}</span>
              <span className={styles.kpiLabel}>Черновиков</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {data && visitsChartData.length ? (
        <div className={styles.chartsRow}>
          <div className="panelCard">
            <h2 className={styles.chartTitle}>Посещаемость сайта</h2>
            <p className={styles.chartHint}>Просмотры страниц и уникальные посетители по дням</p>
            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitsChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS.views} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={CHART_COLORS.views} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillUnique" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS.unique} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={CHART_COLORS.unique} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} interval="preserveStartEnd" minTickGap={24} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} width={44} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid var(--color-border)',
                      fontSize: 13,
                    }}
                    formatter={(value) => formatInt(value)}
                    labelFormatter={(_, payload) => (payload?.[0]?.payload?.date ? `Дата: ${payload[0].payload.date}` : '')}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="views" name="Просмотры" stroke={CHART_COLORS.views} fill="url(#fillViews)" strokeWidth={2} />
                  <Area
                    type="monotone"
                    dataKey="unique_visitors"
                    name="Уникальные"
                    stroke={CHART_COLORS.unique}
                    fill="url(#fillUnique)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panelCard">
            <h2 className={styles.chartTitle}>Новые заявки</h2>
            <p className={styles.chartHint}>Количество заявок по дням</p>
            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadsChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} interval="preserveStartEnd" minTickGap={24} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} width={44} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid var(--color-border)',
                      fontSize: 13,
                    }}
                    formatter={(value) => [formatInt(value), 'Заявки']}
                    labelFormatter={(_, payload) => (payload?.[0]?.payload?.date ? `Дата: ${payload[0].payload.date}` : '')}
                  />
                  <Bar dataKey="count" name="Заявки" fill={CHART_COLORS.leads} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : null}

      {cat ? (
        <div className="panelCard" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h2 className="panelH2">Контент на сайте (из API)</h2>
          <p className="panelLead">
            Эти данные читаются с публичного сайта; редактирование — в стандартной админке Django{' '}
            <code>/admin/</code> или через разделы ниже, где доступно.
          </p>
          <div className={styles.catalogGrid}>
            <div className={styles.catalogItem}>
              <span className={styles.catalogValue}>{formatInt(cat.services)}</span>
              <span className={styles.catalogLabel}>Услуг</span>
            </div>
            <div className={styles.catalogItem}>
              <span className={styles.catalogValue}>{formatInt(cat.promotions_active)}</span>
              <span className={styles.catalogLabel}>Активных акций</span>
            </div>
            <div className={styles.catalogItem}>
              <span className={styles.catalogValue}>{formatInt(cat.promotions_total)}</span>
              <span className={styles.catalogLabel}>Акций всего</span>
            </div>
            <div className={styles.catalogItem}>
              <span className={styles.catalogValue}>{formatInt(cat.price_categories)}</span>
              <span className={styles.catalogLabel}>Категорий прайса</span>
            </div>
            <div className={styles.catalogItem}>
              <span className={styles.catalogValue}>{formatInt(cat.reviews_active)}</span>
              <span className={styles.catalogLabel}>Отзывов на сайте</span>
            </div>
            <div className={styles.catalogItem}>
              <span className={styles.catalogValue}>{formatInt(cat.faq_categories)}</span>
              <span className={styles.catalogLabel}>Тем FAQ</span>
            </div>
            <div className={styles.catalogItem}>
              <span className={styles.catalogValue}>{formatInt(cat.guarantees)}</span>
              <span className={styles.catalogLabel}>Блоков гарантий</span>
            </div>
            <div className={styles.catalogItem}>
              <span className={styles.catalogValue}>{data.site_configured ? 'Да' : 'Нет'}</span>
              <span className={styles.catalogLabel}>Контакты / SiteContent</span>
            </div>
          </div>
          <div className={styles.quickLinks}>
            <Link to="/panel/leads" className="panelBtn panelBtnSm" style={{ textDecoration: 'none' }}>
              Заявки
            </Link>
            <Link to="/panel/news" className="panelBtn panelBtnSm" style={{ textDecoration: 'none' }}>
              Блог
            </Link>
            <Link to="/panel/site" className="panelBtn panelBtnSm" style={{ textDecoration: 'none' }}>
              Контент сайта
            </Link>
            <a href="/admin/" className="panelBtn panelBtnGhost panelBtnSm" style={{ textDecoration: 'none' }} target="_blank" rel="noreferrer">
              Django admin
            </a>
          </div>
        </div>
      ) : null}

      {Array.isArray(data?.top_paths) && data.top_paths.length > 0 ? (
        <div className="panelCard" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h2 className="panelH2">Популярные страницы (30 дней)</h2>
          <p className="panelLead">По числу просмотров</p>
          <div style={{ overflowX: 'auto' }}>
            <table className="panelTable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Путь</th>
                  <th>Просмотры</th>
                </tr>
              </thead>
              <tbody>
                {data.top_paths.map((row, i) => (
                  <tr key={`${row.path}-${i}`}>
                    <td className="panelMuted">{i + 1}</td>
                    <td>
                      <code style={{ fontSize: 12, wordBreak: 'break-all' }}>{row.path}</code>
                    </td>
                    <td>{formatInt(row.views)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {data && (!data.top_paths || data.top_paths.length === 0) && V?.views === 0 ? (
        <div className="panelCard panelCardMuted">
          <p className="panelLead" style={{ margin: 0 }}>
            Данных о посещениях пока нет: откройте публичный сайт в браузере — просмотры начнут попадать в эту панель автоматически.
          </p>
        </div>
      ) : null}
    </>
  )
}
