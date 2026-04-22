import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  customerLogin(data: any): Observable<any> {
    return this.http.post(`${this.api}/auth/customer/login`, data);
  }

  adminLogin(data: any): Observable<any> {
    return this.http.post(`${this.api}/auth/admin/login`, data);
  }

  advisorLogin(data: any): Observable<any> {
    return this.http.post(`${this.api}/auth/advisor/login`, data);
  }

  // ADDED METHOD (needed for dashboard username)
  getCustomerById(id: string) {
    return this.http.get(`${this.api}/customer/${id}`);
  }

  getKycStatus() {
    return this.http.get(`${this.api}/customer/kyc-status`);
  }

  getCustomerNotifications(customerId: string) {
    return this.http.get(`${this.api}/deviceactivity/${customerId}`);
  }

  markNotificationsAsRead(customerId: string, notificationIds: string[]) {
    return this.http.post(`${this.api}/deviceactivity/${customerId}/mark-read`, notificationIds);
  }
}
