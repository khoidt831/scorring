import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const RoleGuard = (roles: string[]): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/auth/login']);
  }

  const userRoles = authService.getRoles() || [];

  const hasRole = roles.some(role => userRoles.includes(role));

  return hasRole
    ? true
    : router.createUrlTree(['/dashboard']);
};
