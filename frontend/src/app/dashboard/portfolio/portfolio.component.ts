import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { ReportsService } from '../../services/reports.service';
import { DeviceActivityService } from '../../services/device-activity.service';

/*  Device Activity model (typing only, no logic change) */
interface DeviceActivity {
  action?: string;
  Action?: string;
  status?: string;
  Status?: string;
  timestamp?: string;
  Timestamp?: string;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html'
})
export class PortfolioComponent implements OnInit {

  netWorth: number = 0;

  summary = {
    totalInvestment: 0,
    totalReturns: 0,
    riskLevel: 'Moderate'
  };

  tableData: any[] = [];
  loanData: any[] = [];
  latestRiskAlert: string | null = null;
  riskAlerts: string[] = [];

  /*  FIXED: correct type so template can read properties */
  deviceActivity: DeviceActivity[] = [];

  constructor(
    private portfolioService: PortfolioService,
    private reportsService: ReportsService,
    private deviceActivityService: DeviceActivityService
  ) {}

  ngOnInit(): void {
    const customerId = localStorage.getItem('id');

    if (customerId) {

      /* ================= PORTFOLIO ================= */
      this.portfolioService.getPortfolio(customerId).subscribe((data: any) => {
        const assets = (data.assets || data.Assets || []).map((item: any) => {
          let sum = 0;

          if (item.type === 'Bond' || item.type === 'Bonds') {
            sum = Number(item.amount) + (Number(item.amount) * 8 / 100);
          } else if (item.type === 'Fixed Deposit' || item.type === 'FD') {
            sum = Number(item.amount) + (Number(item.amount) * 7 / 100);
          } else if (item.type === 'Government Scheme') {
            sum = Number(item.amount) + (Number(item.amount) * 7.5 / 100);
          } else {
            sum = Number(item.amount);
          }

          return { ...item, sum };
        });

        const totalInvestment = assets.reduce(
          (sum: number, a: any) => sum + Number(a.amount), 0
        );

        const totalReturns = assets.reduce(
          (sum: number, a: any) => sum + a.sum, 0
        );

        const tableData = data.table || data.Table || [];
        const netWorth = data.netWorth ?? data.NetWorth ?? 0;

        // Fallback: build table from assets/loans if table is empty
        if (tableData.length === 0) {
          const loans = (data.loans || data.Loans || []).map((item: any) => {
            const issuedDate = new Date(item.issuedDate || item.IssuedDate);
            const dueDate = new Date(item.dueDate || item.DueDate);
            const timeInYears = (dueDate.getTime() - issuedDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
            const sum = Number(item.amount) + (Number(item.amount) * Number(item.interest) * timeInYears) / 100;
            return {
              name: item.name || item.Name,
              purchaseDate: (item.issuedDate || item.IssuedDate)?.split('T')[0],
              dueDate: (item.dueDate || item.DueDate)?.split('T')[0],
              interest: item.interest || item.Interest,
              amount: item.amount || item.Amount,
              sum
            };
          });
          
          const assetRows = assets.map((item: any) => ({
            name: item.name || item.Name,
            purchaseDate: (item.purchaseDate || item.PurchaseDate)?.split('T')[0],
            dueDate: (item.dueDate || item.DueDate)?.split('T')[0],
            interest: item.interest || item.Interest,
            amount: item.amount || item.Amount,
            sum: item.sum
          }));
          
          this.tableData = [...assetRows, ...loans];
        } else {
          this.tableData = tableData;
        }

        this.netWorth = netWorth;
        this.summary.totalInvestment = totalInvestment;
        this.summary.totalReturns = totalReturns;
        this.summary.riskLevel = data.riskLevel || data.RiskLevel || 'Moderate';
        this.latestRiskAlert = data.latestRiskAlert || data.LatestRiskAlert || null;
        this.riskAlerts = data.riskAlerts || data.RiskAlerts || [];
      });

      /* ================= DEVICE ACTIVITY ================= */
      this.deviceActivityService.getDeviceActivity(customerId)
        .subscribe((logs: any) => {

          if (Array.isArray(logs)) {
            this.deviceActivity = logs;
          } else if (logs?.data && Array.isArray(logs.data)) {
            this.deviceActivity = logs.data;
          } else if (logs && typeof logs === 'object') {
            this.deviceActivity = [logs];
          } else {
            this.deviceActivity = [];
          }
        });
    }
  }
}