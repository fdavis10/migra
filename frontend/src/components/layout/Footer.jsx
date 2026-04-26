import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export function Footer({ site, services = [] }) {
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
          <h3 className={styles.h}>О компании</h3>
          <Link to="/o-kompanii">О нас</Link>
          <Link to="/garantii">Гарантии</Link>
          <Link to="/otzyvy">Отзывы</Link>
          <Link to="/o-kompanii/oplata">Оплата</Link>
        </div>
        <div>
          <h3 className={styles.h}>Услуги</h3>
          {services.slice(0, 10).map((s) => (
            <Link key={s.slug} to={`/uslugi/${s.slug}`}>
              {s.title}
            </Link>
          ))}
          <Link to="/uslugi">Все услуги</Link>
        </div>
        <div>
          <h3 className={styles.h}>Информация</h3>
          <Link to="/novosti">Новости</Link>
          <Link to="/faq">Вопросы и ответы</Link>
          <Link to="/kontakty">Контакты</Link>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <span>© 2026 «РЕЗИДЕНТ»</span>
          <Link to="/privacy">Политика конфиденциальности</Link>
          <Link to="/uslugi">Карта сайта</Link>
        </div>
      </div>
    </footer>
  );
}
