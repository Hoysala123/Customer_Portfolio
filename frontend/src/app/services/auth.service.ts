import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoggerService } from './logger.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) {}

  customerLogin(data: any): Observable<any> {
    this.logger.logAuthEvent('Customer Login Attempt', data?.username);
    return this.http.post(`${this.api}/auth/customer/login`, data).pipe(
      tap((response: any) => {
        this.logger.logAuthEvent('Customer Login Success', data?.username, 'Customer');
        this.logger.logApiResponse('/auth/customer/login', 'Success');
      }),
      catchError((error: any) => {
        this.logger.logApiError('/auth/customer/login', error.status, error.error?.message || 'Login failed');
        throw error;
      })
    );
  }

  adminLogin(data: any): Observable<any> {
    this.logger.logAuthEvent('Admin Login Attempt', data?.username);
    return this.http.post(`${this.api}/auth/admin/login`, data).pipe(
      tap((response: any) => {
        this.logger.logAuthEvent('Admin Login Success', data?.username, 'Admin');
        this.logger.logApiResponse('/auth/admin/login', 'Success');
      }),
      catchError((error: any) => {
        this.logger.logApiError('/auth/admin/login', error.status, error.error?.message || 'Login failed');
        throw error;
      })
    );
  }

  advisorLogin(data: any): Observable<any> {
    this.logger.logAuthEvent('Advisor Login Attempt', data?.username);
    return this.http.post(`${this.api}/auth/advisor/login`, data).pipe(
      tap((response: any) => {
        this.logger.logAuthEvent('Advisor Login Success', data?.username, 'Advisor');
        this.logger.logApiResponse('/auth/advisor/login', 'Success');
      }),
      catchError((error: any) => {
        this.logger.logApiError('/auth/advisor/login', error.status, error.error?.message || 'Login failed');
        throw error;
      })
    );
  }

  // ADDED METHOD (needed for dashboard username)
  getCustomerById(id: string) {
    this.logger.logApiCall('GET', `/customer/${id}`, id);
    return this.http.get(`${this.api}/customer/${id}`).pipe(
      tap(() => this.logger.logApiResponse(`/customer/${id}`, 'Success')),
      catchError((error: any) => {
        this.logger.logApiError(`/customer/${id}`, error.status, error.error?.message || 'Failed');
        throw error;
      })
    );
  }

  getKycStatus() {
    this.logger.logApiCall('GET', '/customer/kyc-status');
    return this.http.get(`${this.api}/customer/kyc-status`).pipe(
      tap(() => this.logger.logApiResponse('/customer/kyc-status', 'Success')),
      catchError((error: any) => {
        this.logger.logApiError('/customer/kyc-status', error.status, error.error?.message || 'Failed');
        throw error;
      })
    );
  }

  getCustomerNotifications(customerId: string) {
    this.logger.logApiCall('GET', `/deviceactivity/${customerId}`, customerId);
    return this.http.get(`${this.api}/deviceactivity/${customerId}`).pipe(
      tap(() => this.logger.logApiResponse(`/deviceactivity/${customerId}`, 'Success')),
      catchError((error: any) => {
        this.logger.logApiError(`/deviceactivity/${customerId}`, error.status, error.error?.message || 'Failed');
        throw error;
      })
    );
  }

  markNotificationsAsRead(customerId: string, notificationIds: string[]) {
    this.logger.logApiCall('POST', `/deviceactivity/${customerId}/mark-read`, customerId);
    return this.http.post(`${this.api}/deviceactivity/${customerId}/mark-read`, notificationIds).pipe(
      tap(() => this.logger.logApiResponse(`/deviceactivity/${customerId}/mark-read`, 'Success')),
      catchError((error: any) => {
        this.logger.logApiError(`/deviceactivity/${customerId}/mark-read`, error.status, error.error?.message || 'Failed');
        throw error;
      })
    );
  }

  // Logout endpoints
  logout(): Observable<any> {
    const userId = localStorage.getItem('id');
    const username = localStorage.getItem('username') || 'Unknown';
    this.logger.logAuthEvent('Logout', username);
    return this.http.post(`${this.api}/auth/logout`, {}).pipe(
      tap(() => {
        this.logger.logApiResponse('/auth/logout', 'Success');
      }),
      catchError((error: any) => {
        this.logger.logApiError('/auth/logout', error.status, error.error?.message || 'Failed');
        throw error;
      })
    );
  }

  logoutAll(): Observable<any> {
    const username = localStorage.getItem('username') || 'Unknown';
    this.logger.logAuthEvent('Logout All (All Devices)', username);
    return this.http.post(`${this.api}/auth/logout-all`, {}).pipe(
      tap(() => {
        this.logger.logApiResponse('/auth/logout-all', 'Success');
      }),
      catchError((error: any) => {
        this.logger.logApiError('/auth/logout-all', error.status, error.error?.message || 'Failed');
        throw error;
      })
    );
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
