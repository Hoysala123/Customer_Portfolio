import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-risk-disclosure',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-blue-600 text-white py-8">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">Risk Disclosure</h1>
          <p class="text-blue-100">Important risk information for investors</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Understanding Investment Risks</h2>
          <p class="text-gray-700">
            All investments carry risks. Understanding these risks is essential before you start investing.
          </p>
        </div>

        <div class="space-y-4">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Market Risk</h3>
            <p className="text-gray-700 text-sm">Economic factors and policy changes can fluctuate investment values</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Interest Rate Risk</h3>
            <p className="text-gray-700 text-sm">Fixed income products are sensitive to interest rate changes</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Credit Risk</h3>
            <p className="text-gray-700 text-sm">Enterprises may default on obligations; government securities have lower risk</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Inflation Risk</h3>
            <p className="text-gray-700 text-sm">Fixed returns may not keep pace with inflation, reducing real purchasing power</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <p className="text-gray-700 text-center">
            <strong>Disclaimer:</strong> Past performance is not indicative of future results. Seek professional advice before investing.
          </p>
        </div>
      </div>
    </div>
  `
})
export class RiskDisclosureComponent {}
