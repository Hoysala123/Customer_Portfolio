import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KycService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  submitKyc(data: any) {
    return this.http.post(`${this.api}/kyc/submit`, data);
  }

  sendOtp() {
    return this.http.post(`${this.api}/kyc/send-otp`, {});
  }

  verifyOtp(otp: string) {
    return this.http.post(`${this.api}/kyc/verify-otp`, { otp });
  }
}