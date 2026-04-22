import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsService } from '../../services/reports.service';

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

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    const customerId = localStorage.getItem('id');

    if (customerId) {
      this.reportsService.getReports(customerId).subscribe((data: any) => {
        this.tableData = data.table || [];
        this.netWorth = data.netWorth || 0;
        this.customerName = data.customerName || '';
        this.customerPhone = data.customerPhone || '';
        this.customerEmail = data.customerEmail || '';
      });
    }
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
