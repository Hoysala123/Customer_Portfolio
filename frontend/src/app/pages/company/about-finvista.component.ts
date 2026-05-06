import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-finvista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-blue-600 text-white py-8">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">About FinVista</h1>
          <p class="text-blue-100">Transforming Financial Planning for Everyone</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p class="text-gray-700">
            Make financial planning accessible, transparent, and rewarding for everyone through professional guidance and quality investment products.
          </p>
        </div>

        <div class="space-y-4">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Who We Are</h3>
            <p className="text-gray-700 text-sm">Founded by financial experts with decades of experience. Regulated by SEBI and RBI.</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">What We Do</h3>
            <p className="text-gray-700 text-sm">Provide comprehensive platform for government bonds, fixed deposits, mutual funds, and retirement planning.</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Our Values</h3>
            <p className="text-gray-700 text-sm">Transparency, trust, innovation, and excellence in everything we do.</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Why Choose Us</h3>
            <p className="text-gray-700 text-sm">50,000+ active customers, ₹500cr+ managed, certified advisors, SEBI regulated.</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <p className="text-gray-700 text-center">
            Start your financial journey with FinVista today.
          </p>
        </div>
      </div>
    </div>
  `
})
export class AboutFinVistaComponent {}
