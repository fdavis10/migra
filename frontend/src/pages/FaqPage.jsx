import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { getFAQ } from '@/api/faq'
import { Accordion } from '@/components/sections/Accordion'
import { Skeleton } from '@/components/ui/Skeleton'
import { useTranslation } from '@/i18n/useTranslation'
import { unwrapList } from '@/utils/apiList'
import styles from './FaqPage.module.css'

export function FaqPage() {
  const { t } = useTranslation()
  const [cats, setCats] = useState(null)
  useEffect(() => {
    let c = false
    ;(async () => {
      try {
        const data = await getFAQ()
        if (!c) setCats(unwrapList(data))
      } catch {
        if (!c) setCats([])
      }
    })()
    return () => {
      c = true
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>{t('faqPage.title')}</title>
        <meta name="description" content={t('faqPage.metaDesc')} />
      </Helmet>
      <div className="section">
        <div className="container">
          <h1 className={styles.h1}>{t('faqPage.h1')}</h1>
          {cats === null ? (
            <Skeleton style={{ height: 300 }} />
          ) : (
            <section className={styles.block}>
              <Accordion
                items={cats.flatMap((cat) =>
                  (cat.items || []).map((i) => ({ q: i.question, a: i.answer })),
                )}
              />
            </section>
          )}
        </div>
      </div>
    </>
  )
}
