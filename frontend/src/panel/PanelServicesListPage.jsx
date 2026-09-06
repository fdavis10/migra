import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { mediaUrl } from '@/utils/mediaUrl'
import { panelApi } from './panelApi'
import './panel.css'
import styles from './PanelServicesPage.module.css'

export function PanelServicesListPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await panelApi.get('panel/services/')
        if (!cancelled) setRows(data.results ?? data)
      } catch {
        if (!cancelled) setErr('Не удалось загрузить услуги')
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
      <div className={styles.hero}>
        <div>
          <h1 className={styles.heroTitle}>Услуги</h1>
          <p className={styles.heroSub}>
            Карточки и страницы услуг на сайте: тексты, цены, иконки и изображения.
          </p>
        </div>
        <Link to="/panel/services/new" className={styles.addBtn}>
          + Новая услуга
        </Link>
      </div>

      {err ? <p className="panelErr">{err}</p> : null}
      {loading ? (
        <p className="panelMuted">Загрузка…</p>
      ) : (
        <div className={styles.grid}>
          {rows.map((r) => {
            const img = mediaUrl(r.image)
            return (
              <Link key={r.id} to={`/panel/services/${r.id}`} className={styles.card}>
                <div className={styles.thumb}>
                  {img ? (
                    <img src={img} alt="" className={styles.thumbImg} />
                  ) : (
                    <span className={styles.thumbEmpty}>Нет фото</span>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <span className={styles.order}>#{r.order}</span>
                    {r.is_main ? <span className={styles.badge}>На главной</span> : null}
                  </div>
                  <h2 className={styles.cardTitle}>{r.title}</h2>
                  <p className={styles.cardSlug}>
                    <code>/uslugi/{r.slug}</code>
                  </p>
                  <p className={styles.cardDesc}>{r.short_desc}</p>
                </div>
              </Link>
            )
          })}
          {!rows.length ? <p className="panelMuted">Услуг пока нет</p> : null}
        </div>
      )}
    </>
  )
}
