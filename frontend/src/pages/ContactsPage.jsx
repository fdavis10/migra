import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { submitLead } from '@/api/leads'
import { SITE } from '@/config/site'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import styles from './ContactsPage.module.css'

export function ContactsPage() {
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: { name: '', phone: '', message: '', consent: false, source_page: '/kontakty' },
  })

  const onSubmit = async (values) => {
    await submitLead({
      name: values.name,
      phone: values.phone,
      message: values.message,
      citizenship: '',
      region: '',
      service: '',
      source_page: '/kontakty',
    })
    reset()
    alert('Сообщение отправлено.')
  }

  return (
    <>
      <Helmet>
        <title>Контакты — РЕЗИДЕНТ</title>
        <meta name="description" content="Адрес, телефон, режим работы и форма обратной связи." />
      </Helmet>
      <div className="section">
        <div className={`container ${styles.grid}`}>
          <div>
            <h1 className={styles.h1}>Контакты</h1>
            <p>{SITE.address}</p>
            <p>
              <a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a>
            </p>
            <p>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
            <p>{SITE.hours}</p>
            <p className={styles.msg}>
              <a href={SITE.whatsapp}>WhatsApp</a> · <a href={SITE.telegram}>Telegram</a>
            </p>
            <div className={styles.map}>
              <iframe title="Карта" src={SITE.yandexMapSrc} width="100%" height="320" style={{ border: 0 }} />
            </div>
          </div>
          <Card className={styles.formCard}>
            <h2>Обратная связь</h2>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              <label>
                Имя
                <input {...register('name')} />
              </label>
              <label>
                Телефон *
                <input {...register('phone', { required: true })} type="tel" />
              </label>
              <label>
                Сообщение
                <textarea rows={4} {...register('message')} />
              </label>
              <label className={styles.check}>
                <input type="checkbox" {...register('consent', { required: true })} />
                Согласие с политикой конфиденциальности
              </label>
              <Button type="submit" disabled={formState.isSubmitting}>
                Отправить
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  )
}
