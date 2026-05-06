import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-government-schemes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-blue-600 text-white py-8">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">Government Schemes</h1>
          <p class="text-blue-100">Tax-efficient investment schemes for all goals</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Invest Through Government Schemes</h2>
          <p class="text-gray-700 mb-4">
            Access NSC, PPF, and other government schemes through FinVista with complete guidance and support.
          </p>
          <p class="text-gray-700">
            Benefit from tax deductions and guaranteed returns with our expert advisory support.
          </p>
        </div>

        <div class="bg-blue-50 rounded-lg p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Popular Schemes</h3>
          <ul class="space-y-3 text-gray-700">
            <li><strong>PPF:</strong> Long-term wealth accumulation with 7.1% returns</li>
            <li><strong>NSC:</strong> Short-term savings with 7.7% guaranteed returns</li>
            <li><strong>Sukanya Samriddhi:</strong> Dedicated scheme for girl child's future</li>
          </ul>
        </div>

        <button routerLink="/dashboard/portfolio" class="mt-8 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Explore Schemes
        </button>
      </div>
    </div>
  `
})
export class GovernmentSchemesComponent {}
