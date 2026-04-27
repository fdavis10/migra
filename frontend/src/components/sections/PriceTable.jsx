import { useTranslation } from '@/i18n/useTranslation'
import { formatRub } from '@/utils/money'
import styles from './PriceTable.module.css'

function cellPrice(row, t) {
  if (row.price_display) return row.price_display
  if (row.price_from != null) {
    const from = formatRub(row.price_from)
    if (row.price_to != null) return `${from}${t('common.rangeSep')}${formatRub(row.price_to)}`
    return `${t('common.priceFrom')} ${from}`
  }
  return t('priceTable.na')
}

export function PriceTable({ category }) {
  const { t } = useTranslation()
  if (!category?.items?.length) return null
  return (
    <div className="tableWrap">
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t('priceTable.service')}</th>
            <th>{t('priceTable.cost')}</th>
            <th>{t('priceTable.term')}</th>
          </tr>
        </thead>
        <tbody>
          {category.items.map((row) => (
            <tr key={row.id}>
              <td>{row.title}</td>
              <td>{cellPrice(row, t)}</td>
              <td>{row.duration || t('priceTable.na')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
