import { useLocale } from '@/context/LanguageContext'
import { useTranslation } from '@/i18n/useTranslation'
import { formatRub } from '@/utils/money'
import styles from './PriceTable.module.css'

function cellPrice(row, t, locale) {
  if (row.price_display) return row.price_display
  if (row.price_from != null) {
    const from = formatRub(row.price_from, locale)
    if (row.price_to != null) return `${from}${t('common.rangeSep')}${formatRub(row.price_to, locale)}`
    return `${t('common.priceFrom')} ${from}`
  }
  return t('priceTable.na')
}

export function PriceTable({ category }) {
  const { locale } = useLocale()
  const { t } = useTranslation()
  if (!category?.items?.length) return null
  return (
    <div className="tableWrap">
      <table className={styles.table}>
        <colgroup>
          <col className={styles.colService} />
          <col className={styles.colCost} />
          <col className={styles.colTerm} />
        </colgroup>
        <thead>
          <tr>
            <th className={styles.thService}>{t('priceTable.service')}</th>
            <th className={styles.thCost}>{t('priceTable.cost')}</th>
            <th className={styles.thTerm}>{t('priceTable.term')}</th>
          </tr>
        </thead>
        <tbody>
          {category.items.map((row) => (
            <tr key={row.id}>
              <td className={styles.tdService}>{row.title}</td>
              <td className={styles.tdCost}>{cellPrice(row, t, locale)}</td>
              <td className={styles.tdTerm}>{row.duration || t('priceTable.na')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
