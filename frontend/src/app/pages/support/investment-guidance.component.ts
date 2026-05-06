import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-investment-guidance',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-blue-600 text-white py-8">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">Investment Guidance</h1>
          <p class="text-blue-100">Smart investment tips from FinVista</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Investment Principles</h2>
          <p class="text-gray-700">
            Follow these principles to build wealth and achieve your financial goals.
          </p>
        </div>

        <div class="space-y-4">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">1. Define Clear Goals</h3>
            <p class="text-gray-700">Define your financial objectives and investment timeline to guide your strategy.</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">2. Know Your Risk Profile</h3>
            <p class="text-gray-700">Assess your comfort with market volatility and invest accordingly.</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">3. Diversify Your Portfolio</h3>
            <p class="text-gray-700">Invest across different asset classes to reduce risk and optimize returns.</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">4. Start Early</h3>
            <p class="text-gray-700">Begin investing as early as possible to benefit from compound growth.</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">5. Stay Invested</h3>
            <p class="text-gray-700">Avoid emotional decisions and stay committed to your long-term strategy.</p>
          </div>
        </div>

        <button routerLink="/dashboard/analysis" class="mt-8 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Analyze Your Portfolio
        </button>
      </div>
    </div>
  `
})
export class InvestmentGuidanceComponent {}
