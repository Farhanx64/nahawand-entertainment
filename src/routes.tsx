import type { ComponentType } from 'react';
import App from './App.tsx';
import Weddings from './Weddings.tsx';
import {Worcester, Boston} from './Area.tsx';

// Pages that are pre-rendered at build time. Keep in sync with PAGES in seo.ts.
export const ROUTES: Record<string, ComponentType> = {
  '/': App,
  '/weddings/': Weddings,
  '/areas/worcester/': Worcester,
  '/areas/boston/': Boston,
};

for (const [path, Page] of Object.entries(ROUTES)) ROUTES[`/ar${path}`] = Page;

export const routeFor = (pathname: string) => ROUTES[pathname.replace(/\/*$/, '/')] ?? App;
