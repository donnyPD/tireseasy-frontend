import { lazy } from 'react';

export const Product = lazy(() => import('./Product'));

export const Category = lazy(() => import('./Category'));

export const Search = lazy(() => import('./Search'));

