import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {
  private idleTimeout = 2 * 60 * 1000; // 2 minutes for testing (change to 15 * 60 * 1000 for production)
  private warningTime = 30 * 1000; // 30 seconds before logout (1:30 into idle)
  private idleTimer: any;
  private warningTimer: any;
  private isWarningShown = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  /**
   * Start idle timeout monitoring
   */
  startMonitoring(): void {
    // Only monitor if user is logged in
    if (!this.authService.isLoggedIn()) {
      return;
    }

    // Listen for user activity inside Angular zone to avoid change detection issues
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('click', () => this.resetIdleTimer());
      document.addEventListener('keypress', () => this.resetIdleTimer());
      document.addEventListener('mousemove', () => this.resetIdleTimer());
      document.addEventListener('scroll', () => this.resetIdleTimer());
      document.addEventListener('touchstart', () => this.resetIdleTimer());
    });

    // Start the idle timer
    this.resetIdleTimer();
  }

  /**
   * Stop monitoring and clear timers
   */
  stopMonitoring(): void {
    this.clearTimers();
  }

  /**
   * Reset the idle timer on user activity
   */
  private resetIdleTimer(): void {
    // Clear existing timers
    this.clearTimers();
    this.isWarningShown = false;

    // Set warning timer
    this.warningTimer = setTimeout(() => {
      if (!this.isWarningShown) {
        this.isWarningShown = true;
        console.warn('Session will expire due to inactivity in 2 minutes');
        // Optional: Show a warning toast/snackbar to user
      }
    }, this.idleTimeout - this.warningTime);

    // Set logout timer
    this.idleTimer = setTimeout(() => {
      this.ngZone.run(() => {
        console.warn('Session expired due to inactivity. Logging out...');
        this.logout();
      });
    }, this.idleTimeout);
  }

  /**
   * Clear all timers
   */
  private clearTimers(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
  }

  /**
   * Perform logout and redirect
   */
  private logout(): void {
    this.clearTimers();
    this.authService.logout();
    this.router.navigate(['/login']).catch(err => console.error('Navigation error:', err));
  }

  /**
   * Set custom idle timeout (in milliseconds)
   */
  setIdleTimeout(timeoutMs: number): void {
    this.idleTimeout = timeoutMs;
    this.warningTime = Math.min(2 * 60 * 1000, timeoutMs / 2);
    this.resetIdleTimer();
  }

  /**
   * Get remaining idle time (in milliseconds)
   */
  getRemainingTime(): number {
    if (!this.idleTimer) {
      return 0;
    }
    // This is approximate since we can't directly query setTimeout
    return this.idleTimeout;
  }
}
