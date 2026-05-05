import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdvisorLayoutComponent } from '../layout/advisor-layout.component';
import { AdvisorApiService } from '../api/advisor-api.service';
 
@Component({
  selector: 'app-advisor-dashboard',
  standalone: true,
  imports: [CommonModule, AdvisorLayoutComponent],
  templateUrl: './advisor-dashboard.component.html'
})
export class AdvisorDashboardComponent implements OnInit {
 
  summary = {
    totalCustomers: 0,
    totalAssets: '0',
    riskAlerts: 0
  };
 
  auditLogs: any[] = [];
 
  customersWithoutPortfolio: any[] = [];
 
  customers: any[] = [];
 
  constructor(private router: Router, private advisorApi: AdvisorApiService) {}
 
  ngOnInit() {
    this.loadSummary();
    this.loadAuditLogs();
    this.loadCustomersWithoutPortfolio();
    this.loadCustomers();
  }
 
  loadSummary() {
    this.advisorApi.getDashboardSummary().subscribe({
      next: data => {
        console.log('Dashboard Summary Data:', data);
        this.summary = {
          totalCustomers: data.totalCustomers || 0,
          totalAssets: data.totalAssets?.toString() || '0',
          riskAlerts: data.riskAlerts || 0
        };
        console.log('Summary Updated:', this.summary);
      },
      error: err => {
        console.error('Error loading summary:', err);
      }
    });
  }

 
  loadAuditLogs() {
    this.advisorApi.getAuditLogs().subscribe({
      next: data => {
        this.auditLogs = data;
      },
      error: err => console.error('Error loading audit logs:', err)
    });
  }
 
  loadCustomersWithoutPortfolio() {
    this.advisorApi.getCustomersWithoutPortfolio().subscribe({
      next: data => {
        this.customersWithoutPortfolio = data;
      },
      error: err => console.error('Error loading customers without portfolio:', err)
    });
  }
 
  loadCustomers() {
    this.advisorApi.getAssignedCustomers().subscribe({
      next: data => {
        this.customers = data;
      },
      error: err => console.error('Error loading customers:', err)
    });
  }
 
  goToPortfolioBuilder(customerId: string) {
    this.router.navigate(['/advisor/portfolio', customerId]);
  }
}
 
 