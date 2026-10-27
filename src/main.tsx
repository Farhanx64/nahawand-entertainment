import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import Reviews from './Reviews.tsx';
import {LangProvider} from './i18n.tsx';
import {englishPath} from './language.ts';
import {ROUTES, routeFor} from './routes.tsx';
import './index.css';

const root = document.getElementById('root')!;

const path = window.location.pathname;

if (englishPath(path).startsWith('/reviews')) {
  // The SPA fallback can serve the pre-rendered home page here (e.g. /reviews/admin)
  root.innerHTML = '';
  createRoot(root).render(<StrictMode><LangProvider path={path}><Reviews /></LangProvider></StrictMode>);
} else {
  const Page = routeFor(window.location.pathname);
  const tree = <StrictMode><LangProvider path={path}><Page /></LangProvider></StrictMode>;
  if (!ROUTES[path.replace(/\/*$/, '/')]) {
    // Unknown paths still show the home page via the assets SPA fallback.
    // Render afresh if that English fallback is opened under an Arabic URL.
    root.innerHTML = '';
    createRoot(root).render(tree);
  } else if (root.hasChildNodes()) hydrateRoot(root, tree);
  else createRoot(root).render(tree);
}
