import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-agreement',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-blue-600 text-white py-8">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">Customer Agreement</h1>
          <p class="text-blue-100">Terms and conditions for using FinVista services</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Service Agreement</h2>
          <p class="text-gray-700">
            By using FinVista, you agree to these terms and conditions. Please read them carefully to understand your rights and responsibilities.
          </p>
        </div>

        <div class="space-y-4">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Account Eligibility</h3>
            <p className="text-gray-700 text-sm">You must be 18+ years old, an Indian resident, and provide accurate information</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">User Responsibilities</h3>
            <p className="text-gray-700 text-sm">Maintain account security, provide accurate information, comply with all laws</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Investment Terms</h3>
            <p className="text-gray-700 text-sm">Investments are subject to market risk, advisory fees apply, and performance varies</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Limitation of Liability</h3>
            <p className="text-gray-700 text-sm">FinVista is not liable for investment losses resulting from market conditions</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <p className="text-gray-700 text-center">
            Agreement questions? Contact: support&#64;finvista.com
          </p>
        </div>
      </div>
    </div>
  `
})
export class CustomerAgreementComponent {}
