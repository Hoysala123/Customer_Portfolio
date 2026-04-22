import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analysis.component.html'
})
export class AnalysisComponent implements OnInit {

  assetsPercent: number = 0;
  liabilitiesPercent: number = 0;
  combined: any = {};
  loading = true;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    const customerId = localStorage.getItem('id');
    if (customerId) {
      this.portfolioService.getPortfolio(customerId).subscribe((data: any) => {
        const assets = data.assets || [];
        const loans = data.loans || [];
        const totalAssets = assets.reduce((sum: number, a: any) => sum + Number(a.amount), 0);
        const totalLiabilities = loans.reduce((sum: number, l: any) => sum + Number(l.amount), 0);
        const total = totalAssets + totalLiabilities;
        this.assetsPercent = total > 0 ? Math.round((totalAssets / total) * 100) : 0;
        this.liabilitiesPercent = total > 0 ? Math.round((totalLiabilities / total) * 100) : 0;
        this.combined = {
          value: total > 0 ? Math.round(((totalAssets - totalLiabilities) / total) * 100) : 0,
          title: 'Combined Analysis'
        };
        this.loading = false;
      });
    }
  }
}