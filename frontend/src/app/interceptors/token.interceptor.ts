import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from '../services/logger.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const logger = inject(LoggerService);
  const router = inject(Router);

  // Attach token to request if available
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    logger.info(`Token attached to request: ${req.method} ${req.url}`);
  } else {
    logger.warn(`No token available for request: ${req.method} ${req.url}`);
  }

  // Intercept response and handle errors
  return next(req).pipe(
    catchError((error: any) => {
      // Log error details
      logger.error(`HTTP Error [${error.status}]: ${error.message}`, error);

      // Handle 401 Unauthorized - Token expired or invalid
      if (error.status === 401) {
        logger.warn('Received 401 Unauthorized - Token may be expired or invalid');
        // Clear session data
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('id');
        localStorage.removeItem('username');
        
        logger.logAuthEvent('Session Invalidated', 'Unknown', 'Session Expired');
        
        // Redirect to login based on role
        const role = localStorage.getItem('role');
        if (role === 'Customer') {
          router.navigate(['/login']);
        } else if (role === 'Admin') {
          router.navigate(['/admin-login']);
        } else if (role === 'Advisor') {
          router.navigate(['/advisor-login']);
        } else {
          router.navigate(['/login']);
        }
      }

      // Handle 403 Forbidden - Access denied
      if (error.status === 403) {
        logger.warn('Received 403 Forbidden - Access denied');
      }

      // Handle server errors
      if (error.status >= 500) {
        logger.error(`Server error [${error.status}]: ${error.error?.message || 'Unknown error'}`);
      }

      return throwError(() => error);
    })
  );
};