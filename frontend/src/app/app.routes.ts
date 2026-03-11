import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '',          loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'search',   loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent) },
  { path: 'topic/:slug', loadComponent: () => import('./pages/topic-detail/topic-detail.component').then(m => m.TopicDetailComponent) },
  { path: 'categories', loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent) },
  { path: 'about',     loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: '**',        loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
