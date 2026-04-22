import { CanActivateFn } from '@angular/router';

/**
 * Root guard - ensures that when user visits root path (/),
 * they always see a fresh login page without being redirected
 * to a cached session dashboard
 */
export const rootGuard: CanActivateFn = (route, state) => {
  console.log('Root Guard - Clearing any cached session and showing fresh login');
  
  // Clear any cached session data to ensure fresh login experience
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('id');
  localStorage.removeItem('kycStatus');
  
  // Allow access to the LoginComponent
  return true;
};
