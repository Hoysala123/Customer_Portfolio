import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { AdminLayoutComponent } from '../layout/admin-layout.component';
import { AdminApiService } from '../api/admin-api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent, BaseChartDirective],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {

  // Correct default
  selectedAdvisorId: string = '';

  advisors: { id: string; name: string }[] = [];

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Loading...'],
    datasets: [
      {
        label: 'Portfolio Performance',
        data: [0],
        backgroundColor: '#3b82f6',
        borderColor: '#1e40af',
        borderWidth: 1
      }
    ]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true }
    }
  };

  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Bonds', 'Fixed Deposits', 'Loans'],
    datasets: []
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };

  summary?: {
    totalUsers: number;
    totalCustomers: number;
    totalAssets: number;
    activeAlerts: number;
  };

  portfolioData?: any[];
  assetAllocation?: any[];
  auditLogs: any[] = [];
  customerReports?: any[];

  constructor(
    private adminApi: AdminApiService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('AdminDashboardComponent initialized');
    this.loadAdvisors();
    this.loadDashboardSummary();
    this.loadCustomerReports();
    this.loadAuditLogs();
    this.loadPortfolioPerformance();
    this.loadAssetAllocation();
  }

  loadAdvisors(): void {
    this.adminApi.getAdvisors().subscribe({
      next: data => {
        this.advisors = data.map(a => ({
          id: a.id,
          name: a.name
        }));
      }
    });
  }

  //FIXED: no arguments passed
  loadDashboardSummary(): void {
    console.log('Loading dashboard summary...');
    this.adminApi.getDashboardSummary().subscribe({
      next: data => {
        console.log('Dashboard summary data received:', data);
        this.summary = data;
      },
      error: err => console.error('Error loading dashboard summary:', err)
    });
  }

  //FIXED: no arguments passed
  loadCustomerReports(): void {
    console.log('Loading customer reports...');
    this.adminApi.getCustomerReports().subscribe({
      next: data => {
        console.log('Customer reports data received:', data);
        this.customerReports = Array.isArray(data) ? this.normalizeCustomerReports(data) : [];
        console.log('Normalized customer reports:', this.customerReports);
      },
      error: err => {
        console.error('Error loading customer reports:', err);
        this.customerReports = [];
      }
    });
  }

  private normalizeCustomerReports(data: any[]): any[] {
    return data.map(report => ({
      id: report.id || report.Id,
      name: report.name || report.Name || '',
      email: report.email || report.Email || '',
      phone: report.phone || report.Phone || '',
      advisor: report.advisor || report.Advisor || '',
      kycStatus: report.kycStatus || report.KycStatus || '',
      risk: report.risk || report.Risk || '',
      totalAssets: report.totalAssets ?? report.TotalAssets ?? 0,
      totalLiabilities: report.totalLiabilities ?? report.TotalLiabilities ?? 0,
      netWorth: report.netWorth ?? report.NetWorth ?? 0
    }));
  }

  loadAuditLogs(): void {
    this.adminApi.getAuditLogs().subscribe({
      next: data => this.auditLogs = data
    });
  }

  //These APIs ALREADY accept advisorId → leave untouched
  loadPortfolioPerformance(): void {
    this.adminApi
      .getPortfolioPerformance(this.selectedAdvisorId)
      .subscribe({
        next: data => {
          console.log('Portfolio Performance data received:', data);
          this.portfolioData = data;
          this.updateBarChart(data);
        },
        error: err => {
          console.error('Error loading portfolio performance:', err);
          this.updateBarChart([]);
        }
      });
  }

  loadAssetAllocation(): void {
    this.adminApi
      .getAssetAllocation(this.selectedAdvisorId)
      .subscribe({
        next: data => this.updatePieChart(data)
      });
  }

  private updateBarChart(data: any[]): void {
  console.log('updateBarChart called with:', data);

  if (!data) {
    console.log('Data is null/undefined');
    return;
  }

  if (data.length === 0) {
    console.log('No data received from API - showing empty chart');
    this.barChartData = {
      labels: ['No Data'],
      datasets: [
        {
          label: 'Portfolio Assets',
          data: [0],
          backgroundColor: '#3b82f6',
          borderColor: '#1e40af',
          borderWidth: 1
        }
      ]
    };
    this.cdr.detectChanges();
    return;
  }

  console.log('Updating bar chart with data:', data);

  // ✅ Extract all labels and only assets values (excluding liabilities)
  const labels = data.map(d => d.month || d.name);
  const values = data.map(d => d.value ?? 0);

  console.log('Bar chart labels:', labels);
  console.log('Bar chart values:', values);

  this.barChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Portfolio Assets',
        data: values,
        backgroundColor: '#3b82f6',
        borderColor: '#1e40af',
        borderWidth: 1
      }
    ]
  };

  this.cdr.detectChanges();
}

  private updatePieChart(data: any[]): void {
    this.pieChartData = {
      labels: data.map(d => d.label),
      datasets: [
        {
          data: data.map(d => d.percentage),
          backgroundColor: ['#60a5fa', '#34d399', '#fbbf24']
        }
      ]
    };
  }

  //Safe reload
  onAdvisorChange(): void {
    this.loadPortfolioPerformance();
    this.loadAssetAllocation();
  }

  goToNotifications(): void {
    this.router.navigate(['/admin/notification']);
  }
}
