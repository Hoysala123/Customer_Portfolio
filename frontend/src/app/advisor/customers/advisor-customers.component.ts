import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdvisorLayoutComponent } from '../layout/advisor-layout.component';
import { AdvisorApiService } from '../api/advisor-api.service';

@Component({
  selector: 'app-advisor-customers',
  standalone: true,
  imports: [CommonModule, AdvisorLayoutComponent],
  templateUrl: './advisor-customers.component.html'
})
export class AdvisorCustomersComponent implements OnInit {

  customers: {
    id: string;
    name: string;
    username: string;
    email: string;
    phone: string;
    assets: string;
    liabilities: string;
    risk: 'High' | 'Medium' | 'Low';
    kycStatus: string;
    alert: boolean;
    portfolioCreated: boolean;
  }[] = [];

  loading = false;

  constructor(
    private router: Router,
    private advisorApi: AdvisorApiService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.advisorApi.getAssignedCustomers().subscribe({
      next: data => {
        this.customers = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading advisor customers:', err);
        this.loading = false;
      }
    });
  }

  setRiskLevel(customerId: string, riskLevel: 'High' | 'Medium' | 'Low') {
    this.advisorApi.setCustomerRisk(customerId, riskLevel)
      .subscribe({
        next: () => this.loadCustomers(),
        error: err => console.error('Error setting customer risk:', err)
      });
  }

  sendAlert(customerId: string) {
    this.advisorApi.sendCustomerAlert(customerId)
      .subscribe({
        next: () => alert('Alert sent to customer.'),
        error: err => console.error('Error sending alert:', err)
      });
  }

  openPortfolio(customerId: string) {
    this.router.navigate(['/advisor/portfolio', customerId]);
  }

  downloadReport(customerId: string) {
    this.advisorApi.downloadCustomerReport(customerId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `customer-report-${customerId}.csv`;
        anchor.click();
        window.URL.revokeObjectURL(url);
      },
      error: err => console.error('Error downloading report:', err)
    });
  }
}