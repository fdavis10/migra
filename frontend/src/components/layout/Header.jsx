import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDownIcon, GlobeAltIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { submitLead } from "@/api/leads";
import logoResident from "@assets/image/logo.png";
import logoYandex from "@assets/image/logo_yandex.svg";
import logoMax from "@assets/image/logo_max.png";
import logoTelegram from "@assets/image/logo_telegram.png";
import logoWhatsapp from "@assets/image/logo_whatsapp.png";
import { ABOUT_NAV_ITEMS } from "@/content/aboutNav";
import { LOCALE_ITEMS } from "@/content/languageOptions";
import { useCity } from "@/context/CityContext";
import { useLocale } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/useTranslation";
import { useLeadModal } from "../../context/LeadModalContext.jsx";
import { CityPickerModal } from "./CityPickerModal.jsx";
import { ServicesMegaMenuModal } from "./ServicesMegaMenuModal.jsx";
import { HeaderSiteSearch } from "./HeaderSiteSearch.jsx";
import { Button } from "../ui/Button.jsx";
import styles from "./Header.module.css";

export function Header({ site, services = [] }) {
  const { openModal } = useLeadModal();
  const { pathname } = useLocation();
  const { city } = useCity();
  const { locale, setLocale } = useLocale();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [servicesMegaOpen, setServicesMegaOpen] = useState(false);
  const localeBarRef = useRef(null);
  const phoneWrapRef = useRef(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      consent: false,
    },
  });

  const phone = site?.phone || "+7 (916) 303-28-63";
  const localeLabel = LOCALE_ITEMS.find((x) => x.code === locale)?.label ?? "RU";
  const maxMessengerUrl = site?.max_url || site?.vk_url || "";

  useEffect(() => {
    if (!langOpen) return;
    const handle = (e) => {
      if (localeBarRef.current && !localeBarRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [langOpen]);

  useEffect(() => {
    if (!callbackOpen) return;
    const onDoc = (e) => {
      if (phoneWrapRef.current && !phoneWrapRef.current.contains(e.target)) {
        setCallbackOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setCallbackOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [callbackOpen]);

  useEffect(() => {
    if (!callbackOpen) reset();
  }, [callbackOpen, reset]);

  const phoneTelHref = `tel:${String(phone).replace(/\s/g, "")}`;
  const infoNavActive = pathname.startsWith("/novosti") || pathname.startsWith("/faq");

  const onCallbackSubmit = async (values) => {
    if (!values.consent) return;
    await submitLead({
      name: values.name,
      phone: values.phone,
      citizenship: "",
      region: "",
      service: t("header.callbackServiceTag"),
      message: t("header.callbackLeadNote"),
      source_page: typeof window !== "undefined" ? window.location.pathname : "",
    });
    reset();
    setCallbackOpen(false);
    alert(t("leadConsultation.alertSent"));
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
            <img src={logoResident} alt={t("header.logoAlt")} decoding="async" />
          </Link>
          <img
            className={styles.yandexLogo}
            src={logoYandex}
            width={120}
            height={40}
            alt={t("header.yandexAlt")}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className={`${styles.localeBar} ${styles.localeBarDesk}`} ref={localeBarRef}>
          <div className={styles.localeBarLeading}>
            <button
              type="button"
              className={styles.cityTrigger}
              onClick={() => {
                setLangOpen(false);
                setCityOpen(true);
              }}
              aria-label={t("header.cityAriaLabel")}
              aria-haspopup="dialog"
              aria-expanded={cityOpen}
            >
              <span className={styles.cityName}>{city}</span>
              <GlobeAltIcon className={styles.cityGlobe} aria-hidden />
            </button>
            <div className={styles.langWrap}>
              <button
                type="button"
                className={styles.langTrigger}
                onClick={() => setLangOpen((v) => !v)}
                aria-expanded={langOpen}
                aria-haspopup="menu"
                aria-label={t("header.langAriaLabel")}
              >
                <span className={styles.langCode}>{localeLabel}</span>
              </button>
              {langOpen ? (
                <div className={styles.langPanel} role="menu">
                  {LOCALE_ITEMS.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      role="menuitem"
                      className={locale === item.code ? styles.langOptionActive : styles.langOption}
                      onClick={() => {
                        setLocale(item.code);
                        setLangOpen(false);
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <address className={styles.officeAddress}>
            <span className={styles.officeAddressLine}>{t("headerAddress.line1")}</span>
            <span className={styles.officeAddressLine}>{t("headerAddress.line2")}</span>
          </address>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.contacts}>
            <div className={styles.contactsRow}>
              <div
                className={`${styles.phoneWrap} ${callbackOpen ? styles.phoneWrapOpen : ""}`}
                ref={phoneWrapRef}
              >
              <span className={styles.phoneTooltip}>{t("header.phoneCallbackHint")}</span>
              <button
                type="button"
                className={styles.phoneTrigger}
                aria-expanded={callbackOpen}
                aria-haspopup="dialog"
                aria-controls="header-callback-popover"
                onClick={() => setCallbackOpen((v) => !v)}
              >
                <span className="visuallyHidden">
                  {phone}. {t("header.phoneOpenCallbackAria")}
                </span>
                <PhoneIcon className={styles.phoneIcon} aria-hidden />
                <span className={styles.phoneDigits} aria-hidden>
                  {phone}
                </span>
              </button>
              {callbackOpen ? (
                <div
                  id="header-callback-popover"
                  className={styles.callbackPanel}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="header-callback-title"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <h2 id="header-callback-title" className={styles.callbackTitle}>
                    {t("header.callbackTitle")}
                  </h2>
                  <form className={styles.callbackForm} onSubmit={handleSubmit(onCallbackSubmit)}>
                    <label className={styles.callbackLabel}>
                      {t("leadConsultation.nameOptional")}
                      <input className={styles.callbackInput} type="text" {...register("name")} />
                    </label>
                    <label className={styles.callbackLabel}>
                      {t("leadConsultation.phone")}
                      <input
                        className={styles.callbackInput}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        {...register("phone", { required: t("leadForm.phoneRequired") })}
                      />
                    </label>
                    {errors.phone ? <p className={styles.callbackErr}>{errors.phone.message}</p> : null}
                    <label className={styles.callbackCheck}>
                      <input type="checkbox" {...register("consent", { required: true })} />
                      <span>
                        {t("leadConsultation.consentLink")}{" "}
                        <a href="/privacy" onClick={(e) => e.stopPropagation()}>
                          {t("leadConsultation.privacyLink")}
                        </a>
                      </span>
                    </label>
                    {errors.consent ? (
                      <p className={styles.callbackErr}>{t("leadConsultation.consentNeeded")}</p>
                    ) : null}
                    <div className={styles.callbackActions}>
                      <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
                        {t("leadConsultation.submit")}
                      </Button>
                    </div>
                    <a className={styles.callbackTelLink} href={phoneTelHref}>
                      {t("header.callbackCallNow")}
                    </a>
                  </form>
                </div>
              ) : null}
            </div>
            <div className={`${styles.messengerIcons} ${styles.messengerIconsDesk}`}>
              {maxMessengerUrl ? (
                <a
                  className={`${styles.messengerIconLink} ${styles.messengerIconLinkMax}`}
                  href={maxMessengerUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("header.messengerMaxAria")}
                >
                  <img src={logoMax} alt="" decoding="async" />
                </a>
              ) : null}
              {site?.telegram_url ? (
                <a
                  className={styles.messengerIconLink}
                  href={site.telegram_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("header.messengerTelegramAria")}
                >
                  <img src={logoTelegram} alt="" decoding="async" />
                </a>
              ) : null}
              {site?.whatsapp_url ? (
                <a
                  className={styles.messengerIconLink}
                  href={site.whatsapp_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("header.messengerWhatsAppAria")}
                >
                  <img src={logoWhatsapp} alt="" decoding="async" />
                </a>
              ) : null}
            </div>
            </div>
          </div>

          <Button className={styles.ctaDesk} variant="primary" size="md" type="button" onClick={() => openModal()}>
            {t("header.ctaConsultation")}
          </Button>
        </div>

        <button
          type="button"
          className={styles.burger}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="visuallyHidden">{t("header.burgerAria")}</span>
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav id="main-nav" className={`${styles.navWrap} ${menuOpen ? styles.navOpen : ""}`}>
        <div className={`container ${styles.navContainer}`}>
          <div className={styles.nav}>
            <div className={styles.navLeft}>
              <button
                type="button"
                className={styles.weHelpBtn}
                aria-expanded={servicesMegaOpen}
                aria-haspopup="dialog"
                aria-label={t("header.servicesMegaOpenAria")}
                onClick={() => {
                  setAboutOpen(false);
                  setInfoOpen(false);
                  setServicesMegaOpen((v) => !v);
                }}
              >
                {t("header.navWeHelp")}
                <ChevronDownIcon
                  className={`${styles.weHelpChevron} ${servicesMegaOpen ? styles.weHelpChevronOpen : ""}`}
                  aria-hidden
                />
              </button>
            </div>
            <div className={styles.navCenter}>
              <div className={styles.dropdown} onMouseLeave={() => setAboutOpen(false)}>
                <button
                  type="button"
                  className={styles.dropBtn}
                  aria-expanded={aboutOpen}
                onClick={() => {
                  setServicesMegaOpen(false);
                  setInfoOpen(false);
                  setAboutOpen((v) => !v);
                }}
                >
                  <span>{t("header.navAbout")}</span>
                  <ChevronDownIcon
                    className={`${styles.dropBtnChevron} ${aboutOpen ? styles.dropBtnChevronOpen : ""}`}
                    aria-hidden
                  />
                </button>
                {aboutOpen ? (
                  <div className={styles.dropPanel}>
                    {ABOUT_NAV_ITEMS.map((l) => (
                      <Link
                        key={l.to}
                        to={l.to}
                        onClick={() => {
                          setAboutOpen(false);
                          setMenuOpen(false);
                        }}
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
              <NavLink to="/uslugi" onClick={() => setMenuOpen(false)}>
                {t("header.navServices")}
              </NavLink>
              <NavLink to="/ceny" onClick={() => setMenuOpen(false)}>
                {t("header.navPrices")}
              </NavLink>
              <NavLink to="/akcii" onClick={() => setMenuOpen(false)}>
                {t("header.navPromos")}
              </NavLink>
              <div className={styles.dropdown} onMouseLeave={() => setInfoOpen(false)}>
                <button
                  type="button"
                  className={`${styles.dropBtn} ${infoNavActive ? styles.dropBtnActive : ""}`}
                  aria-expanded={infoOpen}
                  aria-controls="header-info-panel"
                  id="header-info-trigger"
                  onClick={() => {
                    setServicesMegaOpen(false);
                    setAboutOpen(false);
                    setInfoOpen((v) => !v);
                  }}
                >
                  <span>{t("header.navBlog")}</span>
                  <ChevronDownIcon
                    className={`${styles.dropBtnChevron} ${infoOpen ? styles.dropBtnChevronOpen : ""}`}
                    aria-hidden
                  />
                </button>
                {infoOpen ? (
                  <div id="header-info-panel" className={`${styles.dropPanel} ${styles.infoDropPanel}`} role="menu">
                    <Link
                      role="menuitem"
                      to="/novosti"
                      onClick={() => {
                        setInfoOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      {t("header.infoArticlesLink")}
                    </Link>
                    <Link
                      role="menuitem"
                      to="/faq"
                      onClick={() => {
                        setInfoOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      {t("footer.columnInfoLinks.faq")}
                    </Link>
                  </div>
                ) : null}
              </div>
              <NavLink to="/kontakty" onClick={() => setMenuOpen(false)}>
                {t("header.navContacts")}
              </NavLink>
            </div>
            <div className={styles.navRight}>
              <HeaderSiteSearch services={services} onNavigate={() => setMenuOpen(false)} />
              <Button
                className={styles.ctaMob}
                variant="primary"
                size="sm"
                type="button"
                onClick={() => {
                  openModal();
                  setMenuOpen(false);
                }}
              >
                {t("header.ctaConsultationMob")}
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <ServicesMegaMenuModal
        open={servicesMegaOpen}
        onClose={() => setServicesMegaOpen(false)}
        services={services}
      />
      <CityPickerModal open={cityOpen} onClose={() => setCityOpen(false)} />
    </header>
  );
}
