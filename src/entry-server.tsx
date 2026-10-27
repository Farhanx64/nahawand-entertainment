import { renderToString } from 'react-dom/server';
import { ROUTES } from './routes.tsx';
import { LangProvider } from './i18n.tsx';
import { PAGES } from './seo.ts';

export { PAGES };
export const render = (path: string) => {
  const Page = ROUTES[path];
  return renderToString(<LangProvider path={path}><Page /></LangProvider>);
};
