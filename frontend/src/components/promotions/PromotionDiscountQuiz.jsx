import { useCallback, useMemo, useState } from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import logoTelegram from '@assets/image/logo_telegram.png'
import { SITE } from '@/config/site'
import { SITE_STATIC } from '@/config/siteStatic'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './PromotionDiscountQuiz.module.css'

const TOPICS = ['patent', 'quota', 'rvp', 'vnzh', 'citizenship', 'other']
const SOURCES = ['social', 'outdoor', 'referral']

function phoneOk(phone) {
  const d = String(phone || '').replace(/\D/g, '')
  return d.length >= 10
}

export function PromotionDiscountQuiz({ variant = 'default', skipIdle = false } = {}) {
  const { t } = useTranslation()
  const embedded = variant === 'embedded'
  const [started, setStarted] = useState(() => Boolean(skipIdle))
  const [done, setDone] = useState(false)
  const [step, setStep] = useState(0)
  const [err, setErr] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [topic, setTopic] = useState('')
  const [source, setSource] = useState('')
  const [subAck, setSubAck] = useState(false)
  const [repostAck, setRepostAck] = useState(false)

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return 'https://residentservicerf.ru'
    return window.location.origin || 'https://residentservicerf.ru'
  }, [])

  const maxHref =
    (SITE_STATIC.max_url || '').trim() || 'https://web.max.ru/'

  const vkShare = `https://vk.com/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(SITE.name)}`
  const tgShare = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(SITE.name)}`

  const progressPct = done ? 100 : ((step + 1) / 5) * 100

  const progressLabel = t('promotionsPage.quizProgress')
    .replace('{current}', String(Math.min(step + 1, 5)))
    .replace('{total}', '5')

  const validateStep = useCallback(() => {
    setErr('')
    if (step === 0) {
      if (!String(name).trim()) {
        setErr(t('promotionsPage.quizErrName'))
        return false
      }
      if (!phoneOk(phone)) {
        setErr(t('promotionsPage.quizErrPhone'))
        return false
      }
    }
    if (step === 1 && !topic) {
      setErr(t('promotionsPage.quizErrTopic'))
      return false
    }
    if (step === 2 && !source) {
      setErr(t('promotionsPage.quizErrSource'))
      return false
    }
    if (step === 3 && !subAck) {
      setErr(t('promotionsPage.quizErrSubscribe'))
      return false
    }
    if (step === 4 && !repostAck) {
      setErr(t('promotionsPage.quizErrRepost'))
      return false
    }
    return true
  }, [step, name, phone, topic, source, subAck, repostAck, t])

  const onForward = () => {
    if (!validateStep()) return
    if (step >= 4) {
      setDone(true)
      return
    }
    setStep((s) => s + 1)
  }

  const onBack = () => {
    setErr('')
    if (step <= 0) return
    setStep((s) => s - 1)
  }

  if (done) {
    return (
      <div
        className={`${styles.success} ${embedded ? styles.successEmbedded : ''}`}
        role="status"
      >
        <CheckCircleIcon className={styles.successIcon} aria-hidden />
        <p className={styles.successText}>{t('promotionsPage.quizSuccess')}</p>
      </div>
    )
  }

  if (!started) {
    return (
      <div className={`${styles.idle} ${embedded ? styles.idleEmbedded : ''}`}>
        <Button type="button" variant="primary" size="lg" onClick={() => setStarted(true)}>
          {t('promotionsPage.quizStart')}
        </Button>
      </div>
    )
  }

  return (
    <div className={`${styles.wrap} ${embedded ? styles.wrapEmbedded : ''}`}>
      <div className={styles.progressTrack} aria-hidden>
        <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
      </div>
      <p className={styles.progressMeta}>{progressLabel}</p>

      {err ? (
        <p className={styles.err} role="alert">
          {err}
        </p>
      ) : null}

      <div className={styles.card}>
        {step === 0 ? (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>{t('promotionsPage.quizQ1Title')}</h2>
            <label className={styles.field}>
              <span className={styles.label}>{t('promotionsPage.quizName')}</span>
              <input
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder={t('promotionsPage.quizNamePh')}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>{t('promotionsPage.quizPhone')}</span>
              <input
                className={styles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                autoComplete="tel"
                placeholder={t('promotionsPage.quizPhonePh')}
              />
            </label>
          </div>
        ) : null}

        {step === 1 ? (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>{t('promotionsPage.quizQ2Title')}</h2>
            <div className={styles.options}>
              {TOPICS.map((id) => (
                <label key={id} className={styles.option}>
                  <input
                    type="radio"
                    name="quiz-topic"
                    checked={topic === id}
                    onChange={() => setTopic(id)}
                  />
                  <span>{t(`promotionsPage.quizTopic_${id}`)}</span>
                </label>
              ))}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>{t('promotionsPage.quizQ3Title')}</h2>
            <div className={styles.options}>
              {SOURCES.map((id) => (
                <label key={id} className={styles.option}>
                  <input
                    type="radio"
                    name="quiz-source"
                    checked={source === id}
                    onChange={() => setSource(id)}
                  />
                  <span>{t(`promotionsPage.quizSource_${id}`)}</span>
                </label>
              ))}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>{t('promotionsPage.quizQ4Title')}</h2>
            <p className={styles.hint}>{t('promotionsPage.quizQ4Hint')}</p>
            <div className={styles.socialRow}>
              <a
                className={styles.socialBtn}
                href={SITE.telegram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={logoTelegram} alt="" width={32} height={32} />
                <span>Telegram</span>
              </a>
              <a className={styles.socialBtn} href={SITE.vk} target="_blank" rel="noopener noreferrer">
                <span className={styles.vkMark} aria-hidden>
                  VK
                </span>
                <span>ВКонтакте</span>
              </a>
            </div>
            <label className={styles.check}>
              <input type="checkbox" checked={subAck} onChange={(e) => setSubAck(e.target.checked)} />
              <span>{t('promotionsPage.quizQ4Ack')}</span>
            </label>
          </div>
        ) : null}

        {step === 4 ? (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>{t('promotionsPage.quizQ5Title')}</h2>
            <p className={styles.hint}>{t('promotionsPage.quizQ5Hint')}</p>
            <div className={styles.shareRow}>
              <a
                className={`${styles.shareBtn} ${styles.shareBtnVk}`}
                href={vkShare}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('promotionsPage.quizQ5Vk')}
              </a>
              <a
                className={`${styles.shareBtn} ${styles.shareBtnTg}`}
                href={tgShare}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('promotionsPage.quizQ5Tg')}
              </a>
              <a
                className={`${styles.shareBtn} ${styles.shareBtnMax}`}
                href={maxHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('promotionsPage.quizQ5Max')}
              </a>
            </div>
            <label className={styles.check}>
              <input type="checkbox" checked={repostAck} onChange={(e) => setRepostAck(e.target.checked)} />
              <span>{t('promotionsPage.quizQ5Ack')}</span>
            </label>
          </div>
        ) : null}
      </div>

      <div className={styles.nav}>
        <Button type="button" variant="secondary" size="md" onClick={onBack} disabled={step === 0}>
          {t('promotionsPage.quizBack')}
        </Button>
        <Button type="button" variant="primary" size="md" onClick={onForward}>
          {step === 4 ? t('promotionsPage.quizFinish') : t('promotionsPage.quizForward')}
        </Button>
      </div>
    </div>
  )
}
