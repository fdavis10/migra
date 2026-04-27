import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CITIZENSHIP_OPTIONS, REGION_OPTIONS } from '@/content/leadForm'
import { submitLead } from '@/api/leads'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './ServiceLeadForm.module.css'

export function ServiceLeadForm({ serviceTitle, sourcePath }) {
  const { t } = useTranslation()
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
          {t('serviceLeadForm.nameOptional')}
          <input
            name="name"
            type="text"
            autoComplete="name"
            placeholder={t('serviceLeadForm.namePlaceholder')}
          />
        </label>
        <label>
          {t('serviceLeadForm.citizenship')}
          <select name="citizenship" required>
            <option value="">{t('leadForm.choose')}</option>
            {CITIZENSHIP_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('serviceLeadForm.region')}
          <select name="region" required>
            <option value="">{t('leadForm.choose')}</option>
            {REGION_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('serviceLeadForm.phone')}
          <input name="phone" type="tel" required autoComplete="tel" placeholder="+7…" />
        </label>
        <label>
          {t('serviceLeadForm.commentOptional')}
          <textarea name="message" rows={3} placeholder={t('serviceLeadForm.commentPlaceholder')} />
        </label>
        <label className={styles.inlineCheck}>
          <input type="checkbox" name="consent" value="1" />
          {t('serviceLeadForm.consent')}
        </label>
        <Button type="submit">{t('serviceLeadForm.submit')}</Button>
      </form>
      {leadStatus === 'ok' ? <p className={styles.ok}>{t('serviceLeadForm.ok')}</p> : null}
      {leadStatus === 'err' ? <p className={styles.err}>{t('serviceLeadForm.err')}</p> : null}
      {leadStatus === 'need-consent' ? <p className={styles.err}>{t('serviceLeadForm.needConsent')}</p> : null}
    </Card>
  )
}
