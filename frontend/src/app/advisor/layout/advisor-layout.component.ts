import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-advisor-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './advisor-layout.component.html',
  styleUrls: ['./advisor-layout.component.css']
})
export class AdvisorLayoutComponent {

  advisorName = 'Advisor';

  constructor(private router: Router) {}

  logout() {
    // Clear session data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    localStorage.removeItem('kycStatus');
    
    console.log('Advisor logged out successfully');
    this.router.navigate(['/login']);
  }
}