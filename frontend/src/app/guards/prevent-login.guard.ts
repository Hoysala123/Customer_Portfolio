import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const preventLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const role = authService.getCurrentUserRole();

  if (authService.isLoggedIn() && role) {
    console.log('Prevent Login Guard - User already authenticated. Role:', role);

    switch (role) {
      case 'Admin':
        console.log('Redirecting Admin to admin-dashboard');
        return router.createUrlTree(['/admin-dashboard']);
      case 'Advisor':
        console.log('Redirecting Advisor to advisor/dashboard');
        return router.createUrlTree(['/advisor/dashboard']);
      case 'Customer':
        console.log('Redirecting Customer to dashboard');
        return router.createUrlTree(['/dashboard']);
      default:
        console.log('Unknown role, clearing session');
        authService.logout();
        return true;
    }
  }

  return true;
};