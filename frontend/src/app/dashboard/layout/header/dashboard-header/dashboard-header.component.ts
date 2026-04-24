import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-header.component.html'
})
export class DashboardHeaderComponent implements OnInit, OnDestroy {

  @Input() pageTitle: string = 'Portfolio';

  notifications: any[] = [];
  notificationsOpen = false;
  unreadNotificationCount = 0;
  private notificationTimer: any;
  private currentNotificationIds: string[] = [];
  private destroy$ = new Subject<void>();
  private pollingInterval = 5000; // 5 seconds

  constructor(private auth: AuthService) {}

  ngOnInit() {
    // Start polling for notifications every 5 seconds
    const customerId = localStorage.getItem('id');
    if (customerId) {
      this.startNotificationPolling(customerId);
    }
  }

  private startNotificationPolling(customerId: string) {
    interval(this.pollingInterval)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fetchNotificationsInBackground(customerId);
      });
    
    // Also fetch immediately on startup
    this.fetchNotificationsInBackground(customerId);
  }

  private fetchNotificationsInBackground(customerId: string) {
    this.auth.getCustomerNotifications(customerId).subscribe({
      next: (res: any) => {
        const newNotifications = Array.isArray(res) ? res : [];
        // Only update unread count if NOT currently viewing the notifications panel
        if (!this.notificationsOpen) {
          this.unreadNotificationCount = newNotifications.length;
        } else {
          // If panel is open, sync the data
          this.notifications = newNotifications;
        }
      },
      error: () => {
        // Handle error silently, keep polling
      }
    });
  }

  // ⭐ ADDED Method — fetch and display KYC status
  checkKycStatus() {
    this.auth.getKycStatus().subscribe({
      next: (res: any) => {
        alert(`Your KYC Status is: ${res.status}`);
      },
      error: () => {
        alert("Unable to fetch KYC Status");
      }
    });
  }

  toggleNotifications() {
    const wasOpen = this.notificationsOpen;
    this.notificationsOpen = !this.notificationsOpen;

    // Clear any existing timer
    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
    }

    const customerId = localStorage.getItem('id');
    if (!customerId) {
      return;
    }

    if (this.notificationsOpen) {
      // Opening the dropdown - fetch fresh notifications
      this.auth.getCustomerNotifications(customerId).subscribe({
        next: (res: any) => {
          this.notifications = Array.isArray(res) ? res : [];
          this.currentNotificationIds = this.notifications.map(n => n.id);
          this.unreadNotificationCount = 0; // Clear badge when opened
        },
        error: () => {
          this.notifications = [];
          this.currentNotificationIds = [];
        }
      });

      // Auto-close after 10 seconds
      this.notificationTimer = setTimeout(() => {
        this.notificationsOpen = false;
        // Mark as read when auto-closing
        this.markCurrentNotificationsAsRead(customerId);
      }, 10000);
    } else {
      // Closing the dropdown manually
      this.markCurrentNotificationsAsRead(customerId);
    }
  }

  private markCurrentNotificationsAsRead(customerId: string) {
    if (this.currentNotificationIds.length > 0) {
      this.auth.markNotificationsAsRead(customerId, this.currentNotificationIds).subscribe({
        next: () => {
          // Clear the current notifications since they're now read
          this.notifications = [];
          this.currentNotificationIds = [];
          this.unreadNotificationCount = 0;
        },
        error: () => {
          // If marking as read fails, keep them
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
    }
    // Mark any current notifications as read when component is destroyed
    const customerId = localStorage.getItem('id');
    if (customerId && this.currentNotificationIds.length > 0) {
      this.markCurrentNotificationsAsRead(customerId);
    }
  }
}