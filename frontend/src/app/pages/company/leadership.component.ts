import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-leadership',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-blue-600 text-white py-8">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">Leadership Team</h1>
          <p class="text-blue-100">Meet the leaders driving FinVista forward</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Executive Team</h2>
          <p class="text-gray-700">
            Our leadership brings decades of combined experience in finance, technology, and operations.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-gray-800">CEO - Rajesh Kumar</h3>
            <p className="text-gray-700 text-sm">20+ years in financial services and fintech innovation</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-gray-800">CTO - Priya Sharma</h3>
            <p className="text-gray-700 text-sm">15+ years in technology and platform architecture</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-gray-800">CFO - Arun Patel</h3>
            <p className="text-gray-700 text-sm">Expert in banking, wealth management, and fiscal strategy</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-gray-800">COO - Ananya Singh</h3>
            <p className="text-gray-700 text-sm">12+ years in operations and process optimization</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <p className="text-gray-700 text-center">
            Dedicated to delivering excellence in financial services.
          </p>
        </div>
      </div>
    </div>
  `
})
export class LeadershipComponent {}
