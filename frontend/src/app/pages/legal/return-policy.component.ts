import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-return-policy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-blue-600 text-white py-8">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">Return & Refund Policy</h1>
          <p class="text-blue-100">Our commitment to customer satisfaction</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Customer Satisfaction Guarantee</h2>
          <p class="text-gray-700">
            We offer a 30-day money-back guarantee on new investments if you're not satisfied.
          </p>
        </div>

        <div class="space-y-4">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Money-Back Guarantee</h3>
            <p className="text-gray-700 text-sm">Request refund within 30 days of investment; principal amount refunded in 5-7 business days</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">How to Request</h3>
            <p className="text-gray-700 text-sm">Log in to your account, select the investment, and click "Request Return" button</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">What's Covered</h3>
            <p className="text-gray-700 text-sm">Principal amount in first 30 days; excludes interest earned and administrative charges</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Eligibility</h3>
            <p className="text-gray-700 text-sm">Must request within 30 days, no prior redemption, no KYC violations</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <p className="text-gray-700 text-center">
            For refund questions: refunds&#64;finvista.com
          </p>
        </div>
      </div>
    </div>
  `
})
export class ReturnPolicyComponent {}
