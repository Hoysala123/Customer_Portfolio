import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-retirement-plans',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-blue-600 text-white py-8">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">Retirement Plans</h1>
          <p class="text-blue-100">Build your retirement corpus with expert guidance</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Plan Your Retirement</h2>
          <p class="text-gray-700 mb-4">
            FinVista provides comprehensive retirement planning services combining tax-efficient investments with guaranteed and market-linked options.
          </p>
          <p class="text-gray-700">
            Our advisors help create a personalized retirement strategy aligned with your lifestyle goals.
          </p>
        </div>

        <div class="bg-blue-50 rounded-lg p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Our Retirement Solutions</h3>
          <ul class="space-y-2 text-gray-700">
            <li>✓ Guaranteed return pension plans</li>
            <li>✓ National Pension Scheme (NPS)</li>
            <li>✓ Market-linked ULIPs</li>
            <li>✓ Tax-efficient accumulation</li>
          </ul>
        </div>

        <button routerLink="/dashboard/portfolio" class="mt-8 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Start Retirement Planning
        </button>
      </div>
    </div>
  `
})
export class RetirementPlansComponent {}
