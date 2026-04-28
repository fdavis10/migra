import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { GlobeAltIcon, LanguageIcon } from "@heroicons/react/24/outline";
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
import { Button } from "../ui/Button.jsx";
import styles from "./Header.module.css";

export function Header({ site }) {
  const { openModal } = useLeadModal();
  const { city } = useCity();
  const { locale, setLocale } = useLocale();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const localeBarRef = useRef(null);

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

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
            <img src="/logo.png" width={2083} height={2083} alt={t("header.logoAlt")} />
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
              <LanguageIcon className={styles.langIcon} aria-hidden />
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
          <address className={styles.officeAddress}>
            <span className={styles.officeAddressLine}>{t("headerAddress.line1")}</span>
            <span className={styles.officeAddressLine}>{t("headerAddress.line2")}</span>
          </address>
        </div>

        <div className={styles.contacts}>
          <div className={styles.contactsRow}>
            <a className={styles.phone} href={`tel:${String(phone).replace(/\s/g, "")}`}>
              {phone}
            </a>
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
        <div className={`container ${styles.nav}`}>
          <div className={styles.dropdown} onMouseLeave={() => setAboutOpen(false)}>
            <button
              type="button"
              className={styles.dropBtn}
              aria-expanded={aboutOpen}
              onClick={() => setAboutOpen((v) => !v)}
            >
              {t("header.navAbout")}
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
          <NavLink to="/novosti" onClick={() => setMenuOpen(false)}>
            {t("header.navBlog")}
          </NavLink>
          <NavLink to="/faq" onClick={() => setMenuOpen(false)}>
            {t("header.navFaq")}
          </NavLink>
          <NavLink to="/kontakty" onClick={() => setMenuOpen(false)}>
            {t("header.navContacts")}
          </NavLink>
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
      </nav>
      <CityPickerModal open={cityOpen} onClose={() => setCityOpen(false)} />
    </header>
  );
}
