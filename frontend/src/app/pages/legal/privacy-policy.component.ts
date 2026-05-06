import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-blue-600 text-white py-8">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p class="text-blue-100">How we protect your personal information</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Your Privacy Matters</h2>
          <p class="text-gray-700">
            FinVista is committed to protecting your personal information and maintaining your trust.
          </p>
        </div>

        <div class="space-y-4">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Information We Collect</h3>
            <p className="text-gray-700 text-sm">Personal identification, financial details, and usage information</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">How We Use Your Data</h3>
            <p className="text-gray-700 text-sm">To provide services, process transactions, and comply with regulations</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Data Security</h3>
            <p className="text-gray-700 text-sm">SSL encryption, firewalls, and secure servers protect your information</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Your Rights</h3>
            <p className="text-gray-700 text-sm">You can access, modify, or delete your personal information anytime</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <p className="text-gray-700 text-center">
            Privacy questions? Contact: privacy&#64;finvista.com
          </p>
        </div>
      </div>
    </div>
  `
})
export class PrivacyPolicyComponent {}
