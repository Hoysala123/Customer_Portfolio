import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsService } from '../../services/reports.service';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {

  tableData: any[] = [];
  netWorth: number = 0;
  customerName: string = '';
  customerPhone: string = '';
  customerEmail: string = '';

  constructor(private reportsService: ReportsService, private portfolioService: PortfolioService) {}


ngOnInit(): void {
  const customerId = localStorage.getItem('id');
  if (!customerId) return;

  /* ================= FETCH PORTFOLIO (SOURCE OF TRUTH) ================= */
  this.portfolioService.getPortfolio(customerId).subscribe((data: any) => {

    /* ---------- ASSETS ---------- */
   /* ---------- ASSETS ---------- */
const assets = (data.assets || data.Assets || []).map((a: any) => {
  let sum = Number(a.amount);

  if (a.type === 'FD' || a.type === 'Fixed Deposit') sum += sum * 0.07;
  else if (a.type === 'Bond' || a.type === 'Bonds') sum += sum * 0.08;
  else if (a.type === 'Government Scheme') sum += sum * 0.075;

  return {
    name: a.name,
    purchaseDate: a.purchaseDate?.split('T')[0],  // ✅ date only
    dueDate: a.dueDate?.split('T')[0],            // ✅ date only
    interest: a.interest ?? '-',
    amount: Number(a.amount),
    sum
  };
});

/* ---------- LOANS ---------- */
const loans = (data.loans || data.Loans || []).map((l: any) => {
  const issued = new Date(l.issuedDate);
  const due = new Date(l.dueDate);

  const years =
    (due.getTime() - issued.getTime()) / (1000 * 60 * 60 * 24 * 365);

  const totalPayable =
    Number(l.amount) +
    (Number(l.amount) * Number(l.interest) * years) / 100;

  return {
    name: l.name,
    purchaseDate: l.issuedDate?.split('T')[0],   // ✅ date only
    dueDate: l.dueDate?.split('T')[0],           // ✅ date only
    interest: l.interest,
    amount: Number(l.amount),
    sum: -totalPayable
  };
});

this.tableData = [...assets, ...loans];


    this.netWorth = this.tableData.reduce(
      (t, r) => t + r.sum, 0
    );
  });

  /* ================= FETCH CUSTOMER INFO ================= */
  this.reportsService.getReports(customerId).subscribe((data: any) => {
    this.customerName = data.customerName || '';
    this.customerPhone = data.customerPhone || '';
    this.customerEmail = data.customerEmail || '';
  });
}

  downloadStatement(): void {
    const companyName = 'FinVista';

    // Header section
    let csv = '';
    csv += `Company: ${companyName}\n`;
    csv += `Customer: ${this.customerName}\n`;
    csv += `Phone: ${this.customerPhone}\n`;
    csv += `Email: ${this.customerEmail}\n`;
    csv += `Total Net Worth: ${this.netWorth}\n\n`;

    // Table header
    csv += 'SL.No,Assets / Liabilities,Purchase Date,Due Date,Interest,Amount,Sum\n';

    // Table rows
    this.tableData.forEach((row, index) => {
      const purchaseDate = row.purchaseDate
        ? this.formatDate(row.purchaseDate)
        : '';

      const dueDate = row.dueDate
        ? this.formatDate(row.dueDate)
        : '';

      csv += `${index + 1},${row.name},${purchaseDate},${dueDate},${row.interest},${row.amount},${row.sum}\n`;
    });

    // Create and download CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.customerName || 'Customer'}_FinVista_Statement.csv`;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  // ✅ Excel-safe date format: yyyy-MM-dd
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      return '';
    }

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }
}
