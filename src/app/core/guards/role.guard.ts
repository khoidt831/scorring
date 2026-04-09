import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const RoleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRoles = authService.getRoles();

    if (!Array.isArray(userRoles)) {
      console.error('Roles is not array:', userRoles);
      router.navigate(['/dashboard']);
      return false;
    }
    
    const hasRole = allowedRoles.some(role =>
      userRoles.includes(role)
    );

    if (!hasRole) {
      alert('Không có quyền truy cập');
      router.navigate(['/dashboard']);
      return false;
    }

    return true;
  };
};
