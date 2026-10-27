// Run after npm run build: protects the bilingual HTML that search crawlers receive.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const site = 'https://nahawand.org';
const bases = ['/', '/weddings/', '/areas/worcester/', '/areas/boston/'];
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const schemas = (html) => [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)]
  .map((match) => JSON.parse(match[1]));

for (const base of bases) {
  const english = readFileSync(`dist${base}index.html`, 'utf8');
  for (const prefix of ['', '/ar']) {
    const path = prefix + base;
    const html = readFileSync(`dist${path}index.html`, 'utf8');
    assert(html.includes(`<html lang="${prefix ? 'ar' : 'en'}" dir="${prefix ? 'rtl' : 'ltr'}">`), `${path}: document language`);
    assert(html.includes(`<link rel="canonical" href="${site}${path}"`), `${path}: canonical`);
    assert(sitemap.includes(`<loc>${site}${path}</loc>`), `${path}: sitemap`);
    for (const [lang, target] of [['en', base], ['ar', `/ar${base}`], ['x-default', base]]) {
      assert(html.includes(`hreflang="${lang}" href="${site}${target}"`), `${path}: ${lang} alternate`);
    }
    const ld = schemas(html);
    assert(ld.length, `${path}: structured data`);
    assert(html.includes('<h1'), `${path}: server-rendered heading`);
    assert(html.includes(`href="${prefix ? '' : '/ar'}${base}" hrefLang="${prefix ? 'en' : 'ar'}"`), `${path}: language link`);
    if (prefix) {
      const arabic = /[\u0600-\u06ff]/;
      assert(arabic.test(html.match(/<title>(.*?)<\/title>/)[1]), `${path}: Arabic title`);
      assert(arabic.test(html.match(/<meta name="description" content="([^"]*)"/)[1]), `${path}: Arabic description`);
      assert(arabic.test(html.match(/<h1[\s\S]*?<\/h1>/)[0]), `${path}: Arabic SSR heading`);
      assert(arabic.test(ld[0].name), `${path}: Arabic schema name`);
      assert(arabic.test(ld[0].description), `${path}: Arabic schema description`);
      assert.deepEqual(ld[0].areaServed, schemas(english)[0].areaServed, `${path}: unchanged service areas`);
      assert(html.includes('href="/ar/weddings/"'), `${path}: localized footer`);
    }
    console.log(`PASS ${path}`);
  }
}
