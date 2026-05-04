import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const role = authService.getCurrentUserRole();

  console.log('Admin Guard - Role:', role, 'Attempting to access:', state.url);

  if (authService.isLoggedIn() && role === 'Admin') {
    console.log('Admin Guard - Access GRANTED');
    return true;
  }

  console.log('Admin Guard - Access DENIED. Clearing session and redirecting to login.');
  authService.logout();
  return router.createUrlTree(['/login']);
};
