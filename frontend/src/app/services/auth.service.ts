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

  // Session management methods
  private base64UrlDecode(value: string): string {
    value = value.replace(/-/g, '+').replace(/_/g, '/');
    const pad = value.length % 4;
    if (pad === 2) value += '==';
    else if (pad === 3) value += '=';
    else if (pad !== 0) return '';
    return atob(value);
  }

  private getTokenPayload(token?: string): any | null {
    const actualToken = token ?? this.getToken();
    if (!actualToken) {
      return null;
    }

    const parts = actualToken.split('.');
    if (parts.length !== 3) {
      return null;
    }

    try {
      const payload = this.base64UrlDecode(parts[1]);
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }

  private getTokenExpirationDate(token?: string): Date | null {
    const payload = this.getTokenPayload(token);
    if (!payload || !payload.exp) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(payload.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    const expirationDate = this.getTokenExpirationDate(token);
    if (!expirationDate) {
      return true;
    }

    return expirationDate.valueOf() <= Date.now();
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const role = this.getCurrentUserRole();

    if (!token || !role) {
      return false;
    }

    if (this.isTokenExpired(token)) {
      this.logout();
      return false;
    }

    return true;
  }

  getCurrentUserRole(): string | null {
    return localStorage.getItem('role');
  }

  getCurrentUserId(): string | null {
    return localStorage.getItem('id');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
  }

  // Check session validity with backend
  validateSession(): Observable<any> {
    return this.http.get(`${this.api}/auth/validate-session`);
  }
}
