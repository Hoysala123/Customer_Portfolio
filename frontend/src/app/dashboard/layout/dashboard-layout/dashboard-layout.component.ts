import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';

import { DashboardHeaderComponent } from '../header/dashboard-header/dashboard-header.component';
import { DashboardSidebarComponent } from '../sidebar/dashboard-sidebar/dashboard-sidebar.component';
import { FooterComponent } from '../../../footer/footer.component';
import { AuthService } from '../../../services/auth.service';   
import { Router } from '@angular/router';                      

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    DashboardHeaderComponent,
    // DashboardSidebarComponent,
    // FooterComponent
  ],
  templateUrl: './dashboard-layout.component.html'
})
export class DashboardLayoutComponent implements OnInit {

  pageTitle: string = 'Portfolio';

  // dynamic username from DB
  userName: string = '';

  constructor(
    private auth: AuthService,    
    private router: Router        
  ) {}

  ngOnInit(): void {
    const id = localStorage.getItem('id');  // CUSTOMER ID from login

    if (id) {
      this.auth.getCustomerById(id).subscribe({
        next: (res: any) => {
          this.userName = res.name; // assign real name
        },
        error: () => {
          this.userName = "User";   // fallback
        }
      });
    }
    }

    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('id');
      localStorage.removeItem('kycStatus');
      this.router.navigate(['/login']);
  }
}