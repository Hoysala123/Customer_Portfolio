import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-blue-600 text-white py-8">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">Documentation</h1>
          <p class="text-blue-100">API and integration documentation</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Developer Resources</h2>
          <p class="text-gray-700">
            Complete technical documentation for integrating with FinVista APIs.
          </p>
        </div>

        <div class="bg-blue-50 rounded-lg p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Available Documentation</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ REST API Reference</li>
            <li>✓ Authentication & Authorization</li>
            <li>✓ Integration Guides</li>
            <li>✓ Code Examples</li>
            <li>✓ Error Handling</li>
          </ul>
        </div>

        <p class="text-gray-700 text-center mt-8">
          For detailed documentation, contact: developers&#64;finvista.com
        </p>
      </div>
    </div>
  `
})
export class DocumentationComponent {}
