import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Revisa si está autenticado Y si el rol es 'ADMIN'
  if (authService.isAuthenticated() && authService.getUserRole() === 'ADMIN') {
    return true; // Si es admin, lo dejamos pasar 
  }

  // Si no es admin, lo echamos al login por pao
  router.navigate(['/']);
  return false;
};