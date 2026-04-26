import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getSiteContact } from "../../api/site.js";
import { getServices } from "../../api/services.js";
import { Header } from "./Header.jsx";
import { Footer } from "./Footer.jsx";
import { ScrollToTop } from "./ScrollToTop.jsx";
import { CookieBanner } from "./CookieBanner.jsx";
import { GlobalLeadModal } from "./GlobalLeadModal.jsx";
import { SpecialistChat } from "./SpecialistChat.jsx";

export function Layout() {
  const [site, setSite] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, svc] = await Promise.all([getSiteContact(), getServices()]);
        if (!cancelled) {
          setSite(s || {});
          setServices(Array.isArray(svc) ? svc : []);
        }
      } catch {
        if (!cancelled) {
          setSite({});
          setServices([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      <Header site={site} />
      <main>
        <Outlet context={{ site, services }} />
      </main>
      <Footer site={site} services={services} />
      <CookieBanner />
      <GlobalLeadModal />
      <SpecialistChat />
    </>
  );
}
