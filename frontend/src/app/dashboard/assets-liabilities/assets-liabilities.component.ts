import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetsService } from '../../services/assets.service';

@Component({
  selector: 'app-assets-liabilities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assets-liabilities.component.html'
})
export class AssetsLiabilitiesComponent {
  assets: any[] = [];

  ngOnInit() {
    this.loadAssets();
  }

  loadAssets() {
    this.assetsService.getAssets().subscribe((data: any) => {
      this.assets = data;
    });
  }

  tab = 'bonds';

  bondsForm = {
    name: '',
    purchaseDate: '',
    dueDate: '',
    interest: '',
    amount: ''
  };

  fdForm = {
    name: '',
    purchaseDate: '',
    dueDate: '',
    interest: '',
    amount: ''
  };

  loanForm = {
    name: '',
    issuedDate: '',
    dueDate: '',
    interest: '',
    amount: ''
  };

  constructor(private assetsService: AssetsService) {}

  saveBonds() {
    // Ensure correct types and formats
    const payload = {
      name: this.bondsForm.name,
      purchaseDate: this.formatDate(this.bondsForm.purchaseDate),
      dueDate: this.formatDate(this.bondsForm.dueDate),
      interest: Number(this.bondsForm.interest),
      amount: Number(this.bondsForm.amount)
    };
    console.log('Bonds payload:', payload);
    this.assetsService.addBonds(payload).subscribe({
      next: () => {
        alert("Bonds saved successfully!");
        this.loadAssets();
      },
      error: (err) => {
        alert("Error saving bonds: " + (err?.error?.message || err.message || 'Unknown error'));
      }
    });
  }

  saveFD() {
    const payload = {
      name: this.fdForm.name,
      purchaseDate: this.formatDate(this.fdForm.purchaseDate),
      dueDate: this.formatDate(this.fdForm.dueDate),
      interest: Number(this.fdForm.interest),
      amount: Number(this.fdForm.amount)
    };
    console.log('FD payload:', payload);
    this.assetsService.addFixedDeposit(payload).subscribe({
      next: () => {
        alert("Fixed Deposit saved successfully!");
        this.loadAssets();
      },
      error: (err) => {
        alert("Error saving fixed deposit: " + (err?.error?.message || err.message || 'Unknown error'));
      }
    });
  }

  saveLoan() {
    const payload = {
      name: this.loanForm.name,
      issuedDate: this.formatDate(this.loanForm.issuedDate),
      dueDate: this.formatDate(this.loanForm.dueDate),
      interest: Number(this.loanForm.interest),
      amount: Number(this.loanForm.amount)
    };
    console.log('Loan payload:', payload);
    this.assetsService.addLoan(payload).subscribe({
      next: () => {
        alert("Loan saved successfully!");
        this.loadAssets();
      },
      error: (err) => {
        alert("Error saving loan: " + (err?.error?.message || err.message || 'Unknown error'));
      }
    });
  }

  // Utility to format date as YYYY-MM-DD
  formatDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return date; // fallback if already formatted
    return d.toISOString().split('T')[0];
  }
}