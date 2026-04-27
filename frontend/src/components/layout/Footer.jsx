import { Link } from "react-router-dom";
import { useTranslation } from "@/i18n/useTranslation";
import styles from "./Footer.module.css";

export function Footer({ site, services = [] }) {
  const { t } = useTranslation();
  const phone = site?.phone || "";
  const email = site?.email || "";

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <Link to="/" className={styles.logo}>
            <img src="/logo.png" width={2083} height={2083} alt="" />
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
          <div className={styles.social}>
            {site?.telegram_url ? (
              <a href={site.telegram_url} target="_blank" rel="noreferrer">
                Telegram
              </a>
            ) : null}
            {site?.vk_url ? (
              <a href={site.vk_url} target="_blank" rel="noreferrer">
                VK
              </a>
            ) : null}
            {site?.whatsapp_url ? (
              <a href={site.whatsapp_url} target="_blank" rel="noreferrer">
                WhatsApp
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
          <Link to="/novosti">{t("footer.columnInfoLinks.news")}</Link>
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
    </footer>
  );
}
