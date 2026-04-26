import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import styles from './SitemapPage.module.css'

const LINKS = [
  ['/', 'Главная'],
  ['/o-kompanii', 'О нас'],
  ['/o-kompanii/osnovatel', 'Основатель'],
  ['/o-kompanii/preimushchestva', 'Преимущества'],
  ['/o-kompanii/oplata', 'Оплата'],
  ['/uslugi', 'Услуги'],
  ['/ceny', 'Цены'],
  ['/akcii', 'Акции'],
  ['/garantii', 'Гарантии'],
  ['/otzyvy', 'Отзывы'],
  ['/novosti', 'Новости'],
  ['/faq', 'Вопросы и ответы'],
  ['/kontakty', 'Контакты'],
  ['/privacy', 'Политика конфиденциальности'],
]

export function SitemapPage() {
  return (
    <>
      <Helmet>
        <title>Карта сайта — РЕЗИДЕНТ</title>
      </Helmet>
      <div className="section">
        <div className="container">
          <h1 className={styles.h1}>Карта сайта</h1>
          <ul className={styles.list}>
            {LINKS.map(([to, label]) => (
              <li key={to}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
