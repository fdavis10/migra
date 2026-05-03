import { useState } from 'react'
import styles from './Accordion.module.css'

export function Accordion({ items }) {
  const [open, setOpen] = useState(null)
  if (!items?.length) return null
  return (
    <ul className={styles.root}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <li key={i} className={styles.item}>
            <button
              type="button"
              className={styles.q}
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              {item.q}
              <span className={styles.chev}>{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen ? <div className={styles.a}>{item.a}</div> : null}
          </li>
        )
      })}
    </ul>
  )
}
