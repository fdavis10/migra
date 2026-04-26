import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { PanelLayout } from '@/panel/PanelLayout'
import { PanelLoginPage } from '@/panel/PanelLoginPage'
import { PanelDashboard } from '@/panel/PanelDashboard'
import { PanelLeadsPage } from '@/panel/PanelLeadsPage'
import { PanelNewsListPage } from '@/panel/PanelNewsListPage'
import { PanelNewsEditPage } from '@/panel/PanelNewsEditPage'
import { PanelSitePage } from '@/panel/PanelSitePage'
import { HomePage } from '@/pages/HomePage'
import { ServicesPage } from '@/pages/ServicesPage'
import { ServiceDetailPage } from '@/pages/ServiceDetailPage'
import { PricesPage } from '@/pages/PricesPage'
import { AboutUsPage } from '@/pages/AboutUsPage'
import { AboutFounderPage } from '@/pages/AboutFounderPage'
import { AboutAdvantagesPage } from '@/pages/AboutAdvantagesPage'
import { AboutPaymentPage } from '@/pages/AboutPaymentPage'
import { PromotionsPage } from '@/pages/PromotionsPage'
import { GuaranteesPage } from '@/pages/GuaranteesPage'
import { ReviewsPage } from '@/pages/ReviewsPage'
import { NewsPage } from '@/pages/NewsPage'
import { NewsDetailPage } from '@/pages/NewsDetailPage'
import { FaqPage } from '@/pages/FaqPage'
import { ContactsPage } from '@/pages/ContactsPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { SitemapPage } from '@/pages/SitemapPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/panel/login" element={<PanelLoginPage />} />
      <Route path="/panel" element={<PanelLayout />}>
        <Route index element={<PanelDashboard />} />
        <Route path="leads" element={<PanelLeadsPage />} />
        <Route path="news" element={<PanelNewsListPage />} />
        <Route path="news/:id" element={<PanelNewsEditPage />} />
        <Route path="site" element={<PanelSitePage />} />
      </Route>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/uslugi" element={<ServicesPage />} />
        <Route path="/uslugi/:slug" element={<ServiceDetailPage />} />
        <Route path="/ceny" element={<PricesPage />} />
        <Route path="/o-kompanii/osnovatel" element={<AboutFounderPage />} />
        <Route path="/o-kompanii/preimushchestva" element={<AboutAdvantagesPage />} />
        <Route path="/o-kompanii/oplata" element={<AboutPaymentPage />} />
        <Route path="/o-kompanii" element={<AboutUsPage />} />
        <Route path="/akcii" element={<PromotionsPage />} />
        <Route path="/garantii" element={<GuaranteesPage />} />
        <Route path="/otzyvy" element={<ReviewsPage />} />
        <Route path="/novosti" element={<NewsPage />} />
        <Route path="/novosti/:slug" element={<NewsDetailPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/kontakty" element={<ContactsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/sitemap" element={<SitemapPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
