import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-blue-600 text-white py-8">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">Contact Us</h1>
          <p class="text-blue-100">We're here to help you</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Address</h3>
            <p className="text-gray-700 text-sm">FinVista Financial Services, 123 Finance Hub, Mumbai 400001, India</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Phone & Email</h3>
            <p className="text-gray-700 text-sm">Toll Free: 1800-FINVISTA | support&#64;finvista.com</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Business Hours</h3>
            <p className="text-gray-700 text-sm">Monday-Friday: 9:00 AM - 6:00 PM | Saturday: 10:00 AM - 4:00 PM</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Different Departments</h3>
            <p className="text-gray-700 text-sm">Support: support&#64;finvista.com | Complaints: complaints&#64;finvista.com | Careers: careers&#64;finvista.com</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <p className="text-gray-700 text-center">
            Our support team typically responds within 24 hours.
          </p>
        </div>
      </div>
    </div>
  `
})
export class ContactUsComponent {}
