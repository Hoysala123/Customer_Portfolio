import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { KycService } from '../../services/kyc.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-kyc',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './kyc.component.html'
})
export class KycComponent {

  kycData = {
    name: '',
    phone: '',
    email: ''
  };

  otp: string = "";
  kycSubmitted = false;
  loading = false;

  constructor(
    private kycService: KycService,
    private router: Router
  ) {}

  submitKyc() {
    if (!this.kycData.name || !this.kycData.phone || !this.kycData.email) {
      alert('Please fill all KYC fields');
      return;
    }

    this.loading = true;

    this.kycService.submitKyc(this.kycData).subscribe({
      next: () => {
        this.loading = false;
        this.kycSubmitted = true;

        this.kycService.sendOtp().subscribe(() => {
          alert("OTP sent to your email");
        });
      },
      error: () => {
        this.loading = false;
        alert('Failed to submit KYC');
      }
    });
  }

  verifyOtp() {
    if (!this.otp) {
      alert("Enter OTP");
      return;
    }

    this.kycService.verifyOtp(this.otp).subscribe({
      next: () => {
        alert("OTP Verified Successfully!");
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        alert("Invalid OTP");
      }
    });
  }
}