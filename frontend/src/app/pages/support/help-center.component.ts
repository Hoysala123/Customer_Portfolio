import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-blue-600 text-white py-8">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">Help Center</h1>
          <p class="text-blue-100">Get answers to your investment questions</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">How Can We Help?</h2>
          <p class="text-gray-700">
            Find quick answers to common questions about FinVista account, investments, and portfolio management.
          </p>
        </div>

        <div class="space-y-4">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Getting Started with FinVista</h3>
            <p class="text-gray-700 text-sm mb-3">Account registration, KYC verification, and first investment steps</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Managing Your Portfolio</h3>
            <p class="text-gray-700 text-sm mb-3">Invest, redeem, track, and analyze your investments</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Investment Products</h3>
            <p class="text-gray-700 text-sm mb-3">Understanding bonds, FDs, schemes, and retirement plans</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Transactions & Security</h3>
            <p class="text-gray-700 text-sm mb-3">Payment methods, transaction tracking, and account security</p>
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg p-6 mt-8">
          <p class="text-gray-700 text-center">
            Need more help? Contact our support team at support&#64;finvista.com
          </p>
        </div>
      </div>
    </div>
  `
})
export class HelpCenterComponent {}
