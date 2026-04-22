import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { DashboardHeaderComponent } from '../header/dashboard-header/dashboard-header.component';
import { DashboardSidebarComponent } from '../sidebar/dashboard-sidebar/dashboard-sidebar.component';
import { AuthService } from '../../../services/auth.service';   
import { Router } from '@angular/router';                      

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DashboardHeaderComponent,
    DashboardSidebarComponent
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
}