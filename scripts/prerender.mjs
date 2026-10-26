// Runs after `vite build` and `vite build --ssr`: bakes the home page HTML into dist/index.html
// so crawlers see the content without running JavaScript, and writes a separate dist/reviews/index.html.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const { render } = await import(pathToFileURL(new URL('../dist-ssr/entry-server.js', import.meta.url).pathname));
const template = readFileSync('dist/index.html', 'utf8');
const marker = '<div id="root"></div>';
if (!template.includes(marker)) throw new Error('root marker not found in dist/index.html');

writeFileSync('dist/index.html', template.replace(marker, `<div id="root">${render()}</div>`));

const reviews = template
  .replace(/<title>.*?<\/title>/, '<title>Reviews | Nahawand Entertainment</title>')
  .replace(/<meta name="description"[^>]*>/, '<meta name="description" content="Read and share reviews of Nahawand Entertainment, live Arabic and oriental music for weddings and celebrations in New England." />')
  .replace(/<link rel="canonical"[^>]*>/, '<link rel="canonical" href="https://nahawand.org/reviews" />')
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '');
mkdirSync('dist/reviews', { recursive: true });
writeFileSync('dist/reviews/index.html', reviews);

rmSync('dist-ssr', { recursive: true, force: true });
console.log('prerendered dist/index.html and dist/reviews/index.html');
