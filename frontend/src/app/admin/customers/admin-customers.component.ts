import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../layout/admin-layout.component';
import { AdminApiService } from '../api/admin-api.service';

interface Advisor {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  templateUrl: './admin-customers.component.html'
})
export class AdminCustomersComponent implements OnInit {

  selectedAdvisorId: string = '';

  advisors: Advisor[] = [];
  allCustomers: any[] = [];
  customers: any[] = [];

  loading = false;

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadAdvisors();
    this.loadCustomers();
  }

  /* -------------------- LOAD DATA -------------------- */

  loadAdvisors(): void {
    this.adminApi.getAdvisors().subscribe({
      next: data => {
        this.advisors = data.map((a: any) => ({
          id: a.id,
          name: a.name,
          email: a.email
        }));
      },
      error: err => console.error('Error loading advisors:', err)
    });
  }

  loadCustomers(): void {
    this.loading = true;
    this.adminApi.getCustomers().subscribe({
      next: data => {
        this.allCustomers = data;
        this.filterCustomers();
        this.loading = false;
      },
      error: err => {
        console.error('Error loading customers:', err);
        this.loading = false;
      }
    });
  }

  /* -------------------- FILTER -------------------- */

  onAdvisorChange(): void {
    this.filterCustomers();
  }

  filterCustomers(): void {
    if (!this.selectedAdvisorId) {
      this.customers = [...this.allCustomers];
      return;
    }

    const advisor = this.advisors.find(
      a => a.id === this.selectedAdvisorId
    );

    if (!advisor) {
      this.customers = [];
      return;
    }

    this.customers = this.allCustomers.filter(
      c => c.advisor === advisor.email
    );
  }

  /* -------------------- HELPERS -------------------- */

  getAdvisorName(customer: any): string {
    const advisor = this.advisors.find(
      a => a.email === customer.advisor
    );
    return advisor ? advisor.name : customer.advisor ?? '—';
  }

  /* -------------------- ACTIONS -------------------- */

  downloadReport(customerId: string): void {
    this.adminApi.downloadCustomerReport(customerId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customer-report-${customerId}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

}
