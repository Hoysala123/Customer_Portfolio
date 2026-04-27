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

  loadPortfolioPerformance(): void {
    this.advisorApi.getPortfolioPerformance().subscribe({
      next: (response: any) => {

        // ✅ IMPORTANT: reset previous data to avoid duplication
        this.barChartData.datasets = [];
        this.barChartData.labels = [];

        let monthlyData: string[] = [];
        let datasets: any[] = [];

        if (Array.isArray(response)) {
          monthlyData = response.map((d: any) => d.month);
          datasets = [{
            label: 'Total Assets',
            data: response.map((d: any) => d.value),
            backgroundColor: '#3b82f6',
            borderColor: '#2563eb',
            borderWidth: 1
          }];
        } else if (response?.months && response?.datasets) {
          monthlyData = response.months;

          // ✅ ensure no duplicate labels
          const seen = new Set<string>();

          datasets = response.datasets
            .filter((ds: any) => {
              if (seen.has(ds.label)) {
                return false;
              }
              seen.add(ds.label);
              return true;
            })
            .map((ds: any, idx: number) => ({
              label: ds.label,
              data: ds.data,
              backgroundColor: this.getChartColor(idx),
              borderColor: this.getChartBorderColor(idx),
              borderWidth: 1
            }));
        } else {
          monthlyData = ['Jan', 'Feb', 'Mar'];
          datasets = [{
            label: 'Total Assets',
            data: [0, 0, 0],
            backgroundColor: '#3b82f6',
            borderColor: '#2563eb',
            borderWidth: 1
          }];
        }

        this.barChartData = {
          labels: [...monthlyData],
          datasets: [...datasets]
        };
      },
      error: err => {
        console.error('Error loading portfolio performance:', err);
        this.barChartData = {
          labels: ['Jan', 'Feb', 'Mar'],
          datasets: [{
            label: 'Total Assets',
            data: [0, 0, 0],
            backgroundColor: '#3b82f6',
            borderColor: '#2563eb',
            borderWidth: 1
          }]
        };
      }
    });
  }

  private getChartColor(index: number): string {
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    return colors[index % colors.length];
  }

  private getChartBorderColor(index: number): string {
    const colors = ['#1d4ed8', '#be123c', '#059669', '#d97706', '#6d28d9', '#be185d'];
    return colors[index % colors.length];
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
}
