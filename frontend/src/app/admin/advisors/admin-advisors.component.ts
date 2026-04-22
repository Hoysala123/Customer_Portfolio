import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from '../layout/admin-layout.component';
import { AdminApiService } from '../api/admin-api.service';

@Component({
  selector: 'app-admin-advisors',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent],
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

}