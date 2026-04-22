import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AdvisorLayoutComponent } from '../layout/advisor-layout.component';
import { AdvisorApiService } from '../api/advisor-api.service';

@Component({
  selector: 'app-portfolio-builder',
  standalone: true,
  imports: [CommonModule, AdvisorLayoutComponent],
  templateUrl: './portfolio-builder.component.html'
})
export class PortfolioBuilderComponent implements OnInit {

  customerId!: string;

  // Customer summary from backend
  customer: any = {
    name: '',
    email: '',
    kycStatus: '',
    totalAssets: 0,
    portfolioCreated: false
  };

  // Assets & Liabilities
  assetsLiabilities: any[] = [];

  // These will come directly from backend
  totalAssets = 0;
  totalLiabilities = 0;
  netWorth = 0;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private advisorApi: AdvisorApiService
  ) {}

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('customerId')!;
    this.loadCustomerDetails();
  }

  loadCustomerDetails() {
    this.advisorApi.getCustomerForPortfolio(this.customerId).subscribe({
      next: data => {
        this.customer = data;
        this.totalAssets = data.totalAssets;
        this.totalLiabilities = 0;
        this.netWorth = this.totalAssets - this.totalLiabilities;
        this.assetsLiabilities = [
          {
            name: 'Portfolio allocation',
            type: 'Asset',
            amount: this.totalAssets
          }
        ];
        this.loading = false;
      },
      error: err => {
        console.error('Could not load customer portfolio details', err);
        this.loading = false;
      }
    });
  }

  createPortfolio() {
    if (this.customer.portfolioCreated) {
      alert('Portfolio is already created for this customer.');
      return;
    }

    this.advisorApi.createPortfolio(this.customerId, []).subscribe({
      next: () => {
        alert('Portfolio created successfully');
        this.router.navigate(['/advisor/dashboard']);
      },
      error: err => {
        console.error('Create portfolio failed:', err);
        alert('Unable to create portfolio.');
      }
    });
  }
}