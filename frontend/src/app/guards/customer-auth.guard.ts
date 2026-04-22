import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const customerAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  console.log('Customer Guard - Token:', !!token, 'Role:', role, 'Attempting to access:', state.url);

  if (token && role === 'Customer') {
    console.log('Customer Guard - Access GRANTED');
    return true;
  }

  console.log('Customer Guard - Access DENIED. Clearing session and redirecting to login.');
  // Clear invalid session
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('id');
  return router.createUrlTree(['/login']);
};