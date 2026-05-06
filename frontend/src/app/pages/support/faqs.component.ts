import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-blue-600 text-white py-8">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
          <p class="text-blue-100">Answers to common questions</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="space-y-4">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">How do I start investing?</h3>
            <p class="text-gray-700">
              Sign up on FinVista, complete KYC verification, and you can start investing in available products immediately.
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">What's the minimum investment amount?</h3>
            <p class="text-gray-700">
              Minimum investment varies by product, typically starting from ₹100-₹1000 depending on the investment type.
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Is my investment safe?</h3>
            <p class="text-gray-700">
              Yes! FinVista is regulated by SEBI and RBI. All investments are protected by regulatory frameworks.
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Can I withdraw my money anytime?</h3>
            <p class="text-gray-700">
              Withdrawal depends on product type. Most products allow withdrawal after lock-in period expires.
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">How do I get tax benefits?</h3>
            <p class="text-gray-700">
              Many products offer tax deductions. Check product details or consult with our advisors for tax optimization.
            </p>
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg p-6 mt-8">
          <p class="text-gray-700 text-center">
            Still have questions? Contact support at support&#64;finvista.com
          </p>
        </div>
      </div>
    </div>
  `
})
export class FaqsComponent {}
