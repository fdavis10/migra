import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { submitLead } from '@/api/leads'
import { SITE } from '@/config/site'
import { CITIZENSHIP_OPTIONS, REGION_OPTIONS } from '@/content/leadForm'
import { useLeadModal } from '@/context/LeadModalContext'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import styles from './LeadConsultationModal.module.css'

export function LeadConsultationModal() {
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
    alert('Заявка отправлена. Мы свяжемся с вами в ближайшее время.')
  }

  return (
    <Modal open={open} title="Бесплатная консультация" onClose={closeModal}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <label className={styles.label}>
          Имя (необязательно)
          <input className={styles.input} type="text" {...register('name')} />
        </label>
        <label className={styles.label}>
          Телефон *
          <input
            className={styles.input}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            {...register('phone', { required: 'Укажите телефон' })}
          />
        </label>
        {errors.phone ? <p className={styles.err}>{errors.phone.message}</p> : null}
        <label className={styles.label}>
          Ваше гражданство
          <select className={styles.input} {...register('citizenship')}>
            <option value="">Выберите</option>
            {CITIZENSHIP_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Где вы сейчас?
          <select className={styles.input} {...register('region')}>
            <option value="">Выберите</option>
            {REGION_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Услуга
          <input className={styles.input} type="text" {...register('service')} />
        </label>
        <label className={styles.label}>
          Комментарий
          <textarea className={styles.textarea} rows={3} {...register('message')} />
        </label>
        <label className={styles.check}>
          <input type="checkbox" {...register('consent', { required: true })} />
          <span>
            Согласие с{' '}
            <a href="/privacy" onClick={(e) => e.stopPropagation()}>
              политикой конфиденциальности
            </a>
          </span>
        </label>
        {errors.consent ? <p className={styles.err}>Необходимо согласие</p> : null}
        <input type="hidden" {...register('source_page')} />
        <div className={styles.actions}>
          <Button type="submit" disabled={isSubmitting}>
            Перезвоните мне
          </Button>
        </div>
        <p className={styles.alt}>Или напишите:</p>
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
