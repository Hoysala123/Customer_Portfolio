import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-sidebar.component.html'
})
export class DashboardSidebarComponent {

  @Input() userName: string = '';

  constructor(private router: Router) {}

  logout() {
    // Clear session data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    localStorage.removeItem('kycStatus');
    
    console.log('Customer logged out successfully');
    this.router.navigate(['/login']);
  }

}