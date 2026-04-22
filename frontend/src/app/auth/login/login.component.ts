import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  activeRole: 'Customer' | 'Admin' | 'Advisor' = 'Customer';

  credentials = {
    username: '',
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  selectRole(role: 'Customer' | 'Admin' | 'Advisor') {
    this.activeRole = role;
    this.credentials = { username: '', email: '', password: '' };
  }

  goToSignup() {
    if (this.activeRole === 'Customer') {
      this.router.navigate(['/signup']);
    }
  }

  login() {

    // IMPORTANT FIX — removes hidden characters
    this.credentials.password = this.credentials.password.trim().normalize();

    
    // CUSTOMER LOGIN
if (this.activeRole === 'Customer') {
  if (!this.credentials.username || !this.credentials.password) {
    alert("Please enter username and password");
    return;
  }

  const body = {
    username: this.credentials.username,
    password: this.credentials.password
  };

  this.auth.customerLogin(body).subscribe({
    next: (res: any) => {
      console.log('Customer login response:', res);
      localStorage.setItem('token', res.token);
      localStorage.setItem('role', res.role);
      localStorage.setItem('id', res.id);
      localStorage.setItem('kycStatus', res.kycStatus);   // save KYC
      console.log('Stored - Token:', !!localStorage.getItem('token'), 'Role:', localStorage.getItem('role'));

      // FINAL CORRECT REDIRECT LOGIC
      if (res.kycStatus === 'NotSubmitted') {
        setTimeout(() => {
          this.router.navigate(['/kyc']);       // FIRST TIME ONLY
        }, 100);
      } else {
        setTimeout(() => {
          this.router.navigate(['/dashboard']); // NEXT LOGINS
        }, 100);
      }
    },
    error: () => {
      alert("Invalid Customer Credentials");
    }
  });

  return;
}

    // ADMIN LOGIN
    if (this.activeRole === 'Admin') {
      if (!this.credentials.email || !this.credentials.password) {
        alert("Please enter email and password");
        return;
      }

      const body = {
        email: this.credentials.email,
        password: this.credentials.password
      };

      this.auth.adminLogin(body).subscribe({
        next: (res: any) => {
          console.log('Admin login response:', res);
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('id', res.id);
          console.log('Stored - Token:', !!localStorage.getItem('token'), 'Role:', localStorage.getItem('role'));
          
          // Small delay to ensure localStorage is set before navigation
          setTimeout(() => {
            this.router.navigate(['/admin-dashboard']);
          }, 100);
        },
        error: () => {
          alert("Invalid Admin Credentials");
        }
      });

      return;
    }

    // ADVISOR LOGIN
    if (this.activeRole === 'Advisor') {
      if (!this.credentials.email || !this.credentials.password) {
        alert("Please enter email and password");
        return;
      }

      const body = {
        email: this.credentials.email,
        password: this.credentials.password
      };

      this.auth.advisorLogin(body).subscribe({
        next: (res: any) => {
          console.log('Advisor login response:', res);
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('id', res.id);
          console.log('Stored - Token:', !!localStorage.getItem('token'), 'Role:', localStorage.getItem('role'));
          
          // Small delay to ensure localStorage is set before navigation
          setTimeout(() => {
            this.router.navigate(['/advisor/dashboard']);
          }, 100);
        },
        error: () => {
          alert("Invalid Advisor Credentials");
        }
      });
    }
  }
}
