import { useEffect, useState } from "react";
import { useTranslation } from '@/i18n/useTranslation'
import styles from "./CountdownTimer.module.css";

function monthEndDate() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

function pad(n) {
  return String(n).padStart(2, "0");
}

export function CountdownTimer() {
  const { t } = useTranslation()
  const [target] = useState(() => monthEndDate());
  const [left, setLeft] = useState(() => target.getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setLeft(Math.max(0, target.getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  const s = Math.floor(left / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  return (
    <div className={styles.root} role="timer" aria-live="polite">
      <span className={styles.label}>{t('countdownSection.monthEnd')}</span>
      <span className={styles.digits}>
        {days}{t('countdownSection.daySuffix')} {pad(hours)}:{pad(mins)}:{pad(secs)}
      </span>
    </div>
  );
}
