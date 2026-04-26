import { useId, useState } from "react";
import styles from "./Accordion.module.css";

export function Accordion({ items }) {
  const baseId = useId();
  const [open, setOpen] = useState(null);

  return (
    <div className={styles.root}>
      {items.map((item, i) => {
        const id = `${baseId}-${i}`;
        const isOpen = open === i;
        return (
          <div key={item.id ?? i} className={styles.item}>
            <button
              type="button"
              className={styles.trigger}
              aria-expanded={isOpen}
              aria-controls={`${id}-panel`}
              id={`${id}-header`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span>{item.question}</span>
              <span className={styles.chevron} aria-hidden>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen ? (
              <div
                className={styles.panel}
                id={`${id}-panel`}
                role="region"
                aria-labelledby={`${id}-header`}
              >
                {item.answer}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
