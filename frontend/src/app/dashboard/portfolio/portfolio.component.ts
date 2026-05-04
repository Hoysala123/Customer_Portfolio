import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { ReportsService } from '../../services/reports.service';
import { DeviceActivityService } from '../../services/device-activity.service';

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

  netWorth = 0;

  summary = {
    totalInvestment: 0,
    totalReturns: 0,
    riskLevel: 'Moderate'
  };

  tableData: any[] = [];
  latestRiskAlert: string | null = null;
  riskAlerts: string[] = [];
  deviceActivity: DeviceActivity[] = [];

  constructor(
    private portfolioService: PortfolioService,
    private reportsService: ReportsService,
    private deviceActivityService: DeviceActivityService
  ) {}

  ngOnInit(): void {
    const customerId = localStorage.getItem('id');
    if (!customerId) return;

    /* ================= PORTFOLIO ================= */
    this.portfolioService.getPortfolio(customerId).subscribe((data: any) => {

      /* ---------- ASSETS ---------- */
      const assets = (data.assets || data.Assets || []).map((a: any) => {
        let sum = Number(a.amount);

        if (a.type === 'Bond' || a.type === 'Bonds') {
          sum += sum * 0.08;
        } else if (a.type === 'Fixed Deposit' || a.type === 'FD') {
          sum += sum * 0.07;
        } else if (a.type === 'Government Scheme') {
          sum += sum * 0.075;
        }

        return {
          name: a.name || a.Name,
          purchaseDate: (a.purchaseDate || a.PurchaseDate)?.split('T')[0],
          dueDate: (a.dueDate || a.DueDate)?.split('T')[0],
          interest: a.interest || a.Interest || '-',
          amount: Number(a.amount),
          sum
        };
      });

      /* ---------- LOANS (LIABILITIES) ---------- */
      const loans = (data.loans || data.Loans || []).map((l: any) => {
        const issued = new Date(l.issuedDate || l.IssuedDate);
        const due = new Date(l.dueDate || l.DueDate);
        const years = (due.getTime() - issued.getTime()) / (1000 * 60 * 60 * 24 * 365);

        const totalPayable =
          Number(l.amount) +
          (Number(l.amount) * Number(l.interest) * years) / 100;

        return {
          name: l.name || l.Name,
          purchaseDate: (l.issuedDate || l.IssuedDate)?.split('T')[0],
          dueDate: (l.dueDate || l.DueDate)?.split('T')[0],
          interest: l.interest || l.Interest,
          amount: Number(l.amount),        // ✅ liability
          sum: -totalPayable                // ✅ liability
        };
      });

      /* ---------- TABLE DATA ---------- */
      this.tableData = [...assets, ...loans];

      /* ---------- SUMMARY ---------- */
      this.summary.totalInvestment = assets.reduce(
        (s: number, a: any) => s + a.amount, 0
      );
      this.summary.totalReturns = assets.reduce(
        (s: number, a: any) => s + a.sum, 0
      );
      this.summary.riskLevel = data.riskLevel || data.RiskLevel || 'Moderate';

      /* ---------- NET WORTH ---------- */
      this.netWorth = this.tableData.reduce(
        (s: number, r: any) => s + r.sum, 0
      );

      this.latestRiskAlert =
        data.latestRiskAlert || data.LatestRiskAlert || null;
      this.riskAlerts = data.riskAlerts || data.RiskAlerts || [];
    });

    /* ================= DEVICE ACTIVITY ================= */
    this.deviceActivityService.getDeviceActivity(customerId)
      .subscribe((logs: any) => {
        if (Array.isArray(logs)) this.deviceActivity = logs;
        else if (logs?.data) this.deviceActivity = logs.data;
        else if (logs) this.deviceActivity = [logs];
      });
  }
}