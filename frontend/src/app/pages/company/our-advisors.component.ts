import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-our-advisors',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-blue-600 text-white py-8">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">Our Advisors</h1>
          <p class="text-blue-100">Meet our team of certified financial experts</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Expert Financial Guidance</h2>
          <p class="text-gray-700">
            Our 500+ certified financial advisors bring years of expertise to help you achieve your financial goals.
          </p>
        </div>

        <div class="space-y-4">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Advisor Qualifications</h3>
            <p className="text-gray-700 text-sm">CFP certified, SEBI regulated, 5+ years experience, background verified, continuous training</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Our Services</h3>
            <p className="text-gray-700 text-sm">Personalized wealth planning, goal-based strategies, portfolio optimization, tax planning, retirement guidance</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">How to Connect</h3>
            <p className="text-gray-700 text-sm">Phone, video meeting, in-person appointment, email, or chat support available</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Why FinVista Advisors</h3>
            <p className="text-gray-700 text-sm">Transparent advice, comprehensive solutions, technology-enabled, ongoing support, results-focused approach</p>
          </div>
        </div>

        <button routerLink="/advisor/dashboard" class="mt-8 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Connect with an Advisor
        </button>
      </div>
    </div>
  `
})
export class OurAdvisorsComponent {}
