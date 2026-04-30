import { Link } from "react-router-dom";
import { ServiceIcon } from "@/components/illustrations/ServiceIcon";
import { Modal } from "@/components/ui/Modal";
import { useTranslation } from "@/i18n/useTranslation";
import styles from "./ServicesMegaMenuModal.module.css";

function sortServices(list) {
  return [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || (a.id ?? 0) - (b.id ?? 0));
}

export function ServicesMegaMenuModal({ open, onClose, services }) {
  const { t } = useTranslation();
  const sorted = sortServices(Array.isArray(services) ? services : []);
  const mid = Math.ceil(sorted.length / 2) || 0;
  const left = sorted.slice(0, mid);
  const right = sorted.slice(mid);

  return (
    <Modal
      open={open}
      onClose={onClose}
      mega
      ariaLabel={t("header.servicesMegaOpenAria")}
    >
      {!sorted.length ? (
        <p className={styles.empty}>
          <Link to="/uslugi" onClick={onClose}>
            {t("footer.allServices")}
          </Link>
        </p>
      ) : (
        <div className={styles.grid}>
          <ul className={styles.col}>
            {left.map((s) => (
              <li key={s.slug}>
                <Link to={`/uslugi/${s.slug}`} className={styles.row} onClick={onClose}>
                  <ServiceIcon name={s.icon} className={styles.icon} compact />
                  <span className={styles.title}>{s.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className={styles.col}>
            {right.map((s) => (
              <li key={s.slug}>
                <Link to={`/uslugi/${s.slug}`} className={styles.row} onClick={onClose}>
                  <ServiceIcon name={s.icon} className={styles.icon} compact />
                  <span className={styles.title}>{s.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
}
