import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";
export type L = { en: string; ar: string };

type Ctx = { lang: Lang; dir: "ltr" | "rtl"; setLang: (l: Lang) => void; t: (x: L) => string };

// The default value is the English site, so pre-rendering works without a provider.
const Context = createContext<Ctx>({ lang: "en", dir: "ltr", setLang: () => {}, t: (x) => x.en });

const TITLES: L = {
  en: "Nahawand Entertainment | Live Arabic & Oriental Music for Weddings in New England",
  ar: "نهاوند للموسيقى والحفلات | موسيقى عربية وشرقية حيّة للأعراس في نيو إنجلاند",
};

export function LangProvider({ children }: { children: ReactNode }) {
  // Always start in English so the first client render matches the pre-rendered HTML.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      if (localStorage.getItem("lang") === "ar") setLangState("ar");
    } catch { /* storage unavailable */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    if (!window.location.pathname.startsWith("/reviews")) document.title = TITLES[lang];
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch { /* ignore */ }
  }, []);

  const value = useMemo<Ctx>(
    () => ({ lang, dir: lang === "ar" ? "rtl" : "ltr", setLang, t: (x) => x[lang] }),
    [lang, setLang],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useLang = () => useContext(Context);

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "en" ? "ar" : "en")}
      aria-label={lang === "en" ? "التبديل إلى العربية" : "Switch to English"}
      className={`px-3 py-1.5 border border-gold/40 text-gold hover:bg-gold hover:text-black transition-colors text-xs font-semibold ${className}`}
    >
      {lang === "en" ? "عربي" : "EN"}
    </button>
  );
}
