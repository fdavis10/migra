import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { mediaUrl } from '@/utils/mediaUrl'
import { panelApi } from './panelApi'
import './panel.css'
import siteStyles from './PanelSitePage.module.css'
import styles from './PanelServiceEditPage.module.css'

const ICON_OPTIONS = [
  { value: 'rvp', label: 'Документ / РВП' },
  { value: 'quota', label: 'Квота' },
  { value: 'vnzh', label: 'ВНЖ / жильё' },
  { value: 'passport', label: 'Паспорт' },
  { value: 'id', label: 'Удостоверение' },
  { value: 'work', label: 'Работа' },
  { value: 'briefcase', label: 'Портфель' },
  { value: 'gavel', label: 'Суд / весы' },
  { value: 'shield', label: 'Щит' },
  { value: 'heart', label: 'Сердце' },
  { value: 'fingerprint', label: 'Отпечаток' },
  { value: 'education', label: 'Образование' },
  { value: 'flag', label: 'Флаг' },
  { value: 'people', label: 'Люди' },
  { value: 'chat', label: 'Чат / консультация' },
  { value: 'document', label: 'Документ' },
]

const emptyForm = {
  slug: '',
  title: '',
  short_desc: '',
  full_desc: '',
  icon: 'document',
  price_from: '',
  price_to: '',
  price_note: '',
  is_main: false,
  order: 0,
}

function Field({ label, hint, className, children }) {
  return (
    <label className={[siteStyles.field, className].filter(Boolean).join(' ')}>
      {label}
      {hint ? <span className={siteStyles.hint}>{hint}</span> : null}
      {children}
    </label>
  )
}

function Section({ title, hint, children }) {
  return (
    <section className={siteStyles.section}>
      <div className={siteStyles.sectionHead}>
        <h2 className={siteStyles.sectionTitle}>{title}</h2>
        {hint ? <p className={siteStyles.sectionHint}>{hint}</p> : null}
      </div>
      <div className={siteStyles.sectionBody}>{children}</div>
    </section>
  )
}

