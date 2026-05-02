import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getPromotions } from '@/api/promos'
import { getReviews } from '@/api/reviews'
import { getServices } from '@/api/services'
import { Button } from '@/components/ui/Button'
import btn from '@/components/ui/Button.module.css'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { HeroIllustration } from '@/components/illustrations/HeroIllustration'
import { ServiceCard } from '@/components/sections/ServiceCard'
import { ReviewCarousel } from '@/components/sections/ReviewCarousel'
import { PromoParallaxCountdown } from '@/components/sections/PromoParallaxCountdown'
import { PromoFeaturedTiles } from '@/components/sections/PromoFeaturedTiles'
import { SITE } from '@/config/site'
import { getAboutCompanyParagraphs } from '@/content/about.i18n'
import { COUNTRY_FLAG_SRC } from '@/content/countryFlags'
import { QUICK_SERVICE_SLUGS } from '@/content/marketing'
import { getCountriesHelp, getWhyUs, getWorkSteps } from '@/content/marketing.i18n'
import { CITIZENSHIP_OPTIONS, REGION_OPTIONS } from '@/content/leadForm'
import { useLeadModal } from '@/context/LeadModalContext'
import { useLocale } from '@/context/LanguageContext'
import { useTranslation } from '@/i18n/useTranslation'
import { submitLead } from '@/api/leads'
import { unwrapList } from '@/utils/apiList'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { WhyUsHeroIcon } from '@/components/icons/WhyUsHeroIcon'
import styles from './HomePage.module.css'

