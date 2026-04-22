import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from '../layout/admin-layout.component';
import { AdminApiService } from '../api/admin-api.service';

@Component({
  selector: 'app-admin-notification',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent],
  templateUrl: './admin-notification.component.html'
})

export class AdminNotificationComponent implements OnInit {

  kycRequests?: {
    id: string;
    customerName: string;
    phone: string;
    email: string;
    status: string;
  }[];

  loading = false;
  errorMessage: string | null = null;

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadKycRequests();
  }

  loadKycRequests(): void {
    this.loading = true;
    this.errorMessage = null;
    
    this.adminApi.getKycRequests().subscribe({
      next: data => {
        console.log('KYC Requests loaded:', data);
        this.kycRequests = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading KYC requests:', err);
        this.errorMessage = `Error loading KYC requests: ${err.message || 'Unknown error'}`;
        this.loading = false;
      }
    });
  }

  approveKyc(kycRequestId: string): void {
    if (!confirm('Are you sure you want to approve this KYC request?')) {
      return;
    }

    this.loading = true;
    this.adminApi.approveKyc(kycRequestId).subscribe({
      next: (response) => {
        console.log('KYC approved response:', response);
        this.loading = false;
        alert(response?.message || 'KYC approved successfully');
        this.loadKycRequests(); // Reload the list
      },
      error: (err) => {
        this.loading = false;
        console.error('Full error object:', err);
        console.error('Error response:', err.error);
        
        let errorMsg = 'Error approving KYC';
        
        if (err.error?.message) {
          errorMsg = err.error.message;
        } else if (err.error) {
          errorMsg = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
        } else if (err.message) {
          errorMsg = err.message;
        }
        
        this.errorMessage = errorMsg;
        console.error('Error approving KYC:', errorMsg);
      }
    });
  }

  declineKyc(kycRequestId: string): void {
    const reason = prompt('Enter reason for declining KYC (optional):');
    if (reason === null) {
      return; // User clicked cancel
    }

    this.loading = true;
    this.adminApi.declineKyc(kycRequestId).subscribe({
      next: (response) => {
        console.log('KYC declined response:', response);
        this.loading = false;
        alert(response?.message || 'KYC declined successfully');
        this.loadKycRequests(); // Reload the list
      },
      error: (err) => {
        this.loading = false;
        console.error('Full error object:', err);
        console.error('Error response:', err.error);
        
        let errorMsg = 'Error declining KYC';
        
        if (err.error?.message) {
          errorMsg = err.error.message;
        } else if (err.error) {
          errorMsg = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
        } else if (err.message) {
          errorMsg = err.message;
        }
        
        this.errorMessage = errorMsg;
        console.error('Error declining KYC:', errorMsg);
      }
    });
  }

}
