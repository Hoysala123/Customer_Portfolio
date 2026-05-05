import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const advisorAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const role = authService.getCurrentUserRole();

  console.log('Advisor Guard - Role:', role, 'Attempting to access:', state.url);

  if (authService.isLoggedIn() && role === 'Advisor') {
    console.log('Advisor Guard - Access GRANTED');
    return true;
  }

  console.log('Advisor Guard - Access DENIED. Clearing session and redirecting to login.');
  authService.logout();
  return router.createUrlTree(['/login']);
};
