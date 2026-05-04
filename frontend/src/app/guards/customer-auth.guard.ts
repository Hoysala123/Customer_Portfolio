import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const customerAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const role = authService.getCurrentUserRole();

  console.log('Customer Guard - Role:', role, 'Attempting to access:', state.url);

  if (authService.isLoggedIn() && role === 'Customer') {
    console.log('Customer Guard - Access GRANTED');
    return true;
  }

  console.log('Customer Guard - Access DENIED. Clearing session and redirecting to login.');
  authService.logout();
  return router.createUrlTree(['/login']);
};