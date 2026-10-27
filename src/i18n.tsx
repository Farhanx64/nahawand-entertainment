import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { languageForPath, pathForLanguage, type Lang } from "./language.ts";

export type { Lang } from "./language.ts";
export type L = { en: string; ar: string };

type Ctx = { lang: Lang; dir: "ltr" | "rtl"; t: (x: L) => string; localizePath: (path: string) => string; path: string };

const Context = createContext<Ctx>({
  lang: "en", dir: "ltr", t: (x) => x.en, localizePath: (path) => path, path: "/",
});

export function LangProvider({ children, path = "/" }: { children: ReactNode; path?: string }) {
  const lang = languageForPath(path);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang, dir: lang === "ar" ? "rtl" : "ltr", t: (x) => x[lang] || x.en,
      localizePath: (target) => pathForLanguage(target, lang), path,
    }),
    [lang, path],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useLang = () => useContext(Context);

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, path } = useLang();
  return (
    <a
      href={pathForLanguage(path.replace(/\/*$/, "/"), lang === "en" ? "ar" : "en")}
      hrefLang={lang === "en" ? "ar" : "en"}
      onClick={(event) => {
        // Keep in-page anchors when switching without depending on browser state during SSR.
        event.currentTarget.hash = window.location.hash;
        event.currentTarget.search = window.location.search;
      }}
      aria-label={lang === "en" ? "التبديل إلى العربية" : "Switch to English"}
      className={`px-3 py-1.5 border border-gold/40 text-gold hover:bg-gold hover:text-black transition-colors text-xs font-semibold ${className}`}
    >
      {lang === "en" ? "عربي" : "EN"}
    </a>
  );
}
