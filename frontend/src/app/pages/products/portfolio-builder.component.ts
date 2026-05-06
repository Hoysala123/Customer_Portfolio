import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-portfolio-builder',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-blue-600 text-white py-8">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">Portfolio Builder</h1>
          <p class="text-blue-100">Create a diversified investment portfolio for your goals</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Build Your Custom Portfolio</h2>
          <p class="text-gray-700 mb-4">
            FinVista's portfolio builder combines your financial goals with expert market insights to create an optimized investment strategy.
          </p>
          <p class="text-gray-700">
            Invest across diversified assets and track performance through our intuitive dashboard.
          </p>
        </div>

        <div class="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Features</h3>
          <ul class="space-y-2 text-gray-700">
            <li>✓ Goal-based asset allocation</li>
            <li>✓ Risk-adjusted recommendations</li>
            <li>✓ Automatic portfolio rebalancing</li>
            <li>✓ Real-time performance tracking</li>
            <li>✓ Tax optimization strategies</li>
          </ul>
        </div>

        <button routerLink="/dashboard/portfolio" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Start Building Your Portfolio
        </button>
      </div>
    </div>
  `
})
export class PortfolioBuilderComponent {}
