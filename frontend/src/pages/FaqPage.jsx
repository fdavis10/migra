import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { getFAQ } from '@/api/faq'
import { Accordion } from '@/components/sections/Accordion'
import { Skeleton } from '@/components/ui/Skeleton'
import { unwrapList } from '@/utils/apiList'
import styles from './FaqPage.module.css'

export function FaqPage() {
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
        <title>Вопросы и ответы — РЕЗИДЕНТ</title>
        <meta name="description" content="Ответы на частые вопросы о РВП, ВНЖ, гражданстве и документах." />
      </Helmet>
      <div className="section">
        <div className="container">
          <h1 className={styles.h1}>Вопросы и ответы</h1>
          {cats === null ? (
            <Skeleton style={{ height: 300 }} />
          ) : (
            cats.map((cat) => (
              <section key={cat.id} className={styles.block}>
                <h2 className={styles.cat}>{cat.title}</h2>
                <Accordion items={(cat.items || []).map((i) => ({ q: i.question, a: i.answer }))} />
              </section>
            ))
          )}
        </div>
      </div>
    </>
  )
}
