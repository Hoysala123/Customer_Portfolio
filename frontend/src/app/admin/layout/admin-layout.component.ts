import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {

  adminName = 'Admin';

  constructor(private router: Router) {}

  logout() {
    // Clear session data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    localStorage.removeItem('kycStatus');
    
    console.log('Admin logged out successfully');
    this.router.navigate(['/login']);
  }
}