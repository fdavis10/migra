import { getCityGroups } from '@/content/cityOptions.i18n'
import { useCity } from '@/context/CityContext'
import { useLocale } from '@/context/LanguageContext'
import { useTranslation } from '@/i18n/useTranslation'
import { Modal } from '@/components/ui/Modal'
import styles from './CityPickerModal.module.css'

export function CityPickerModal({ open, onClose }) {
  const { city, setCity } = useCity()
  const { locale } = useLocale()
  const { t } = useTranslation()
  const groups = getCityGroups(locale)

  const pick = (name) => {
    setCity(name)
    onClose()
  }

  return (
    <Modal open={open} title={t('cityPicker.title')} onClose={onClose} wide>
      <div className={styles.scroll}>
        {groups.map((group) => (
          <section key={group.title} className={styles.group}>
            <h3 className={styles.groupTitle}>{group.title}</h3>
            <ul className={styles.list}>
              {group.items.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className={item === city ? styles.itemCurrent : styles.item}
                    onClick={() => pick(item)}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Modal>
  )
}