function slugify(title) {
  return String(title || '')
    .toLowerCase()
    .trim()
    .replace(/[ё]/g, 'e')
    .replace(/[^a-z0-9а-я\s-]/gi, '')
    .replace(/[а-я]/gi, (ch) => {
      const map = {
        а: 'a',
        б: 'b',
        в: 'v',
        г: 'g',
        д: 'd',
        е: 'e',
        ж: 'zh',
        з: 'z',
        и: 'i',
        й: 'y',
        к: 'k',
        л: 'l',
        м: 'm',
        н: 'n',
        о: 'o',
        п: 'p',
        р: 'r',
        с: 's',
        т: 't',
        у: 'u',
        ф: 'f',
        х: 'h',
        ц: 'ts',
        ч: 'ch',
        ш: 'sh',
        щ: 'sch',
        ъ: '',
        ы: 'y',
        ь: '',
        э: 'e',
        ю: 'yu',
        я: 'ya',
      }
      return map[ch] || ''
    })
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function PanelServiceEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [currentImage, setCurrentImage] = useState(null)
  const [file, setFile] = useState(null)
  const [clearImage, setClearImage] = useState(false)
  const [slugManual, setSlugManual] = useState(!isNew)

  const previewUrl = useMemo(() => {
    if (file) return URL.createObjectURL(file)
    if (clearImage) return null
    return mediaUrl(currentImage)
  }, [file, clearImage, currentImage])

  useEffect(() => {
    if (!file) return undefined
    const url = previewUrl
    return () => {
      if (url && url.startsWith('blob:')) URL.revokeObjectURL(url)
    }
  }, [file, previewUrl])

  useEffect(() => {
    if (isNew) return
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await panelApi.get(`panel/services/${id}/`)
        if (cancelled) return
        setForm({
          slug: data.slug || '',
          title: data.title || '',
          short_desc: data.short_desc || '',
          full_desc: data.full_desc || '',
          icon: data.icon || 'document',
          price_from: data.price_from ?? '',
          price_to: data.price_to ?? '',
          price_note: data.price_note || '',
          is_main: Boolean(data.is_main),
          order: data.order ?? 0,
        })
        setCurrentImage(data.image || null)
      } catch {
        if (!cancelled) setErr('Не удалось загрузить услугу')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, isNew])

  const onChange = (field) => (e) => {
    const raw = e.target
    const v = raw.type === 'checkbox' ? raw.checked : raw.value
    setForm((f) => {
      const next = { ...f, [field]: v }
      if (field === 'title' && !slugManual && isNew) {
        next.slug = slugify(v)
      }
      return next
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setOk('')
    setSaving(true)

    const payload = {
      slug: form.slug,
      title: form.title,
      short_desc: form.short_desc,
      full_desc: form.full_desc,
      icon: form.icon,
      price_note: form.price_note,
      is_main: form.is_main,
      order: Number(form.order) || 0,
      price_from: form.price_from === '' ? null : form.price_from,
      price_to: form.price_to === '' ? null : form.price_to,
    }

    try {
      let saved
      if (file || clearImage) {
        const fd = new FormData()
        Object.entries(payload).forEach(([k, v]) => {
          if (v === null || v === undefined) return
          if (typeof v === 'boolean') fd.append(k, v ? 'true' : 'false')
          else fd.append(k, String(v))
        })
        if (payload.price_from === null) fd.append('price_from', '')
        if (payload.price_to === null) fd.append('price_to', '')
        if (file) fd.append('image', file)
        if (clearImage && !file) fd.append('clear_image', 'true')
        if (isNew) {
          const { data } = await panelApi.post('panel/services/', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          saved = data
        } else {
          const { data } = await panelApi.patch(`panel/services/${id}/`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          saved = data
        }
      } else if (isNew) {
        const { data } = await panelApi.post('panel/services/', payload)
        saved = data
      } else {
        const { data } = await panelApi.patch(`panel/services/${id}/`, payload)
        saved = data
      }

      setOk('Сохранено')
      setCurrentImage(saved.image || null)
      setFile(null)
      setClearImage(false)
      if (isNew) navigate(`/panel/services/${saved.id}`, { replace: true })
    } catch (ex) {
      const d = ex.response?.data
      setErr(typeof d === 'object' ? JSON.stringify(d) : 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (isNew) return
    if (!window.confirm(`Удалить услугу «${form.title}»?`)) return
    try {
      await panelApi.delete(`panel/services/${id}/`)
      navigate('/panel/services')
    } catch {
      setErr('Не удалось удалить')
    }
  }

  if (loading) return <p className="panelMuted">Загрузка…</p>

  return (
    <>
      <p className={styles.back}>
        <Link to="/panel/services">← К списку услуг</Link>
      </p>

      <div className={siteStyles.hero}>
        <h1 className={siteStyles.heroTitle}>{isNew ? 'Новая услуга' : 'Редактирование услуги'}</h1>
        <p className={siteStyles.heroSub}>
          {isNew
            ? 'Заполните основные поля и при желании загрузите изображение для страницы услуги.'
            : `Публичная страница: /uslugi/${form.slug || '…'}`}
        </p>
      </div>

      {err ? (
        <p className={siteStyles.alertErr} role="alert">
          {err}
        </p>
      ) : null}
      {ok ? <p className={siteStyles.alertOk}>{ok}</p> : null}

      <form className={siteStyles.form} onSubmit={onSubmit}>
        <Section title="Основное" hint="Название, URL и краткий текст карточки услуги.">
          <div className={siteStyles.grid2}>
            <Field label="Название" className={siteStyles.fieldFull}>
              <input
                className={siteStyles.input}
                type="text"
                value={form.title}
                onChange={onChange('title')}
                required
              />
            </Field>
            <Field
              label="Slug (URL)"
              hint="Латиница, без пробелов. Пример: rvp, kvota-rvp"
              className={siteStyles.fieldFull}
            >
              <input
                className={siteStyles.input}
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setSlugManual(true)
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }}
                required
              />
            </Field>
            <Field label="Краткое описание" className={siteStyles.fieldFull}>
              <textarea
                className={siteStyles.textarea}
                value={form.short_desc}
                onChange={onChange('short_desc')}
                rows={4}
                required
              />
            </Field>
            <Field label="Полное описание" className={siteStyles.fieldFull}>
              <textarea
                className={siteStyles.textarea}
                value={form.full_desc}
                onChange={onChange('full_desc')}
                rows={8}
              />
            </Field>
          </div>
        </Section>

        <Section title="Изображение" hint="Показывается в hero на странице услуги. Если не загружено — на сайте останется запасная картинка по slug (если она есть).">
          <div className={styles.imageRow}>
            <div className={styles.previewBox}>
              {previewUrl ? (
                <img src={previewUrl} alt="Текущее изображение услуги" className={styles.previewImg} />
              ) : (
                <span className={styles.previewEmpty}>Нет изображения</span>
              )}
            </div>
            <div className={styles.imageControls}>
              <Field label="Загрузить новое">
                <input
                  className={siteStyles.input}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] || null)
                    setClearImage(false)
                  }}
                />
              </Field>
              {currentImage && !file ? (
                <label className={styles.checkRow}>
                  <input
                    type="checkbox"
                    checked={clearImage}
                    onChange={(e) => setClearImage(e.target.checked)}
                  />
                  Удалить текущее изображение
                </label>
              ) : null}
              {file ? (
                <button
                  type="button"
                  className={styles.ghostBtn}
                  onClick={() => setFile(null)}
                >
                  Отменить выбранный файл
                </button>
              ) : null}
            </div>
          </div>
        </Section>

        <Section title="Отображение" hint="Иконка в карточке, порядок и показ на главной.">
          <div className={siteStyles.grid3}>
            <Field label="Иконка">
              <select className={siteStyles.input} value={form.icon} onChange={onChange('icon')}>
                {ICON_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Порядок">
              <input
                className={siteStyles.input}
                type="number"
                min={0}
                value={form.order}
                onChange={onChange('order')}
              />
            </Field>
            <Field label="На главной">
              <label className={styles.checkRow} style={{ marginTop: 10 }}>
                <input type="checkbox" checked={form.is_main} onChange={onChange('is_main')} />
                Показывать в блоке на главной
              </label>
            </Field>
          </div>
        </Section>

        <Section title="Цена" hint="Диапазон «от / до» и примечание под ценой.">
          <div className={siteStyles.grid3}>
            <Field label="Цена от">
              <input
                className={siteStyles.input}
                type="number"
                step="0.01"
                min={0}
                value={form.price_from}
                onChange={onChange('price_from')}
                placeholder="например 15000"
              />
            </Field>
            <Field label="Цена до">
              <input
                className={siteStyles.input}
                type="number"
                step="0.01"
                min={0}
                value={form.price_to}
                onChange={onChange('price_to')}
              />
            </Field>
            <Field label="Примечание">
              <input
                className={siteStyles.input}
                type="text"
                value={form.price_note}
                onChange={onChange('price_note')}
                placeholder="от … ₽"
              />
            </Field>
          </div>
        </Section>

        <div className={siteStyles.footer}>
          <div className={styles.footerLeft}>
            {!isNew ? (
              <button type="button" className={styles.dangerBtn} onClick={onDelete}>
                Удалить
              </button>
            ) : (
              <p className={siteStyles.footerHint}>После сохранения услуга появится в API и на сайте.</p>
            )}
          </div>
          <button type="submit" className={siteStyles.saveBtn} disabled={saving}>
            {saving ? 'Сохранение…' : 'Сохранить'}
          </button>
        </div>
      </form>
    </>
  )
}
