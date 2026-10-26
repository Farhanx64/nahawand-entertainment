# Handoff: rewrite the Arabic copy

Read `AGENTS.md` first for the repo commands and gotchas.

## Task
The site has an English/Arabic toggle (live at https://nahawand.org). The Arabic was written by Claude, and the owner says it reads badly and no native speaker has checked it. Rewrite all Arabic so it sounds natural and professional, the way a real Arabic-speaking wedding band would write it.

## Audience and tone
- The client is Ahmad, a live oriental/Arabic music act (Nahawand Entertainment) in New England. The audience is Arabic-speaking families booking weddings, engagements and private parties. The Instagram posts mention Syrian and Levantine venues.
- Use clear, warm, natural Arabic that a Levantine speaker would not find stiff. Modern Standard Arabic is fine, but avoid literal word-for-word translation. Rewrite sentences the way an Arabic marketing page would say them.
- Keep the band's own terms natural: darbuka (دربكة), tabl, katem, riq, buzuk, oud, kanun, nay. Check "كاتم" for katem, since the English spelling "katem" was the client's choice and the Arabic word is unverified.
- The brand name in Arabic is "نهاوند". "Entertainment" is currently "للترفيه". Pick whatever reads best.

## Where the Arabic lives
Every string is an inline `{ en: "...", ar: "..." }` object. Edit only the `ar` values unless a rewrite needs a different sentence structure.
- `src/App.tsx`: nav labels, hero, stats, band cards (`BAND`), services (`SERVICES`), why-choose items (`WHY_ITEMS`), gallery, reviews heading, contact form labels and placeholders, footer. Search for `ar:`.
- `src/Reviews.tsx`: the public `/reviews` page and the `EVENT_TYPES` list. `/reviews/admin` stays English.
- `src/i18n.tsx`: the Arabic page title in `TITLES`.
- The hero tagline "Oriental Melodies" is hard-coded as `ألحان شرقية` in `src/App.tsx` (search for `lang === "ar"`), and so is "Why Choose Nahawand" (`لماذا تختار نهاوند`). Review both.
- The pre-rendered HTML and `index.html` are English only. Leave them alone.

## Constraints
- Do not change layout, class names or the English text.
- RTL is handled by `src/i18n.tsx` (sets `dir` and `lang` on `<html>`). In Arabic mode `src/index.css` turns off letter-spacing and italics, so do not add either.
- Phone numbers, the email address and `@nahawand_.entertainment` are wrapped in `<bdi dir="ltr">`. Leave them.
- Keep text lengths close to the English so cards and buttons do not overflow.
- Instagram post captions are English and stay English.

## Verify
1. `npx tsc --noEmit`
2. `npm run build`
3. Run `npx vite preview --port 4173`, open http://localhost:4173, click the "عربي" button in the nav, and scroll the whole page plus `/reviews/`. Look for overflow, clipped text and mixed-direction glitches.

Do not deploy. Report the list of strings you changed and anything you were unsure about, so Ahmad can confirm.

## Known issue (out of scope unless asked)
The booking form on the home page does not send anything. It is the original template with `onSubmit={(e) => e.preventDefault()}`.
