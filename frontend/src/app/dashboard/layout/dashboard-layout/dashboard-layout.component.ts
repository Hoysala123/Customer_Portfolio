import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
 
import { DashboardHeaderComponent } from '../header/dashboard-header/dashboard-header.component';
import { DashboardSidebarComponent } from '../sidebar/dashboard-sidebar/dashboard-sidebar.component';
import { FooterComponent } from '../../../footer/footer.component';
import { AuthService } from '../../../services/auth.service';
import { IdleTimeoutService } from '../../../services/idle-timeout.service';
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
export class DashboardLayoutComponent implements OnInit, OnDestroy {
 
  pageTitle: string = 'Portfolio';
 
  // dynamic username from DB
  userName: string = '';
 
  constructor(
    private auth: AuthService,
    private idleTimeout: IdleTimeoutService,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    // Start idle timeout monitoring
    this.idleTimeout.startMonitoring();

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

  ngOnDestroy(): void {
    // Stop idle timeout monitoring when leaving dashboard
    this.idleTimeout.stopMonitoring();
  }
 
    logout() {
      this.idleTimeout.stopMonitoring();
      this.auth.logout();
      this.router.navigate(['/login']);
  }
}
 