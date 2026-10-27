// Runs after `vite build` and `vite build --ssr`: bakes each page's HTML and <head> into dist/ so crawlers
// see the content without running JavaScript. Pages come from PAGES in src/seo.ts.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const SITE = 'https://nahawand.org';
const { render, PAGES } = await import(pathToFileURL(new URL('../dist-ssr/entry-server.js', import.meta.url).pathname));
const template = readFileSync('dist/index.html', 'utf8');
const marker = '<div id="root"></div>';
if (!template.includes(marker)) throw new Error('root marker not found in dist/index.html');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const jsonLd = (items) => items.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n    ');

function withHead(html, { path, title, description, ld }) {
  const isArabic = path.startsWith("/ar/");
  const enPath = isArabic ? path.slice(3) : path;
  const alternates = [
    ["en", enPath], ["ar", `/ar${enPath}`], ["x-default", enPath],
  ].map(([lang, target]) => `<link rel="alternate" hreflang="${lang}" href="${SITE}${target}" />`).join("\n    ");
  const url = `${SITE}${path}`;
  let out = html
    .replace(/<html[^>]*>/, `<html lang="${isArabic ? "ar" : "en"}" dir="${isArabic ? "rtl" : "ltr"}">`)
    .replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, '');
  out = out.replace('</head>', `  ${alternates}\n  </head>`);
  if (ld.length) out = out.replace('</head>', `  ${jsonLd(ld)}\n  </head>`);
  return out;
}

for (const page of PAGES) {
  const html = withHead(template.replace(marker, `<div id="root">${render(page.path)}</div>`), {
    path: page.path,
    title: page.title,
    description: page.description,
    ld: page.jsonLd,
  });
  if (page.path === '/') {
    writeFileSync('dist/index.html', html);
  } else {
    mkdirSync(`dist${page.path}`, { recursive: true });
    writeFileSync(`dist${page.path}index.html`, html);
  }
}

for (const prefix of ['', '/ar']) {
  mkdirSync(`dist${prefix}/reviews`, { recursive: true });
  writeFileSync(
    `dist${prefix}/reviews/index.html`,
    withHead(template, {
      path: `${prefix}/reviews/`,
      title: prefix ? 'التقييمات | نهاوند' : 'Reviews | Nahawand Entertainment',
      description: prefix ? 'آراء جمهور نهاوند وتجاربهم مع الموسيقى العربية الحيّة للأعراس والحفلات في نيو إنجلاند. شاركونا تجربتكم.' :
        'Read and share reviews of Nahawand Entertainment, live Arabic and oriental music for weddings and celebrations in New England.',
      ld: [],
    }),
  );

}

rmSync('dist-ssr', { recursive: true, force: true });
console.log(`prerendered ${PAGES.map((p) => p.path).join(', ')} and the English/Arabic reviews shells`);
