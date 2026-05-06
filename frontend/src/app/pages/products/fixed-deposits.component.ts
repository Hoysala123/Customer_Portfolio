import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-fixed-deposits',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-blue-600 text-white py-8">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">Fixed Deposits</h1>
          <p class="text-blue-100">Guaranteed returns on your savings</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Secure Fixed Returns</h2>
          <p class="text-gray-700 mb-4">
            Fixed Deposits provide guaranteed returns at predetermined interest rates. Invest through FinVista and earn competitive rates with complete safety and transparency.
          </p>
          <p class="text-gray-700">
            Perfect for investors seeking predictable income and capital preservation.
          </p>
        </div>

        <div class="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Why Choose FDs?</h3>
          <ul class="space-y-2 text-gray-700">
            <li>✓ Fixed interest rates</li>
            <li>✓ Flexible tenure (6 months to 5 years)</li>
            <li>✓ FDIC protection</li>
            <li>✓ Easy online management</li>
          </ul>
        </div>

        <button routerLink="/dashboard/portfolio" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Open a Fixed Deposit
        </button>
      </div>
    </div>
  `
})
export class FixedDepositsComponent {}
