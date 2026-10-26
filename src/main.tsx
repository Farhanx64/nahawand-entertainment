import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import Reviews from './Reviews.tsx';
import './index.css';

const root = document.getElementById('root')!;

if (window.location.pathname.startsWith('/reviews')) {
  // The SPA fallback can serve the pre-rendered home page here (e.g. /reviews/admin)
  root.innerHTML = '';
  createRoot(root).render(<StrictMode><Reviews /></StrictMode>);
} else if (root.hasChildNodes()) {
  hydrateRoot(root, <StrictMode><App /></StrictMode>);
} else {
  createRoot(root).render(<StrictMode><App /></StrictMode>);
}
