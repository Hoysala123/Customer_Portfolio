import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../layout/admin-layout.component';
import { AdminApiService } from '../api/admin-api.service';

@Component({
  selector: 'app-admin-advisors',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent, FormsModule],
  templateUrl: './admin-advisors.component.html'
})
export class AdminAdvisorsComponent implements OnInit {

  advisors?: {
    id: string;
    name: string;
    email: string;
    contact: string;
    status: 'Active' | 'Inactive';
    allocatedCustomerCount: number;
  }[];

  showAddForm = false;
  newAdvisor = {
    name: '',
    email: '',
    phone: '',
    password: ''
  };
  isLoading = false;

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadAdvisors();
  }

  loadAdvisors(): void {
    this.adminApi.getAdvisors().subscribe({
      next: data => {
        this.advisors = data;
      },
      error: err => {
        console.error('Error loading advisors:', err);
      }
    });
  }

  openAddForm(): void {
    this.showAddForm = true;
    this.resetForm();
  }

  closeAddForm(): void {
    this.showAddForm = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newAdvisor = {
      name: '',
      email: '',
      phone: '',
      password: ''
    };
  }

  addAdvisor(): void {
    if (!this.newAdvisor.name || !this.newAdvisor.email || !this.newAdvisor.phone || !this.newAdvisor.password) {
      alert('Please fill all fields');
      return;
    }

    this.isLoading = true;
    const payload = {
      name: this.newAdvisor.name,
      email: this.newAdvisor.email,
      phone: this.newAdvisor.phone,
      passwordHash: this.newAdvisor.password
    };

    this.adminApi.addAdvisor(payload).subscribe({
      next: () => {
        alert('Advisor added successfully!');
        this.loadAdvisors();
        this.closeAddForm();
        this.isLoading = false;
      },
      error: err => {
        console.error('Error adding advisor:', err);
        alert('Error adding advisor: ' + (err?.error?.message || 'Unknown error'));
        this.isLoading = false;
      }
    });
  }
}