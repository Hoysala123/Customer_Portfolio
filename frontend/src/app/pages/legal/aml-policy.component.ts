import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-aml-policy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-blue-600 text-white py-8">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">AML & KYC Policy</h1>
          <p class="text-blue-100">Regulatory compliance ensures secure investing</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Anti-Money Laundering</h2>
          <p class="text-gray-700">
            FinVista strictly adheres to AML regulations and KYC requirements from RBI, SEBI, and FIU to ensure secure and compliant investing.
          </p>
        </div>

        <div class="bg-blue-50 rounded-lg p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Key Compliance Measures</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Mandatory KYC verification for all customers</li>
            <li>✓ Customer due diligence and ongoing monitoring</li>
            <li>✓ Suspicious transaction reporting to FIU</li>
            <li>✓ Complete transaction record maintenance</li>
            <li>✓ Regular staff training on compliance</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <p className="text-gray-700 text-center">
            For AML-related queries, contact: compliance&#64;finvista.com
          </p>
        </div>
      </div>
    </div>
  `
})
export class AmlPolicyComponent {}
