import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoggerService } from '../services/logger.service';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const logger = inject(LoggerService);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username') || 'Unknown';

  logger.info(`Admin Guard Check - Token: ${!!token}, Role: ${role}, Attempting to access: ${state.url}`);

  if (token && role === 'Admin') {
    logger.info(`Admin Guard - Access GRANTED for user: ${username}`);
    return true;
  }

  logger.warn(`Admin Guard - Access DENIED. Clearing session and redirecting to login for user: ${username}`);
  
  // Clear invalid session
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('id');
  localStorage.removeItem('username');
  
  return router.createUrlTree(['/login']);
};
