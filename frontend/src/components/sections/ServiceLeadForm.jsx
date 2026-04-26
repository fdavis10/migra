import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CITIZENSHIP_OPTIONS, REGION_OPTIONS } from '@/content/leadForm'
import { submitLead } from '@/api/leads'
import styles from './ServiceLeadForm.module.css'

export function ServiceLeadForm({ serviceTitle, sourcePath }) {
  const [leadStatus, setLeadStatus] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    if (!fd.get('consent')) {
      setLeadStatus('need-consent')
      return
    }
    try {
      await submitLead({
        phone: fd.get('phone'),
        citizenship: fd.get('citizenship'),
        region: fd.get('region'),
        name: fd.get('name') || '',
        service: serviceTitle || '',
        message: fd.get('message') || '',
        source_page: sourcePath || '',
      })
      setLeadStatus('ok')
      e.target.reset()
    } catch {
      setLeadStatus('err')
    }
  }

  return (
    <Card className={styles.card}>
      <form className={styles.form} onSubmit={onSubmit}>
        <label>
          Имя (необязательно)
          <input name="name" type="text" autoComplete="name" placeholder="Как к вам обращаться" />
        </label>
        <label>
          Гражданство
          <select name="citizenship" required>
            <option value="">Выберите</option>
            {CITIZENSHIP_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Регион
          <select name="region" required>
            <option value="">Выберите</option>
            {REGION_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Телефон
          <input name="phone" type="tel" required autoComplete="tel" placeholder="+7…" />
        </label>
        <label>
          Комментарий (необязательно)
          <textarea name="message" rows={3} placeholder="Кратко опишите ситуацию" />
        </label>
        <label className={styles.inlineCheck}>
          <input type="checkbox" name="consent" value="1" />
          Согласие с политикой конфиденциальности
        </label>
        <Button type="submit">Отправить заявку</Button>
      </form>
      {leadStatus === 'ok' ? <p className={styles.ok}>Заявка отправлена. Мы свяжемся с вами.</p> : null}
      {leadStatus === 'err' ? <p className={styles.err}>Ошибка отправки. Попробуйте позже.</p> : null}
      {leadStatus === 'need-consent' ? <p className={styles.err}>Нужно согласие с политикой.</p> : null}
    </Card>
  )
}
