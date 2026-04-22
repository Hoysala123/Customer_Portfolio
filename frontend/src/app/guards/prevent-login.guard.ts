import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const preventLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Block login ONLY if user is already authenticated
  if (token && role) {
    console.log('Prevent Login Guard - User already authenticated. Role:', role);
    
    // Redirect to appropriate dashboard based on role
    switch(role) {
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
        localStorage.clear();
        return true;
    }
  }

  // Allow login page access if not authenticated
  return true;
};