export function HomePage() {
  const { site } = useOutletContext() || {}
  const { openModal } = useLeadModal()
  const { locale } = useLocale()
  const { t } = useTranslation()
  const whyUs = getWhyUs(locale)
  const workSteps = getWorkSteps(locale)
  const countriesHelp = getCountriesHelp(locale)
  const aboutParagraphs = getAboutCompanyParagraphs(locale)
  const [services, setServices] = useState(null)
  const [promos, setPromos] = useState(null)
  const [reviews, setReviews] = useState(null)
  const [leadStatus, setLeadStatus] = useState(null)

  useEffect(() => {
    let c = false
    ;(async () => {
      try {
        const [s, p, r] = await Promise.all([getServices(), getPromotions(), getReviews()])
        if (!c) {
          setServices(unwrapList(s))
          setPromos(unwrapList(p))
          setReviews(unwrapList(r))
        }
      } catch {
        if (!c) {
          setServices([])
          setPromos([])
          setReviews([])
        }
      }
    })()
    return () => {
      c = true
    }
  }, [])

  const quick = services
    ? QUICK_SERVICE_SLUGS.map((slug) => services.find((x) => x.slug === slug)).filter(Boolean)
    : []

  const onHomeLead = async (e) => {
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
        name: '',
        service: '',
        message: '',
        source_page: '/',
      })
      setLeadStatus('ok')
      e.target.reset()
    } catch {
      setLeadStatus('err')
    }
  }

  return (
    <>
      <Helmet>
        <title>{t('home.metaTitle')}</title>
        <meta name="description" content={t('home.metaDesc')} />
      </Helmet>

      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div>
            <h1 className={styles.h1}>{t('home.heroTitle')}</h1>
            <p className={styles.lead}>{t('home.heroLead')}</p>
            <div className={styles.heroCta}>
              <Button type="button" size="lg" onClick={() => openModal()}>
                {t('header.ctaConsultation')}
              </Button>
              <Link to="/ceny" className={styles.secondaryLink}>
                {t('home.heroCtaPrices')}
              </Link>
            </div>
            <ul className={styles.badges}>
              <li>
                <CheckCircleIcon className={styles.badgeIcon} aria-hidden />
                {t('home.badge1')}
              </li>
              <li>
                <CheckCircleIcon className={styles.badgeIcon} aria-hidden />
                {t('home.badge2')}
              </li>
              <li>
                <CheckCircleIcon className={styles.badgeIcon} aria-hidden />
                {t('home.badge3')}
              </li>
            </ul>
          </div>
          <HeroIllustration />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="sectionTitle">{t('home.quickTitle')}</h2>
          <div className={styles.quickRow}>
            {services === null
              ? [...Array(8)].map((_, i) => <Skeleton key={i} style={{ width: 88, height: 88, borderRadius: 16 }} />)
              : quick.map((s) => (
                  <Link key={s.slug} to={`/uslugi/${s.slug}`} className={styles.quickItem}>
                    <span className={styles.quickTitle}>{s.title.split('(')[0].trim()}</span>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      <section className={styles.figureBand} aria-label={t('home.figureAria')}>
        <div className="container">
          <img
            src="/images/judge_2.webp"
            alt=""
            className={styles.bandImg}
            width={1200}
            height={560}
            sizes="(max-width: 1023px) 100vw, min(1200px, 100vw)"
            loading="lazy"
            decoding="async"
          />
          <p className={styles.bandCaption}>{t('home.band1Caption')}</p>
        </div>
      </section>

      <section className={`section ${styles.altBg}`}>
        <div className="container">
          <h2 className="sectionTitle">{t('home.servicesSectionTitle')}</h2>
          <p className="sectionLead">{t('home.servicesSectionLead')}</p>
          <div className={styles.grid}>
            {services === null
              ? [...Array(6)].map((_, i) => <Skeleton key={i} style={{ height: 260, borderRadius: 20 }} />)
              : services.map((s) => (
                  <ServiceCard key={s.slug} service={s} showPrice={false} />
                ))}
          </div>
        </div>
      </section>

      <section className={styles.figureBandMuted} aria-label={t('home.figureAria')}>
        <div className="container">
          <img
            src="/images/consultation_migrant.jpg"
            alt=""
            className={styles.bandImg}
            width={1400}
            height={933}
            sizes="(max-width: 1023px) 100vw, min(1200px, 100vw)"
            loading="lazy"
            decoding="async"
          />
          <p className={styles.bandCaption}>{t('home.band2Caption')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="sectionTitle">{t('home.promosTitle')}</h2>
          <PromoParallaxCountdown
            untilIso={site?.promo_countdown_until}
            countdownDate={site?.promo_countdown_date}
          />
          <div className={styles.promoGrid}>
            {promos === null
              ? [...Array(3)].map((_, i) => <Skeleton key={i} style={{ height: 120 }} />)
              : promos.map((p) => (
                  <Card key={p.id} className={styles.promoCard}>
                    <span className={styles.disc}>{p.discount}</span>
                    <h3 className={styles.promoTitle}>{p.title}</h3>
                    <p className={styles.promoDesc}>{p.description}</p>
                  </Card>
                ))}
          </div>
          <PromoFeaturedTiles onConsult={() => openModal()} />
        </div>
      </section>

      <section className={`section ${styles.altBg}`}>
        <div className="container">
          <h2 className="sectionTitle">{t('home.whyTitle')}</h2>
          <div className={styles.whyGrid}>
            {whyUs.map((b) => (
              <Card key={b.title} className={styles.whyCard}>
                <span className={styles.whyIconWrap} aria-hidden>
                  <WhyUsHeroIcon variant={b.icon} />
                </span>
                <h3 className={styles.whyTitle}>{b.title}</h3>
                <p className={styles.whyText}>{b.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="sectionTitle">{t('home.howTitle')}</h2>
          <ol className={styles.steps}>
            {workSteps.map((step, i) => (
              <li key={step} className={styles.step}>
                <span className={styles.stepNum}>{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`section ${styles.altBg}`}>
        <div className="container">
          <div className={styles.aboutBlock}>
            <h2 className={`sectionTitle ${styles.aboutHeading}`}>{t('home.aboutTitle')}</h2>
            <div className={styles.aboutProse}>
              {aboutParagraphs.map((para, idx) => (
                <p key={idx} className={styles.aboutText}>
                  {para}
                </p>
              ))}
            </div>
            <Link to="/o-kompanii" className={`${btn.btn} ${btn.outline} ${btn.md} ${styles.aboutCta}`}>
              {t('home.aboutMore')}
            </Link>
            <div className={styles.aboutFoot}>
              <ul className={styles.stats}>
                <li>
                  <strong>10+</strong> {t('home.statYears')}
                </li>
                <li>
                  <strong>{t('home.statThousandsStrong')}</strong> {t('home.statThousandsRest')}
                </li>
                <li>
                  <strong>7/7</strong> {t('home.statConsult')}
                </li>
              </ul>
              <img
                src="/images/about-side.svg"
                alt=""
                className={styles.aboutFig}
                width={420}
                height={320}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="sectionTitle">{t('home.reviewsTitle')}</h2>
          <ReviewCarousel reviews={reviews || []} />
          <p className={styles.morePromo}>
            <Link to="/otzyvy">{t('home.allReviews')}</Link>
          </p>
        </div>
      </section>

      <section className={`section ${styles.altBg}`} id="konsult">
        <div className="container">
          <h2 className="sectionTitle">{t('home.consultTitle')}</h2>
          <p className="sectionLead">{t('home.consultLead')}</p>
          <div className={styles.leadGrid}>
          <Card className={styles.leadCard}>
            <form className={styles.leadForm} onSubmit={onHomeLead}>
              <label>
                {t('home.leadCitizenship')}
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
                {t('home.leadRegion')}
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
                {t('home.leadPhone')}
                <input name="phone" type="tel" required placeholder="+7…" />
              </label>
              <label className={styles.inlineCheck}>
                <input type="checkbox" name="consent" value="1" />
                {t('home.leadConsent')}
              </label>
              <Button type="submit">{t('home.leadSubmit')}</Button>
            </form>
            {leadStatus === 'ok' ? <p className={styles.ok}>{t('home.leadOk')}</p> : null}
            {leadStatus === 'err' ? <p className={styles.err}>{t('home.leadErr')}</p> : null}
            {leadStatus === 'need-consent' ? <p className={styles.err}>{t('home.leadNeedConsent')}</p> : null}
          </Card>
            <img
              src="/images/consultatuion_lawyear.jpg"
              alt={t('home.consultImgAlt')}
              className={styles.leadFig}
              width={1200}
              height={800}
              sizes="(max-width: 1023px) 100vw, 480px"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="sectionTitle">{t('home.countriesTitle')}</h2>
          <div
            className={styles.flagsMarquee}
            role="region"
            aria-label={t('home.countriesAria')}
          >
            <div className={styles.flagsTrack}>
              <ul className={styles.flagsList}>
                {countriesHelp.map((c) => (
                  <li key={c.code} className={styles.flagItem}>
                    <span className={styles.flagCircle}>
                      <img
                        src={COUNTRY_FLAG_SRC[c.code]}
                        alt=""
                        width={40}
                        height={30}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <span className={styles.flagName}>{c.name}</span>
                  </li>
                ))}
              </ul>
              <ul className={styles.flagsList} aria-hidden={true}>
                {countriesHelp.map((c) => (
                  <li key={`dup-${c.code}`} className={styles.flagItem}>
                    <span className={styles.flagCircle}>
                      <img
                        src={COUNTRY_FLAG_SRC[c.code]}
                        alt=""
                        width={40}
                        height={30}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <span className={styles.flagName}>{c.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className={styles.flagsNote}>{t('home.countriesNote')}</p>
        </div>
      </section>

      <section className={`section ${styles.altBg}`}>
        <div className="container">
          <h2 className="sectionTitle">{t('home.contactsTitle')}</h2>
          <div className={styles.contactGrid}>
            <div>
              <p>{SITE.address}</p>
              <p>
                <a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a>
              </p>
              <p>{SITE.hours}</p>
              <Link to="/kontakty">{t('home.contactsFormMap')}</Link>
            </div>
            <div className={styles.map}>
              <iframe title={t('home.mapIframeTitle')} src={SITE.yandexMapSrc} width="100%" height="280" style={{ border: 0 }} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
