import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IdleTimeoutService } from '../../services/idle-timeout.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {

  adminName = 'Admin';

  constructor(
    private router: Router,
    private auth: AuthService,
    private idleTimeout: IdleTimeoutService
  ) {}

  ngOnInit(): void {
    this.idleTimeout.startMonitoring();
  }

  ngOnDestroy(): void {
    this.idleTimeout.stopMonitoring();
  }

  logout() {
    this.idleTimeout.stopMonitoring();
    this.auth.logout();
    console.log('Admin logged out successfully');
    this.router.navigate(['/login']);
  }
}