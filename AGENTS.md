# Nahawand Entertainment

Marketing site for a live oriental music act (New England). Vite + React 19 + Tailwind 4 + `motion`, served by a Cloudflare Worker with static assets and a D1 database for reviews. Live at https://nahawand.org.

## Commands
- `npm run dev`: local dev server (port 3000)
- `npm run build`: client build, SSR build, then `scripts/prerender.mjs` bakes the home page HTML into `dist/index.html` (crawlers need it) and writes `dist/reviews/index.html`
- `npx tsc --noEmit`: type check
- `npx wrangler deploy`: deploy to the client's Cloudflare account (id pinned in `wrangler.jsonc`; `wrangler login` must include it)

## Conventions and gotchas
- No router: `src/main.tsx` picks `Reviews` when the path starts with `/reviews`, otherwise hydrates `App`. Anything in `App` runs at build time too, so guard `window`/`document` use inside effects or handlers.
- Pass `key` on custom components via `<React.Fragment key=…>`; plain `key` errors in this TS setup.
- Reviews API lives in `worker/index.ts` (`/api/reviews`, `/api/admin/reviews`). New reviews start unapproved. The `ADMIN_KEY` secret is set on the Worker, not in the repo.
- Sliders use `AutoScroller`, which keeps its own float position because iOS Safari truncates fractional `scrollLeft`.
- Avoid slide-up scroll-in animations on Services; they flickered. Fade only.
- Instagram photos are self-hosted in `public/posts/`; captions are hand-written in `INSTAGRAM_POSTS`.
- SEO lives in `index.html` (title, description, canonical, JSON-LD), `public/robots.txt`, `public/sitemap.xml`, and `public/_headers` (noindex on `/reviews/admin`).
- `git push` of large images may need `git -c http.postBuffer=524288000 push`.
