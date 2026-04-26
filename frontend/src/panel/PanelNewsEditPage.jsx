import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { panelApi } from './panelApi'
import './panel.css'

function toDatetimeLocal(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function PanelNewsEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const [loading, setLoading] = useState(!isNew)
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const [form, setForm] = useState({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    category: '',
    is_published: true,
    published_at: toDatetimeLocal(new Date().toISOString()),
  })
  const [file, setFile] = useState(null)

  useEffect(() => {
    if (isNew) return
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await panelApi.get(`panel/news/${id}/`)
        if (cancelled) return
        setForm({
          slug: data.slug || '',
          title: data.title || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          category: data.category || '',
          is_published: Boolean(data.is_published),
          published_at: toDatetimeLocal(data.published_at),
        })
      } catch {
        if (!cancelled) setErr('Не удалось загрузить запись')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, isNew])

  const onChange = (field) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [field]: v }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setOk('')
    const publishedIso = new Date(form.published_at).toISOString()

    try {
      if (file) {
        const fd = new FormData()
        fd.append('slug', form.slug)
        fd.append('title', form.title)
        fd.append('excerpt', form.excerpt)
        fd.append('content', form.content)
        fd.append('category', form.category)
        fd.append('is_published', form.is_published ? 'true' : 'false')
        fd.append('published_at', publishedIso)
        fd.append('image', file)
        if (isNew) {
          await panelApi.post('panel/news/', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        } else {
          await panelApi.patch(`panel/news/${id}/`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        }
      } else {
        const body = {
          ...form,
          published_at: publishedIso,
        }
        if (isNew) {
          await panelApi.post('panel/news/', body)
        } else {
          await panelApi.patch(`panel/news/${id}/`, body)
        }
      }
      setOk('Сохранено')
      if (isNew) navigate('/panel/news')
    } catch (ex) {
      const d = ex.response?.data
      setErr(typeof d === 'object' ? JSON.stringify(d) : 'Ошибка сохранения')
    }
  }

  if (loading) {
    return <p className="panelMuted">Загрузка…</p>
  }

  return (
    <>
      <p>
        <Link to="/panel/news">← К списку</Link>
      </p>
      <h1 className="panelH1">{isNew ? 'Новая новость' : 'Редактирование'}</h1>
      {err ? <p className="panelErr">{err}</p> : null}
      {ok ? <p className="panelOk">{ok}</p> : null}
      <form className="panelForm panelCard" onSubmit={onSubmit}>
        <label>
          Slug (URL)
          <input type="text" value={form.slug} onChange={onChange('slug')} required />
        </label>
        <label>
          Заголовок
          <input type="text" value={form.title} onChange={onChange('title')} required />
        </label>
        <label>
          Категория
          <input type="text" value={form.category} onChange={onChange('category')} />
        </label>
        <label>
          Анонс
          <textarea value={form.excerpt} onChange={onChange('excerpt')} required rows={4} />
        </label>
        <label>
          Текст
          <textarea value={form.content} onChange={onChange('content')} required rows={12} />
        </label>
        <label>
          Дата публикации
          <input type="datetime-local" value={form.published_at} onChange={onChange('published_at')} required />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={form.is_published} onChange={onChange('is_published')} />
          Опубликовано на сайте
        </label>
        <label>
          Изображение (необязательно)
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
        <button type="submit" className="panelBtn">
          Сохранить
        </button>
      </form>
    </>
  )
}
