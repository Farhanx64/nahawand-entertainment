export type Lang = "en" | "ar";

export const languageForPath = (path: string): Lang =>
  path === "/ar" || path.startsWith("/ar/") ? "ar" : "en";

export const englishPath = (path: string) =>
  languageForPath(path) === "ar" ? path.slice(3) || "/" : path;

// Preserve fragments and query strings; external links and contact URIs are untouched.
export function pathForLanguage(path: string, lang: Lang) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const base = englishPath(path);
  if (base.startsWith("/reviews/admin")) return base;
  return lang === "ar" ? `/ar${base}` : base;
}
