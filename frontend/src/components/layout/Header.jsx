import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ABOUT_NAV_ITEMS } from "@/content/aboutNav";
import { useLeadModal } from "../../context/LeadModalContext.jsx";
import { Button } from "../ui/Button.jsx";
import styles from "./Header.module.css";

export function Header({ site }) {
  const { openModal } = useLeadModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const phone = site?.phone || "+7 (495) 000-00-00";

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <img src="/logo.png" width={2083} height={2083} alt="РЕЗИДЕНТ — миграционный сервис" />
        </Link>

        <div className={styles.contacts}>
          <a className={styles.phone} href={`tel:${String(phone).replace(/\s/g, "")}`}>
            {phone}
          </a>
          <div className={styles.messengers}>
            {site?.whatsapp_url ? (
              <a href={site.whatsapp_url} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            ) : null}
            {site?.telegram_url ? (
              <a href={site.telegram_url} target="_blank" rel="noreferrer">
                Telegram
              </a>
            ) : null}
          </div>
        </div>

        <Button className={styles.ctaDesk} variant="primary" size="md" type="button" onClick={() => openModal()}>
          Бесплатная консультация
        </Button>

        <button
          type="button"
          className={styles.burger}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="visuallyHidden">Меню</span>
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
              О компании ▾
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
            Услуги
          </NavLink>
          <NavLink to="/ceny" onClick={() => setMenuOpen(false)}>
            Цены
          </NavLink>
          <NavLink to="/akcii" onClick={() => setMenuOpen(false)}>
            Акции
          </NavLink>
          <NavLink to="/novosti" onClick={() => setMenuOpen(false)}>
            Блог
          </NavLink>
          <NavLink to="/faq" onClick={() => setMenuOpen(false)}>
            FAQ
          </NavLink>
          <NavLink to="/kontakty" onClick={() => setMenuOpen(false)}>
            Контакты
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
            Консультация
          </Button>
        </div>
      </nav>
    </header>
  );
}
