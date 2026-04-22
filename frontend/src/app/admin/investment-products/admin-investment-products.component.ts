import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from '../layout/admin-layout.component';

@Component({
  selector: 'app-admin-investment-products',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent],
  templateUrl: './admin-investment-products.component.html'
})
export class AdminInvestmentProductsComponent {

  // Products from backend (static for now)
  products?: {
    name: string;
    category: string;
    interestRate: string;
    minInvestment: string;
    totalReturn: string;
  }[] = [
    {
      name: 'Government Bonds',
      category: 'Bonds',
      interestRate: '8%',
      minInvestment: '₹25,000',
      totalReturn: 'Stable'
    },
    {
      name: 'Fixed Deposit',
      category: 'FD',
      interestRate: '7%',
      minInvestment: '₹10,000',
      totalReturn: 'Moderate'
    },
    {
      name: 'National Savings Scheme',
      category: 'Govt Scheme',
      interestRate: '7.5%',
      minInvestment: '₹1,000',
      totalReturn: 'Long Term'
    }
  ];

}