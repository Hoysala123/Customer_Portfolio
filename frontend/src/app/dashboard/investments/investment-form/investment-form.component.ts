import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvestmentsService } from '../../../services/investments.service';

@Component({
  selector: 'app-investment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './investment-form.component.html'
})
export class InvestmentFormComponent {

  investmentType: string = '';
  formData = {
    amount: '',
    date: this.getTodayDateString(),
    sumAssured: ''
  };

  // Helper to get today's date in yyyy-MM-dd format
  getTodayDateString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  // Calculate sum assured (total return) based on type and amount
  calculateSumAssured(): number {
    const amount = Number(this.formData.amount);
    if (!amount || amount <= 0) return 0;
    if (this.investmentType === 'Bonds') {
      // 8% interest, 1 year assumed
      return amount + (amount * 8 / 100);
    } else if (this.investmentType === 'FD') {
      // 7% interest, 1 year assumed
      return amount + (amount * 7 / 100);
    } else if (this.investmentType === 'Government Scheme') {
      // 7.5% interest, 1 year assumed
      return amount + (amount * 7.5 / 100);
    }
    return amount;
  }

  minAmounts: { [key: string]: number } = {
    'Bonds': 25000,
    'FD': 10000,
    'Government Scheme': 1000
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: InvestmentsService
  ) {
    this.route.queryParams.subscribe(params => {
      this.investmentType = params['type'] || 'Investment';
    });
  }

  getMinAmount(): number {
    return this.minAmounts[this.investmentType] || 0;
  }

  submitForm() {
    const customerId = localStorage.getItem('id');
    if (!customerId) {
      alert('User not logged in');
      return;
    }

    const minAmount = this.getMinAmount();
    const enteredAmount = Number(this.formData.amount);
    if (enteredAmount < minAmount) {
      alert(`Minimum investment for ${this.investmentType} is ₹${minAmount}`);
      return;
    }

    // Set date to today and sumAssured to calculated value
    const today = this.getTodayDateString();
    const sumAssured = this.calculateSumAssured();

    const payload = {
      type: this.investmentType,
      amount: enteredAmount,
      date: today,
      sumAssured: sumAssured
    };

    this.service.addInvestment(customerId, payload).subscribe(() => {
      alert('Investment saved successfully!');
      this.router.navigate(['/dashboard/investments']);
    });
  }

  // Update sumAssured live as amount changes
  onAmountChange() {
    this.formData.sumAssured = this.calculateSumAssured().toString();
  }
}