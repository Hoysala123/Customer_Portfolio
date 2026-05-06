import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-advisor-support',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-blue-600 text-white py-8">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">Advisor Support</h1>
          <p class="text-blue-100">Resources and tools for FinVista advisors</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Support for Advisors</h2>
          <p className="text-gray-700">
            Comprehensive support and training to help advisors serve customers better and grow their business.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Resources Available</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Product training and certification</li>
            <li>✓ Marketing and sales tools</li>
            <li>✓ Customer management dashboard</li>
            <li>✓ Commission tracking and payouts</li>
            <li>✓ Dedicated support team</li>
          </ul>
        </div>

        <button routerLink="/advisor/dashboard" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">
          Access Advisor Portal
        </button>
      </div>
    </div>
  `
})
export class AdvisorSupportComponent {}
