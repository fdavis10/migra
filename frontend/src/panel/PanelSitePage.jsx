import { useEffect, useState } from 'react'
import { panelApi } from './panelApi'
import './panel.css'
import styles from './PanelSitePage.module.css'

function Field({ label, hint, className, children }) {
  return (
    <label className={[styles.field, className].filter(Boolean).join(' ')}>
      {label}
      {hint ? <span className={styles.hint}>{hint}</span> : null}
      {children}
    </label>
  )
}

function Section({ title, hint, children }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {hint ? <p className={styles.sectionHint}>{hint}</p> : null}
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  )
}

export function PanelSitePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const [form, setForm] = useState(null)
  const [advantages, setAdvantages] = useState([])
  const [payments, setPayments] = useState([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await panelApi.get('panel/site/')
        if (cancelled) return
        setForm(data)
        setAdvantages(Array.isArray(data.advantages) ? data.advantages : [])
        setPayments(Array.isArray(data.payment_methods) ? data.payment_methods : [])
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

  const updateAdvantage = (index, key, value) => {
    setAdvantages((rows) => rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)))
  }

  const updatePayment = (index, key, value) => {
    setPayments((rows) => rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setOk('')
    setSaving(true)
    try {
      await panelApi.patch('panel/site/', {
        ...form,
        advantages,
        payment_methods: payments,
        promo_countdown_date: form.promo_countdown_date || null,
      })
      setOk('Изменения сохранены и уже доступны на сайте')
    } catch (ex) {
      const d = ex.response?.data
      setErr(typeof d === 'object' ? JSON.stringify(d) : 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="panelMuted">Загрузка…</p>
  if (!form) {
    return <p className="panelErr">{err || 'Нет данных'}</p>
  }

  return (
    <>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Контент сайта</h1>
        <p className={styles.heroSub}>
          Контакты, тексты главной и страницы «О компании». Правки сразу попадают в публичный API.
        </p>
      </div>

      {err ? (
        <p className={styles.alertErr} role="alert">
          {err}
        </p>
      ) : null}
      {ok ? <p className={styles.alertOk}>{ok}</p> : null}

      <form className={styles.form} onSubmit={onSubmit}>
        <Section
          title="Главная страница"
          hint="Заголовок в первом экране и дата таймера акции. Пустая дата скрывает счётчик."
        >
          <div className={styles.grid2}>
            <Field
              label="Дата окончания акции"
              hint="Таймер считает до 23:59:59 по Москве"
              className={styles.fieldFull}
            >
              <input
                className={styles.input}
                type="date"
                value={form.promo_countdown_date || ''}
                onChange={onChange('promo_countdown_date')}
              />
            </Field>
            <Field label="Заголовок (H1)" className={styles.fieldFull}>
              <input
                className={styles.input}
                type="text"
                value={form.hero_title}
                onChange={onChange('hero_title')}
                placeholder="Например: Миграционный сервис «Резидент»"
              />
            </Field>
            <Field label="Подзаголовок" className={styles.fieldFull}>
              <textarea
                className={styles.textarea}
                value={form.hero_subtitle}
                onChange={onChange('hero_subtitle')}
                rows={3}
                placeholder="Короткий текст под заголовком"
              />
            </Field>
          </div>
        </Section>

        <Section title="Контакты" hint="Телефон, почта, адрес и часы — шапка, подвал и страница контактов.">
          <div className={styles.grid2}>
            <Field label="Телефон">
              <input
                className={styles.input}
                type="text"
                value={form.phone}
                onChange={onChange('phone')}
                required
                placeholder="+7 …"
              />
            </Field>
            <Field label="Email">
              <input
                className={styles.input}
                type="email"
                value={form.email}
                onChange={onChange('email')}
                required
              />
            </Field>
            <Field label="Часы работы">
              <input
                className={styles.input}
                type="text"
                value={form.work_hours}
                onChange={onChange('work_hours')}
                required
                placeholder="Пн–Пт 10:00–19:00"
              />
            </Field>
            <Field label="Адрес" className={styles.fieldFull}>
              <textarea
                className={styles.textarea}
                value={form.address}
                onChange={onChange('address')}
                rows={2}
                required
              />
            </Field>
          </div>
        </Section>

        <Section title="Мессенджеры и соцсети" hint="Ссылки на кнопки WhatsApp, Telegram и VK.">
          <div className={styles.grid3}>
            <Field label="WhatsApp">
              <input
                className={styles.input}
                type="url"
                value={form.whatsapp_url}
                onChange={onChange('whatsapp_url')}
                placeholder="https://wa.me/…"
              />
            </Field>
            <Field label="Telegram">
              <input
                className={styles.input}
                type="url"
                value={form.telegram_url}
                onChange={onChange('telegram_url')}
                placeholder="https://t.me/…"
              />
            </Field>
            <Field label="VK">
              <input
                className={styles.input}
                type="url"
                value={form.vk_url}
                onChange={onChange('vk_url')}
                placeholder="https://vk.com/…"
              />
            </Field>
          </div>
        </Section>

        <Section title="Карта" hint="HTML-код iframe с Яндекс.Карт или Google Maps.">
          <Field label="Код вставки карты">
            <textarea
              className={styles.textarea}
              value={form.map_embed_html}
              onChange={onChange('map_embed_html')}
              rows={4}
              placeholder="<iframe …></iframe>"
            />
          </Field>
        </Section>

        <Section title="О компании" hint="Тексты для страницы «О компании».">
          <Field label="Текст о компании">
            <textarea
              className={styles.textarea}
              value={form.about_company}
              onChange={onChange('about_company')}
              rows={8}
            />
          </Field>
          <Field label="Письмо основателя">
            <textarea
              className={styles.textarea}
              value={form.founder_message}
              onChange={onChange('founder_message')}
              rows={8}
            />
          </Field>
          <div className={styles.grid2}>
            <Field label="Имя основателя">
              <input
                className={styles.input}
                type="text"
                value={form.founder_name}
                onChange={onChange('founder_name')}
              />
            </Field>
            <Field label="Должность">
              <input
                className={styles.input}
                type="text"
                value={form.founder_title}
                onChange={onChange('founder_title')}
              />
            </Field>
          </div>
        </Section>

        <Section
          title="Преимущества"
          hint="Блоки с иконкой, заголовком и описанием на главной / о компании."
        >
          <div className={styles.list}>
            {advantages.map((row, index) => (
              <div className={styles.listItem} key={`adv-${index}`}>
                <div className={styles.listItemHead}>
                  <span className={styles.listItemLabel}>Преимущество {index + 1}</span>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => setAdvantages((rows) => rows.filter((_, i) => i !== index))}
                  >
                    Удалить
                  </button>
                </div>
                <div className={styles.grid2}>
                  <Field label="Иконка (ключ)">
                    <input
                      className={styles.input}
                      type="text"
                      value={row.icon || ''}
                      onChange={(e) => updateAdvantage(index, 'icon', e.target.value)}
                      placeholder="target"
                    />
                  </Field>
                  <Field label="Заголовок">
                    <input
                      className={styles.input}
                      type="text"
                      value={row.title || ''}
                      onChange={(e) => updateAdvantage(index, 'title', e.target.value)}
                    />
                  </Field>
                  <Field label="Описание" className={styles.fieldFull}>
                    <textarea
                      className={styles.textarea}
                      value={row.description || ''}
                      onChange={(e) => updateAdvantage(index, 'description', e.target.value)}
                      rows={3}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => setAdvantages((rows) => [...rows, { icon: '', title: '', description: '' }])}
          >
            + Добавить преимущество
          </button>
        </Section>

        <Section title="Способы оплаты" hint="Список способов оплаты в блоке на сайте.">
          <div className={styles.list}>
            {payments.map((row, index) => (
              <div className={styles.listItem} key={`pay-${index}`}>
                <div className={styles.listItemHead}>
                  <span className={styles.listItemLabel}>Способ {index + 1}</span>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => setPayments((rows) => rows.filter((_, i) => i !== index))}
                  >
                    Удалить
                  </button>
                </div>
                <div className={styles.grid2}>
                  <Field label="Ключ">
                    <input
                      className={styles.input}
                      type="text"
                      value={row.key || ''}
                      onChange={(e) => updatePayment(index, 'key', e.target.value)}
                      placeholder="cash, card…"
                    />
                  </Field>
                  <Field label="Название">
                    <input
                      className={styles.input}
                      type="text"
                      value={row.title || ''}
                      onChange={(e) => updatePayment(index, 'title', e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => setPayments((rows) => [...rows, { key: '', title: '' }])}
          >
            + Добавить способ оплаты
          </button>
        </Section>

        <div className={styles.footer}>
          <p className={styles.footerHint}>Сохранение обновит данные на всём публичном сайте.</p>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Сохранение…' : 'Сохранить'}
          </button>
        </div>
      </form>
    </>
  )
}
