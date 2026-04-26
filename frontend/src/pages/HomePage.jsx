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
import { ABOUT_COMPANY } from '@/content/about'
import {
  COUNTRIES_HELP,
  QUICK_SERVICE_SLUGS,
  WHY_US,
  WORK_STEPS,
} from '@/content/marketing'
import { CITIZENSHIP_OPTIONS, REGION_OPTIONS } from '@/content/leadForm'
import { useLeadModal } from '@/context/LeadModalContext'
import { submitLead } from '@/api/leads'
import { unwrapList } from '@/utils/apiList'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { WhyUsHeroIcon } from '@/components/icons/WhyUsHeroIcon'
import styles from './HomePage.module.css'

export function HomePage() {
  const { site } = useOutletContext() || {}
  const { openModal } = useLeadModal()
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
        <title>РЕЗИДЕНТ — Ваш надёжный путь к гражданству России</title>
        <meta
          name="description"
          content="Профессиональная помощь в оформлении РВП, ВНЖ и гражданства РФ. Бесплатная консультация."
        />
      </Helmet>

      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div>
            <h1 className={styles.h1}>Ваш надёжный путь к гражданству России</h1>
            <p className={styles.lead}>
              Профессиональная помощь в оформлении РВП, ВНЖ и гражданства РФ. Сопровождаем на каждом этапе — от
              первой консультации до паспорта.
            </p>
            <div className={styles.heroCta}>
              <Button type="button" size="lg" onClick={() => openModal()}>
                Бесплатная консультация
              </Button>
              <Link to="/ceny" className={styles.secondaryLink}>
                Узнать стоимость
              </Link>
            </div>
            <ul className={styles.badges}>
              <li>
                <CheckCircleIcon className={styles.badgeIcon} aria-hidden />
                Более 10 лет опыта
              </li>
              <li>
                <CheckCircleIcon className={styles.badgeIcon} aria-hidden />
                Договор с гарантиями
              </li>
              <li>
                <CheckCircleIcon className={styles.badgeIcon} aria-hidden />
                Бесплатная консультация
              </li>
            </ul>
          </div>
          <HeroIllustration />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="sectionTitle">Быстрый доступ к услугам</h2>
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

      <section className={styles.figureBand} aria-label="Иллюстрация">
        <div className="container">
          <img
            src="/images/judge_2.webp"
            alt=""
            className={styles.bandImg}
            width={1200}
            height={560}
            loading="lazy"
            decoding="async"
          />
          <p className={styles.bandCaption}>Документы и сроки — под контролем специалистов</p>
        </div>
      </section>

      <section className={`section ${styles.altBg}`}>
        <div className="container">
          <h2 className="sectionTitle">Помогаем получить государственные миграционные услуги</h2>
          <p className="sectionLead">Полный список — на странице услуг. Ниже основные направления.</p>
          <div className={styles.grid}>
            {services === null
              ? [...Array(6)].map((_, i) => <Skeleton key={i} style={{ height: 260, borderRadius: 20 }} />)
              : services.map((s) => (
                  <ServiceCard key={s.slug} service={s} />
                ))}
          </div>
        </div>
      </section>

      <section className={styles.figureBandMuted} aria-label="Иллюстрация">
        <div className="container">
          <img
            src="/images/consulatation.webp"
            alt=""
            className={styles.bandImg}
            width={1200}
            height={560}
            loading="lazy"
            decoding="async"
          />
          <p className={styles.bandCaption}>От консультации до результата — понятный маршрут</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="sectionTitle">Акции и специальные предложения</h2>
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
          <h2 className="sectionTitle">Почему выбирают «РЕЗИДЕНТ»?</h2>
          <div className={styles.whyGrid}>
            {WHY_US.map((b) => (
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
          <h2 className="sectionTitle">Как мы работаем</h2>
          <ol className={styles.steps}>
            {WORK_STEPS.map((t, i) => (
              <li key={t} className={styles.step}>
                <span className={styles.stepNum}>{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`section ${styles.altBg}`}>
        <div className="container">
          <div className={styles.aboutBlock}>
            <h2 className={`sectionTitle ${styles.aboutHeading}`}>О компании</h2>
            <div className={styles.aboutProse}>
              {ABOUT_COMPANY.split(/\n\n+/)
                .map((p) => p.trim())
                .filter(Boolean)
                .map((para, idx) => (
                  <p key={idx} className={styles.aboutText}>
                    {para}
                  </p>
                ))}
            </div>
            <Link to="/o-kompanii" className={`${btn.btn} ${btn.outline} ${btn.md} ${styles.aboutCta}`}>
              Подробнее о нас
            </Link>
            <div className={styles.aboutFoot}>
              <ul className={styles.stats}>
                <li>
                  <strong>10+</strong> лет на рынке
                </li>
                <li>
                  <strong>Тысячи</strong> успешных дел
                </li>
                <li>
                  <strong>7/7</strong> консультации
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
          <h2 className="sectionTitle">Отзывы наших клиентов</h2>
          <ReviewCarousel reviews={reviews || []} />
          <p className={styles.morePromo}>
            <Link to="/otzyvy">Все отзывы</Link>
          </p>
        </div>
      </section>

      <section className={`section ${styles.altBg}`} id="konsult">
        <div className="container">
          <h2 className="sectionTitle">Получите бесплатную консультацию</h2>
          <p className="sectionLead">Изучим вашу ситуацию и составим персональный план легализации.</p>
          <div className={styles.leadGrid}>
          <Card className={styles.leadCard}>
            <form className={styles.leadForm} onSubmit={onHomeLead}>
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
                <input name="phone" type="tel" required placeholder="+7…" />
              </label>
              <label className={styles.inlineCheck}>
                <input type="checkbox" name="consent" value="1" />
                Согласие с политикой конфиденциальности
              </label>
              <Button type="submit">Перезвоните мне</Button>
            </form>
            {leadStatus === 'ok' ? <p className={styles.ok}>Заявка отправлена.</p> : null}
            {leadStatus === 'err' ? <p className={styles.err}>Ошибка отправки. Попробуйте позже.</p> : null}
            {leadStatus === 'need-consent' ? <p className={styles.err}>Нужно согласие.</p> : null}
          </Card>
            <img
              src="/images/consultatuion_lawyear.jpg"
              alt="Консультация с юристом"
              className={styles.leadFig}
              width={900}
              height={600}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="sectionTitle">Страны, которым помогаем</h2>
          <div
            className={styles.flagsMarquee}
            role="region"
            aria-label="Список стран, гражданам которых помогаем с легализацией"
          >
            <div className={styles.flagsTrack}>
              <ul className={styles.flagsList}>
                {COUNTRIES_HELP.map((c) => (
                  <li key={c.code} className={styles.flagItem}>
                    <span className={styles.flagCircle}>
                      <img
                        src={`https://flagcdn.com/w40/${c.code}.png`}
                        srcSet={`https://flagcdn.com/w80/${c.code}.png 2x`}
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
                {COUNTRIES_HELP.map((c) => (
                  <li key={`dup-${c.code}`} className={styles.flagItem}>
                    <span className={styles.flagCircle}>
                      <img
                        src={`https://flagcdn.com/w40/${c.code}.png`}
                        srcSet={`https://flagcdn.com/w80/${c.code}.png 2x`}
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
          <p className={styles.flagsNote}>
            Не нашли своё государство? Свяжитесь с нами — мы помогаем гражданам любых стран.
          </p>
        </div>
      </section>

      <section className={`section ${styles.altBg}`}>
        <div className="container">
          <h2 className="sectionTitle">Контакты</h2>
          <div className={styles.contactGrid}>
            <div>
              <p>{SITE.address}</p>
              <p>
                <a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a>
              </p>
              <p>{SITE.hours}</p>
              <Link to="/kontakty">Форма и карта</Link>
            </div>
            <div className={styles.map}>
              <iframe title="Карта" src={SITE.yandexMapSrc} width="100%" height="280" style={{ border: 0 }} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
