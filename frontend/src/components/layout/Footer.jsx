import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { GlobeAltIcon, LanguageIcon } from "@heroicons/react/24/outline";
import logoResident from "@assets/image/logo.png";
import logoMax from "@assets/image/logo_max.png";
import logoTelegram from "@assets/image/logo_telegram.png";
import logoWhatsapp from "@assets/image/logo_whatsapp.png";
import { LOCALE_ITEMS } from "@/content/languageOptions";
import { useCity } from "@/context/CityContext";
import { useLocale } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/useTranslation";
import { CityPickerModal } from "./CityPickerModal.jsx";
import styles from "./Footer.module.css";

export function Footer({ site, services = [] }) {
  const { city } = useCity();
  const { locale, setLocale } = useLocale();
  const { t } = useTranslation();
  const [cityOpen, setCityOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const localeBarRef = useRef(null);
  const phone = site?.phone || "";
  const email = site?.email || "";
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
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <Link to="/" className={styles.logo}>
            <img src={logoResident} alt="" decoding="async" />
          </Link>
          {phone ? (
            <p className={styles.line}>
              <a href={`tel:${String(phone).replace(/\s/g, "")}`}>{phone}</a>
            </p>
          ) : null}
          {email ? (
            <p className={styles.line}>
              <a href={`mailto:${email}`}>{email}</a>
            </p>
          ) : null}
          {site?.work_hours ? <p className={styles.muted}>{site.work_hours}</p> : null}
          <div className={styles.localeBar} ref={localeBarRef}>
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
          </div>
          <address className={styles.officeAddress}>
            <span className={styles.officeAddressLine}>{t("headerAddress.line1")}</span>
            <span className={styles.officeAddressLine}>{t("headerAddress.line2")}</span>
          </address>
          <div className={styles.social}>
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
        <div>
          <h3 className={styles.h}>{t("footer.columnAboutTitle")}</h3>
          <Link to="/o-kompanii">{t("footer.columnAboutLinks.about")}</Link>
          <Link to="/garantii">{t("footer.columnAboutLinks.guarantees")}</Link>
          <Link to="/otzyvy">{t("footer.columnAboutLinks.reviews")}</Link>
          <Link to="/o-kompanii/oplata">{t("footer.columnAboutLinks.payment")}</Link>
        </div>
        <div>
          <h3 className={styles.h}>{t("footer.columnServicesTitle")}</h3>
          {services.slice(0, 10).map((s) => (
            <Link key={s.slug} to={`/uslugi/${s.slug}`}>
              {s.title}
            </Link>
          ))}
          <Link to="/uslugi">{t("footer.allServices")}</Link>
        </div>
        <div>
          <h3 className={styles.h}>{t("footer.columnInfoTitle")}</h3>
          <Link to="/novosti">{t("footer.columnInfoLinks.usefulArticles")}</Link>
          <Link to="/faq">{t("footer.columnInfoLinks.faq")}</Link>
          <Link to="/kontakty">{t("footer.columnInfoLinks.contacts")}</Link>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <span>{t("footer.copyright")}</span>
          <Link to="/privacy">{t("footer.privacy")}</Link>
          <Link to="/sitemap">{t("footer.sitemapLink")}</Link>
        </div>
      </div>
      <CityPickerModal open={cityOpen} onClose={() => setCityOpen(false)} />
    </footer>
  );
}
