import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    // 1. La ruta de 'Login'
    // Carga el módulo de autenticación cuando alguien visite '/login'
    path: 'login',
    loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)
  },
  {
    // 2. La ruta de 'Admin'
    // Carga el módulo de admin cuando alguien visite '/admin'
    path: 'admin',
    loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule)
    // Más adelante, aquí añadiremos el 'AdminGuard' para proteger esta ruta
  },
  {
    // 3. La ruta de la Tienda (raíz)
    // Carga el módulo de la tienda cuando alguien visite la raíz ('/')
    path: '',
    loadChildren: () => import('./store/store-module').then(m => m.StoreModule)
  },
  {
    // 4. El "Catch-all"
    // Si el usuario va a cualquier otra ruta, lo redirige a la raíz
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];