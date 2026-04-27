import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { submitLead } from '@/api/leads'
import { SITE } from '@/config/site'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './ContactsPage.module.css'

export function ContactsPage() {
  const { t } = useTranslation()
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
    alert(t('contactsPage.alertOk'))
  }

  return (
    <>
      <Helmet>
        <title>{t('contactsPage.title')}</title>
        <meta name="description" content={t('contactsPage.metaDesc')} />
      </Helmet>
      <div className="section">
        <div className={`container ${styles.grid}`}>
          <div>
            <h1 className={styles.h1}>{t('contactsPage.h1')}</h1>
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
              <iframe title={t('contactsPage.mapTitle')} src={SITE.yandexMapSrc} width="100%" height="320" style={{ border: 0 }} />
            </div>
          </div>
          <Card className={styles.formCard}>
            <h2>{t('contactsPage.feedback')}</h2>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              <label>
                {t('contactsPage.name')}
                <input {...register('name')} />
              </label>
              <label>
                {t('leadConsultation.phone')}
                <input {...register('phone', { required: true })} type="tel" />
              </label>
              <label>
                {t('contactsPage.message')}
                <textarea rows={4} {...register('message')} />
              </label>
              <label className={styles.check}>
                <input type="checkbox" {...register('consent', { required: true })} />
                {t('contactsPage.consent')}
              </label>
              <Button type="submit" disabled={formState.isSubmitting}>
                {t('contactsPage.submit')}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  )
}
