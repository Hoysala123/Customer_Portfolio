import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-government-bonds',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-blue-600 text-white py-8">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">Government Bonds</h1>
          <p class="text-blue-100">Secure government-backed investments through FinVista</p>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">What Are Government Bonds?</h2>
          <p class="text-gray-700 mb-4">
            Government bonds are debt securities issued by the government. They offer predictable returns and are backed by sovereign guarantee, making them ideal for conservative investors.
          </p>
          <p class="text-gray-700">
            Invest in government bonds through FinVista's platform and access diversified government securities with transparent pricing and expert guidance.
          </p>
        </div>

        <div class="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Key Benefits</h3>
          <ul class="space-y-2 text-gray-700">
            <li>✓ Government backing and security</li>
            <li>✓ Fixed interest rates</li>
            <li>✓ Regular coupon payments</li>
            <li>✓ Low risk investment</li>
          </ul>
        </div>

        <button routerLink="/dashboard/portfolio" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Explore Bonds in Portfolio
        </button>
      </div>
    </div>
  `
})
export class GovernmentBondsComponent {}
