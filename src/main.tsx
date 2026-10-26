import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import Reviews from './Reviews.tsx';
import {LangProvider} from './i18n.tsx';
import './index.css';

const root = document.getElementById('root')!;

if (window.location.pathname.startsWith('/reviews')) {
  // The SPA fallback can serve the pre-rendered home page here (e.g. /reviews/admin)
  root.innerHTML = '';
  createRoot(root).render(<StrictMode><LangProvider><Reviews /></LangProvider></StrictMode>);
} else if (root.hasChildNodes()) {
  hydrateRoot(root, <StrictMode><LangProvider><App /></LangProvider></StrictMode>);
} else {
  createRoot(root).render(<StrictMode><LangProvider><App /></LangProvider></StrictMode>);
}
