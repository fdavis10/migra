import { formatRub } from '@/utils/money'
import styles from './PriceTable.module.css'

function cellPrice(row) {
  if (row.price_display) return row.price_display
  if (row.price_from != null) {
    const from = formatRub(row.price_from)
    if (row.price_to != null) return `${from} — ${formatRub(row.price_to)}`
    return `от ${from}`
  }
  return '—'
}

export function PriceTable({ category }) {
  if (!category?.items?.length) return null
  return (
    <div className="tableWrap">
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Услуга</th>
            <th>Стоимость</th>
            <th>Срок</th>
          </tr>
        </thead>
        <tbody>
          {category.items.map((row) => (
            <tr key={row.id}>
              <td>{row.title}</td>
              <td>{cellPrice(row)}</td>
              <td>{row.duration || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
