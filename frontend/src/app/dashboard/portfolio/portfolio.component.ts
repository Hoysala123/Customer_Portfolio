import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { DeviceActivityService } from '../../services/device-activity.service';

/* ✅ Device Activity model (typing only, no logic change) */
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

  /* ✅ FIXED: correct type so template can read properties */
  deviceActivity: DeviceActivity[] = [];

  constructor(
    private portfolioService: PortfolioService,
    private deviceActivityService: DeviceActivityService
  ) {}

  ngOnInit(): void {
    const customerId = localStorage.getItem('id');

    if (customerId) {

      /* ================= PORTFOLIO ================= */
      this.portfolioService.getPortfolio(customerId).subscribe((data: any) => {

        const assets = (data.assets || []).map((item: any) => {
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

        const loans = (data.loans || []).map((item: any) => {
          const sum = Number(item.amount) * Number(item.interest);
          return { ...item, sum };
        });

        this.tableData = [...assets, ...loans];

        const totalInvestment = assets.reduce(
          (sum: number, a: any) => sum + Number(a.amount), 0
        );

        const totalReturns = assets.reduce(
          (sum: number, a: any) => sum + a.sum, 0
        );

        const totalAssets = assets.reduce(
          (sum: number, a: any) => sum + a.sum, 0
        );

        const totalLoans = loans.reduce(
          (sum: number, l: any) => sum + l.sum, 0
        );

        this.netWorth = totalAssets - totalLoans;

        this.summary.totalInvestment = totalInvestment;
        this.summary.totalReturns = totalReturns;
        this.summary.riskLevel = data.riskLevel || 'Moderate';
        this.latestRiskAlert = data.latestRiskAlert || null;
        this.riskAlerts = data.riskAlerts || [];

        this.loanData = loans;
      });

      /* ================= DEVICE ACTIVITY ================= */
      this.deviceActivityService.getDeviceActivity(customerId)
        .subscribe((logs: any) => {

          /*
            ✅ THIS IS THE KEY FIX
            Handles:
              - []
              - [{...}]
              - { data: [...] }
              - single object
          */

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