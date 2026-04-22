import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-header.component.html'
})
export class DashboardHeaderComponent implements OnDestroy {

  @Input() pageTitle: string = 'Portfolio';

  notifications: any[] = [];
  notificationsOpen = false;
  private notificationTimer: any;
  private currentNotificationIds: string[] = [];

  constructor(private auth: AuthService) {}

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
      // Opening the dropdown
      this.auth.getCustomerNotifications(customerId).subscribe({
        next: (res: any) => {
          this.notifications = Array.isArray(res) ? res : [];
          this.currentNotificationIds = this.notifications.map(n => n.id);
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
        },
        error: () => {
          // If marking as read fails, keep them
        }
      });
    }
  }

  ngOnDestroy() {
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