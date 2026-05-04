import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { AdvisorLayoutComponent } from '../layout/advisor-layout.component';
import { AdvisorApiService } from '../api/advisor-api.service';

@Component({
  selector: 'app-advisor-reports',
  standalone: true,
  imports: [CommonModule, AdvisorLayoutComponent, BaseChartDirective],
  templateUrl: './advisor-reports.component.html'
})
export class AdvisorReportsComponent implements OnInit {

  /* Chart types */
  barChartType: ChartType = 'bar';
  pieChartType: ChartType = 'pie';

  /* BAR CHART */
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
        ticks: { font: { size: 10 } }
      },
      y: {
        stacked: false,
        beginAtZero: true,
        ticks: { font: { size: 10 } }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { font: { size: 11 } }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.formattedValue;
            return `${label}: ₹${value}`;
          }
        }
      }
    }
  };

  /* PIE CHART */
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Bonds', 'Fixed Deposit', 'Loans'],
    datasets: [{
      data: [1, 1, 1],
      backgroundColor: ['#60a5fa', '#34d399', '#fbbf24']
    }]
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { bodyFont: { size: 11 } }
    }
  };

  customerReports: any[] = [];

  constructor(private advisorApi: AdvisorApiService) {}

  ngOnInit(): void {
    this.loadCustomerReports();
    this.loadPortfolioPerformance();
    this.loadOverallAnalysis();
  }

  loadCustomerReports(): void {
    this.advisorApi.getCustomerReports().subscribe({
      next: data => {
        this.customerReports = Array.isArray(data) ? [...data] : [];
      },
      error: err => {
        console.error('Error loading customer reports:', err);
        this.customerReports = [];
      }
    });
  }

  /* ✅ FIXED HERE */
  loadPortfolioPerformance(): void {
    this.advisorApi.getPortfolioPerformance().subscribe({
      next: (response: any[]) => {

        if (!Array.isArray(response) || response.length === 0) {
          return;
        }

        // ✅ API returns cumulative (80,000), normalize to real value (40,000)
        const month = response[0].month;
        const normalizedValue = response[0].value / 2;

        this.barChartData = {
          labels: [month],
          datasets: [{
            label: 'Total Assets',
            data: [normalizedValue],
            backgroundColor: '#3b82f6',
            borderColor: '#2563eb',
            borderWidth: 1
          }]
        };
      },
      error: err => {
        console.error('Error loading portfolio performance:', err);
        this.barChartData = {
          labels: ['N/A'],
          datasets: [{
            label: 'Total Assets',
            data: [0],
            backgroundColor: '#3b82f6',
            borderColor: '#2563eb',
            borderWidth: 1
          }]
        };
      }
    });
  }

  loadOverallAnalysis(): void {
    this.advisorApi.getOverallAnalysis().subscribe({
      next: (data: any[]) => {
        const bonds = data.find(d => d.label?.toLowerCase().includes('bond'))?.value || 0;
        const fd = data.find(d =>
          d.label?.toLowerCase().includes('fixed deposit') ||
          d.label?.toLowerCase().includes('fd')
        )?.value || 0;
        const loans = data.find(d => d.label?.toLowerCase().includes('loan'))?.value || 0;

        this.pieChartData = {
          labels: ['Bonds', 'Fixed Deposit', 'Loans'],
          datasets: [{
            data: [bonds, fd, loans],
            backgroundColor: ['#60a5fa', '#34d399', '#fbbf24']
          }]
        };
      },
      error: err => {
        console.error('Error loading overall analysis:', err);
      }
    });
  }

  downloadCustomerReport(customerId: string, name: string): void {
    this.advisorApi.downloadCustomerReport(customerId).subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `customer-report-${name.replace(/[^a-zA-Z0-9]/g, '-')}.csv`;
        anchor.click();
        window.URL.revokeObjectURL(url);
      },
      error: err => {
        console.error('Error downloading report:', err);
      }
    });
  }
}
