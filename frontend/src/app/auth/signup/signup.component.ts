import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../../services/signup.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './signup.component.html'
})
export class SignupComponent {

  form = {
    name: '',
    username: '',
    phone: '',
    email: '',
    password: ''
  };

  loading = false;

  constructor(
    private router: Router,
    private signupService: SignupService
  ) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  register() {
    // Clean password (optional)
    this.form.password = this.form.password.trim().normalize();

    // Simple validation
    if (!this.form.name ||
        !this.form.username ||
        !this.form.phone ||
        !this.form.email ||
        !this.form.password) {

      alert("Please fill all fields");
      return;
    }

    this.loading = true;

    this.signupService.register(this.form).subscribe({
      next: () => {
        this.loading = false;
        alert("Account created successfully!");
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Registration error:', error);
        const message =
          error.error?.message ||
          "Registration failed. Try again.";

        alert(message);
      }
    });
  }
}
