import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-blue-600 text-white py-8">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">Careers at FinVista</h1>
          <p class="text-blue-100">Join our mission to transform financial planning</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Join Our Team</h2>
          <p class="text-gray-700">
            Be part of a team transforming financial services. We offer competitive pay, growth opportunities, and a collaborative culture.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">What We Offer</h3>
            <p className="text-gray-700 text-sm">Competitive salary, health benefits, learning opportunities, flexible work, career growth</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Open Positions</h3>
            <p className="text-gray-700 text-sm">Financial Advisors, Developers, Data Analysts, UX/UI Designers, Support Specialists</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Company Culture</h3>
            <p className="text-gray-700 text-sm">Innovation-focused, transparent, diverse, inclusive, impact-driven work environment</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">How to Apply</h3>
            <p className="text-gray-700 text-sm">Send resume to careers&#64;finvista.com with position in subject line</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <p className="text-gray-700 text-center">
            Let's build the future of finance together.
          </p>
        </div>
      </div>
    </div>
  `
})
export class CareersComponent {}
