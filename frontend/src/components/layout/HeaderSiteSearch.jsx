import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { getFAQ } from "@/api/faq";
import { getNews } from "@/api/news";
import { getPromotions } from "@/api/promos";
import { useTranslation } from "@/i18n/useTranslation";
import { unwrapList } from "@/utils/apiList";
import styles from "./HeaderSiteSearch.module.css";

function stripHtml(html) {
  if (!html || typeof html !== "string") return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .trim();
}

function hayIncludes(haystack, q) {
  const h = norm(haystack);
  const n = norm(q);
  if (!n) return false;
  return h.includes(n);
}

async function fetchAllNews() {
  const all = [];
  let page = 1;
  const maxPages = 25;
  while (page <= maxPages) {
    const data = await getNews(page);
    const rows = unwrapList(data);
    all.push(...rows);
    if (!data?.next || rows.length === 0) break;
    page += 1;
  }
  return all;
}

function buildStaticPages(t) {
  return [
    { path: "/", title: t("sitemapPage.linkHome"), haystack: `${t("sitemapPage.linkHome")} resident` },
    { path: "/uslugi", title: t("header.navServices"), haystack: t("header.navServices") },
    { path: "/ceny", title: t("header.navPrices"), haystack: t("header.navPrices") },
    { path: "/akcii", title: t("header.navPromos"), haystack: t("header.navPromos") },
    {
      path: "/novosti",
      title: t("footer.columnInfoLinks.usefulArticles"),
      haystack: `${t("footer.columnInfoLinks.usefulArticles")} ${t("header.navBlog")}`,
    },
    {
      path: "/faq",
      title: t("footer.columnInfoLinks.faq"),
      haystack: `${t("footer.columnInfoLinks.faq")} ${t("header.navFaq")}`,
    },
    { path: "/kontakty", title: t("header.navContacts"), haystack: t("header.navContacts") },
    { path: "/privacy", title: t("footer.privacy"), haystack: t("footer.privacy") },
    { path: "/sitemap", title: t("footer.sitemapLink"), haystack: t("footer.sitemapLink") },
    { path: "/o-kompanii", title: t("sitemapPage.linkAbout"), haystack: t("sitemapPage.linkAbout") },
    { path: "/o-kompanii/osnovatel", title: t("sitemapPage.linkFounder"), haystack: t("sitemapPage.linkFounder") },
    { path: "/o-kompanii/preimushchestva", title: t("sitemapPage.linkAdv"), haystack: t("sitemapPage.linkAdv") },
    { path: "/garantii", title: t("sitemapPage.linkGuarantees"), haystack: t("sitemapPage.linkGuarantees") },
    { path: "/otzyvy", title: t("sitemapPage.linkReviews"), haystack: t("sitemapPage.linkReviews") },
    { path: "/o-kompanii/oplata", title: t("sitemapPage.linkPay"), haystack: t("sitemapPage.linkPay") },
  ];
}

export function HeaderSiteSearch({ services = [], onNavigate }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [remote, setRemote] = useState({ news: [], faq: [], promos: [] });
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [news, faq, promoRes] = await Promise.all([fetchAllNews(), getFAQ(), getPromotions()]);
        if (cancelled) return;
        setRemote({
          news,
          faq: Array.isArray(faq) ? faq : [],
          promos: unwrapList(promoRes),
        });
      } catch {
        if (!cancelled) setRemote({ news: [], faq: [], promos: [] });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const index = useMemo(() => {
    const items = [];
    const typePage = t("siteSearch.typePage");
    const typeService = t("siteSearch.typeService");
    const typeNews = t("siteSearch.typeNews");
    const typeFaq = t("siteSearch.typeFaq");
    const typePromo = t("siteSearch.typePromo");

    for (const p of buildStaticPages(t)) {
      items.push({
        id: `p-${p.path}`,
        path: p.path,
        title: p.title,
        haystack: `${p.title} ${p.path} ${p.haystack || ""}`,
        type: typePage,
      });
    }

    for (const s of services) {
      items.push({
        id: `s-${s.slug}`,
        path: `/uslugi/${s.slug}`,
        title: s.title,
        haystack: `${s.title} ${s.short_desc || ""} ${s.slug}`,
        type: typeService,
      });
    }

    for (const n of remote.news) {
      if (!n?.slug) continue;
      items.push({
        id: `n-${n.slug}`,
        path: `/novosti/${n.slug}`,
        title: n.title,
        haystack: `${n.title} ${n.slug} ${stripHtml(n.excerpt || "")} ${n.category || ""}`,
        type: typeNews,
      });
    }

    for (const cat of remote.faq) {
      for (const it of cat.items || []) {
        items.push({
          id: `f-${it.id}`,
          path: "/faq",
          title: it.question,
          haystack: `${cat.title} ${it.question} ${stripHtml(it.answer)}`,
          type: typeFaq,
        });
      }
    }

    for (const p of remote.promos) {
      items.push({
        id: `pr-${p.id}`,
        path: `/akcii/${p.id}`,
        title: p.title,
        haystack: `${p.title} ${p.description || ""} ${p.discount || ""}`,
        type: typePromo,
      });
    }

    return items;
  }, [services, remote, t]);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return index.filter((it) => hayIncludes(it.haystack, q));
  }, [index, query]);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) close();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, close]);

  const goFirst = useCallback(() => {
    const q = query.trim();
    if (!q) return;
    const list = index.filter((it) => hayIncludes(it.haystack, q));
    if (!list.length) return;
    navigate(list[0].path);
    setQuery("");
    close();
    onNavigate?.();
  }, [query, index, navigate, close, onNavigate]);

  const onPick = useCallback(() => {
    setQuery("");
    close();
    onNavigate?.();
  }, [close, onNavigate]);

  const showPanel = open && query.trim().length > 0;

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <form
        className={styles.pill}
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          goFirst();
        }}
      >
        <input
          ref={inputRef}
          type="search"
          className={styles.input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={t("siteSearch.placeholder")}
          aria-label={t("siteSearch.placeholder")}
          autoComplete="off"
          spellCheck="false"
        />
        <button type="submit" className={styles.iconBtn} aria-label={t("siteSearch.submitAria")}>
          <MagnifyingGlassIcon className={styles.icon} aria-hidden />
        </button>
      </form>
      {showPanel ? (
        <div className={styles.panel} role="listbox" aria-label={t("siteSearch.resultsAria")}>
          {results.length === 0 ? (
            <p className={styles.empty}>{t("siteSearch.noResults")}</p>
          ) : (
            results.slice(0, 50).map((it) => (
              <Link key={it.id} to={it.path} className={styles.row} role="option" onClick={onPick}>
                <span className={styles.rowTitle}>{it.title}</span>
                <span className={styles.rowMeta}>{it.type}</span>
              </Link>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
