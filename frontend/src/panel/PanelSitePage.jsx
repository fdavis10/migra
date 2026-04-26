import { useEffect, useState } from 'react'
import { panelApi } from './panelApi'
import './panel.css'

export function PanelSitePage() {
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const [form, setForm] = useState(null)
  const [advJson, setAdvJson] = useState('[]')
  const [payJson, setPayJson] = useState('[]')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await panelApi.get('panel/site/')
        if (cancelled) return
        setForm(data)
        setAdvJson(JSON.stringify(data.advantages ?? [], null, 2))
        setPayJson(JSON.stringify(data.payment_methods ?? [], null, 2))
      } catch (e) {
        if (!cancelled) {
          setErr(
            e.response?.status === 404
              ? 'В БД нет записи контента. Выполните seed_demo или создайте SiteContent в Django.'
              : 'Не удалось загрузить данные',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const onChange = (field) => (e) => {
    const v = e.target.value
    setForm((f) => ({ ...f, [field]: v }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setOk('')
    let advantages
    let payment_methods
    try {
      advantages = JSON.parse(advJson || '[]')
      payment_methods = JSON.parse(payJson || '[]')
    } catch {
      setErr('Поля «Преимущества» и «Оплата» должны быть валидным JSON (массивы).')
      return
    }
    try {
      await panelApi.patch('panel/site/', {
        ...form,
        advantages,
        payment_methods,
        promo_countdown_date: form.promo_countdown_date || null,
      })
      setOk('Сохранено')
    } catch (ex) {
      const d = ex.response?.data
      setErr(typeof d === 'object' ? JSON.stringify(d) : 'Ошибка сохранения')
    }
  }

  if (loading) return <p className="panelMuted">Загрузка…</p>
  if (!form) {
    return <p className="panelErr">{err || 'Нет данных'}</p>
  }

  return (
    <>
      <h1 className="panelH1">Контент сайта</h1>
      <p className="panelMuted" style={{ marginBottom: '16px' }}>
        Телефоны, мессенджеры, тексты на главной и страницах «О компании». Эти данные отдаются публичным API{' '}
        <code>/api/site/contact/</code>.
      </p>
      {err ? <p className="panelErr">{err}</p> : null}
      {ok ? <p className="panelOk">{ok}</p> : null}
      <form className="panelForm panelCard" onSubmit={onSubmit}>
        <label>
          Дата окончания акции (таймер на главной, до конца дня по Москве)
          <input
            type="date"
            value={form.promo_countdown_date || ''}
            onChange={onChange('promo_countdown_date')}
          />
          <span className="panelMuted" style={{ display: 'block', marginTop: 6, fontSize: 13 }}>
            Оставьте пустым, чтобы скрыть счётчик. Пример: 31.05.2026 — отсчёт до 23:59:59 МСК.
          </span>
        </label>
        <label>
          Hero H1
          <input type="text" value={form.hero_title} onChange={onChange('hero_title')} />
        </label>
        <label>
          Hero подзаголовок
          <textarea value={form.hero_subtitle} onChange={onChange('hero_subtitle')} rows={3} />
        </label>
        <label>
          Телефон (как на сайте)
          <input type="text" value={form.phone} onChange={onChange('phone')} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={onChange('email')} required />
        </label>
        <label>
          Адрес
          <textarea value={form.address} onChange={onChange('address')} rows={2} required />
        </label>
        <label>
          Часы работы
          <input type="text" value={form.work_hours} onChange={onChange('work_hours')} required />
        </label>
        <label>
          WhatsApp URL
          <input type="url" value={form.whatsapp_url} onChange={onChange('whatsapp_url')} />
        </label>
        <label>
          Telegram URL
          <input type="url" value={form.telegram_url} onChange={onChange('telegram_url')} />
        </label>
        <label>
          VK URL
          <input type="url" value={form.vk_url} onChange={onChange('vk_url')} />
        </label>
        <label>
          Карта (HTML iframe)
          <textarea value={form.map_embed_html} onChange={onChange('map_embed_html')} rows={4} />
        </label>
        <label>
          О компании (длинный текст)
          <textarea value={form.about_company} onChange={onChange('about_company')} rows={8} />
        </label>
        <label>
          Письмо основателя
          <textarea value={form.founder_message} onChange={onChange('founder_message')} rows={8} />
        </label>
        <label>
          Имя основателя
          <input type="text" value={form.founder_name} onChange={onChange('founder_name')} />
        </label>
        <label>
          Должность основателя
          <input type="text" value={form.founder_title} onChange={onChange('founder_title')} />
        </label>
        <label>
          Преимущества (JSON-массив)
          <textarea value={advJson} onChange={(e) => setAdvJson(e.target.value)} rows={10} />
        </label>
        <label>
          Способы оплаты (JSON-массив)
          <textarea value={payJson} onChange={(e) => setPayJson(e.target.value)} rows={6} />
        </label>
        <button type="submit" className="panelBtn">
          Сохранить
        </button>
      </form>
    </>
  )
}
