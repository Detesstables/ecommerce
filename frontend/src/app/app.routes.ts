import { Routes } from '@angular/router';

import { authGuard } from './auth/guards/auth-guard';
import { adminGuard } from './auth/guards/admin-guard';

export const routes: Routes = [
  {
    path: 'auth', 
    loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule),

    canActivate: [adminGuard] // Solo los ADMIN pueden entrar aquí
  },
  {
    path: '',
    loadChildren: () => import('./store/store-module').then(m => m.StoreModule),

  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];