import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  console.log('Admin Guard - Token:', !!token, 'Role:', role, 'Attempting to access:', state.url);

  if (token && role === 'Admin') {
    console.log('Admin Guard - Access GRANTED');
    return true;
  }

  console.log('Admin Guard - Access DENIED. Clearing session and redirecting to login.');
  // Clear invalid session
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('id');
  return router.createUrlTree(['/login']);
};
