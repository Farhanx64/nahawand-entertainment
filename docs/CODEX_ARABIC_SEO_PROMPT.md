# Codex prompt: Arabic side of the SEO plan

Paste this into Codex, run from `~/orca/ahmad`.

---

Read `AGENTS.md`, `docs/SEO_KEYWORD_PLAN.md` (sections 2, 3, 6 and 7), `HANDOFF.md` and `ARABIC_COPY_REVIEW.md` first.

The English side of the SEO plan is done: the homepage copy and head, a new `/weddings/` page (`src/Weddings.tsx`), general Worcester and Boston pages at `/areas/worcester/` and `/areas/boston/` (`src/Area.tsx`; they deliberately name no venues, and coverage wording is "contact us"), per-page head data in `src/seo.ts`, the page registry in `src/routes.tsx`, and a prerender script (`scripts/prerender.mjs`) that writes each page to `dist/`. Your job is the Arabic side. Do not change the English copy or the layout, and do not deploy.

## 1. Fill the missing Arabic strings
New English strings were added with `ar: ""` on purpose. `t()` falls back to English when `ar` is empty. Find every `ar: ""` (search `ar: ""` in `src/App.tsx` and `src/Weddings.tsx`) and write natural, professional Arabic for each:
- the homepage About intro paragraph
- the "Learn more" link on the Weddings card, and the footer links
- everything on the `/weddings/` page and the two area pages in `src/Area.tsx`: headings, cards, FAQ, call to action. For the area pages use the plan's Arabic location phrasing (for example فرقة أعراس عربية في وستر / بوسطن); keep them general, with no venue names, no performance claims, and no promises about travel coverage

Follow the same rules as `HANDOFF.md`: natural Levantine-friendly wording, not a literal translation. Use the plan's Arabic terms where they read naturally (فرقة موسيقية عربية للأعراس، زفة عروسين، موسيقى عربية حية للأعراس، ولاية مين for Maine). Do not stuff keywords or repeat the keyword bank. Do not claim a nationality or specialty, and do not mention services we don't offer (see plan section 4).

## 2. Give Arabic its own crawlable URLs (plan section 7.1)
Right now Arabic only exists behind a client-side toggle that reads localStorage, so crawlers never see it. Implement:
- Prerendered Arabic pages at `/ar/`, `/ar/weddings/`, `/ar/areas/worcester/` and `/ar/areas/boston/`, with `<html lang="ar" dir="rtl">` already in the prerendered HTML (the SSR output must be Arabic, not English that flips after load).
- `LangProvider` in `src/i18n.tsx` takes its starting language from the URL path (`/ar/...` is Arabic, everything else English), not from localStorage. The language toggle becomes a normal link between the two versions of the same page. Remove the localStorage-based switching, since it breaks hydration for the Arabic pages.
- In `src/seo.ts`, add Arabic entries with their own Arabic `title`, `description` and JSON-LD (Arabic `name`/`description`, same `areaServed`). Use the plan's examples as a starting point: title `نهاوند | فرقة موسيقية عربية للأعراس في نيو إنجلاند`, heading `فرقة موسيقية عربية للأعراس والحفلات في نيو إنجلاند`.
- Every English and Arabic page gets a self-referencing canonical and reciprocal `hreflang` links (`en`, `ar`, and `x-default` pointing at the English page). Update `scripts/prerender.mjs` to write these into each page's head.
- Add the Arabic pages to `public/sitemap.xml`. Make nav, footer and in-page links stay inside the current language (for example `/ar/#contact`, `/ar/weddings/`).
- `/reviews/` can stay as is for now, but its toggle should not break.

Keep the router approach (no router library): extend `ROUTES` and `PAGES` and keep the Cloudflare static-assets setup working (`wrangler.jsonc` serves `dist/`; check that `/ar/` and `/ar/weddings/` resolve to the prerendered files and that unknown paths still fall back as before).

## 3. Verify
1. `npx tsc --noEmit`
2. `npm run build`, then open `dist/ar/index.html`, `dist/ar/weddings/index.html` and the two `dist/ar/areas/*/index.html` files and confirm Arabic text, `lang="ar" dir="rtl"`, Arabic title and description, the canonical, and the `hreflang` links are in the HTML source.
3. `npx vite preview --port 4173`, open `/`, `/ar/`, `/weddings/`, `/ar/weddings/` and the area pages in both languages and check the toggle, layout in RTL, no console hydration errors, and no overflow. The phone numbers, email and Instagram handle must stay left-to-right (`<bdi dir="ltr">`).

When done, list the strings you wrote, anything you were unsure about, and the files you changed. Do not commit or deploy.
