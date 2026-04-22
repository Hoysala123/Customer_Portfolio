import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const advisorAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  console.log('Advisor Guard - Token:', !!token, 'Role:', role, 'Attempting to access:', state.url);

  if (token && role === 'Advisor') {
    console.log('Advisor Guard - Access GRANTED');
    return true;
  }

  console.log('Advisor Guard - Access DENIED. Clearing session and redirecting to login.');
  // Clear invalid session
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('id');
  return router.createUrlTree(['/login']);
};
