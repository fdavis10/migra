import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { submitLead } from '@/api/leads'
import { SITE } from '@/config/site'
import { CITIZENSHIP_OPTIONS, REGION_OPTIONS } from '@/content/leadForm'
import { useLeadModal } from '@/context/LeadModalContext'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './LeadConsultationModal.module.css'

export function LeadConsultationModal() {
  const { t } = useTranslation()
  const { open, closeModal, presetService } = useLeadModal()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      citizenship: '',
      region: '',
      service: '',
      message: '',
      consent: false,
      source_page: typeof window !== 'undefined' ? window.location.pathname : '',
    },
  })

  useEffect(() => {
    if (open) {
      setValue('service', presetService)
      setValue('source_page', window.location.pathname)
    }
  }, [open, presetService, setValue])

  const onSubmit = async (values) => {
    if (!values.consent) return
    await submitLead({
      name: values.name,
      phone: values.phone,
      citizenship: values.citizenship,
      region: values.region,
      service: values.service,
      message: values.message,
      source_page: values.source_page,
    })
    reset()
    closeModal()
    alert(t('leadConsultation.alertSent'))
  }

  return (
    <Modal open={open} title={t('leadConsultation.leadTitle')} onClose={closeModal}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <label className={styles.label}>
          {t('leadConsultation.nameOptional')}
          <input className={styles.input} type="text" {...register('name')} />
        </label>
        <label className={styles.label}>
          {t('leadConsultation.phone')}
          <input
            className={styles.input}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            {...register('phone', { required: t('leadForm.phoneRequired') })}
          />
        </label>
        {errors.phone ? <p className={styles.err}>{errors.phone.message}</p> : null}
        <label className={styles.label}>
          {t('leadConsultation.citizenship')}
          <select className={styles.input} {...register('citizenship')}>
            <option value="">{t('leadForm.choose')}</option>
            {CITIZENSHIP_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          {t('leadConsultation.whereAreYou')}
          <select className={styles.input} {...register('region')}>
            <option value="">{t('leadForm.choose')}</option>
            {REGION_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          {t('leadConsultation.service')}
          <input className={styles.input} type="text" {...register('service')} />
        </label>
        <label className={styles.label}>
          {t('leadConsultation.comment')}
          <textarea className={styles.textarea} rows={3} {...register('message')} />
        </label>
        <label className={styles.check}>
          <input type="checkbox" {...register('consent', { required: true })} />
          <span>
            {t('leadConsultation.consentLink')}{' '}
            <a href="/privacy" onClick={(e) => e.stopPropagation()}>
              {t('leadConsultation.privacyLink')}
            </a>
          </span>
        </label>
        {errors.consent ? <p className={styles.err}>{t('leadConsultation.consentNeeded')}</p> : null}
        <input type="hidden" {...register('source_page')} />
        <div className={styles.actions}>
          <Button type="submit" disabled={isSubmitting}>
            {t('leadConsultation.submit')}
          </Button>
        </div>
        <p className={styles.alt}>{t('leadConsultation.orWrite')}</p>
        <div className={styles.links}>
          <a href={SITE.whatsapp} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a href={SITE.telegram} target="_blank" rel="noreferrer">
            Telegram
          </a>
          <a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a>
        </div>
      </form>
    </Modal>
  )
}
