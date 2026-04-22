import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {

  // Base URL -change once when backend is ready
  private readonly BASE_URL = environment.apiUrl + '/admin';

  constructor(private http: HttpClient) {}

  // ================= DASHBOARD =================

  /**
   * Dashboard summary cards
   */
  getDashboardSummary(): Observable<{
    totalUsers: number;
    totalCustomers: number;
    totalAssets: number;
    activeAlerts: number;
  }> {
    return this.http.get<{
      totalUsers: number;
      totalCustomers: number;
      totalAssets: number;
      activeAlerts: number;
    }>(`${this.BASE_URL}/dashboard/summary`);
  }

  /**
   * Portfolio performance chart
   */
  getPortfolioPerformance(advisorId?: string): Observable<
    { month: string; value: number }[]
  > {
    let params = new HttpParams();
    if (advisorId) {
      params = params.set('advisorId', advisorId);
    }
    return this.http.get<
      { month: string; value: number }[]
    >(`${this.BASE_URL}/dashboard/portfolio-performance`, { params, responseType: 'json' });
  }

  /**
   * Asset allocation chart
   */
  getAssetAllocation(advisorId?: string): Observable<
    { label: string; percentage: number }[]
  > {
    let params = new HttpParams();
    if (advisorId) {
      params = params.set('advisorId', advisorId);
    }
    return this.http.get<
      { label: string; percentage: number }[]
    >(`${this.BASE_URL}/dashboard/asset-allocation`, { params, responseType: 'json' });
  }

  /**
   * Audit logs
   */
  getAuditLogs(): Observable<
    {
      name: string;
      role: string;
      action: string;
      status: 'Success' | 'Failed';
    }[]
  > {
    return this.http.get<
      {
        name: string;
        role: string;
        action: string;
        status: 'Success' | 'Failed';
      }[]
    >(`${this.BASE_URL}/dashboard/audit-logs`);
  }

  // ================= CUSTOMERS =================

  getCustomers(): Observable<
    {
      id: string;
      name: string;
      username: string;
      phone: string;
      email: string;
      advisor: string;
      kycStatus: 'Approved' | 'Pending';
      risk: 'High' | 'Medium' | 'Low';
    }[]
  > {
    return this.http.get<any[]>(`${this.BASE_URL}/customers`);
  }

  getCustomerReports(): Observable<
    {
      id: string;
      name: string;
      email: string;
      phone: string;
      advisor: string;
      kycStatus: string;
      risk: 'High' | 'Medium' | 'Low' | string;
      totalAssets: number;
      totalLiabilities: number;
      netWorth: number;
    }[]
  > {
    return this.http.get<any[]>(`${this.BASE_URL}/reports/customers`);
  }

  setCustomerRisk(customerId: string, riskLevel: 'High' | 'Medium' | 'Low'): Observable<void> {
    return this.http.post<void>(
      `${this.BASE_URL}/customers/${customerId}/risk`,
      { riskLevel }
    );
  }

  downloadCustomerReport(customerId: string): Observable<Blob> {
    return this.http.get(`${this.BASE_URL}/customers/${customerId}/report`, {
      responseType: 'blob'
    });
  }

  // ================= ADVISORS =================

  getAdvisors(): Observable<
    {
      id: string;
      name: string;
      email: string;
      contact: string;
      status: 'Active' | 'Inactive';
      allocatedCustomerCount: number;
    }[]
  > {
    return this.http.get<any[]>(`${this.BASE_URL}/advisors`);
  }

  // ================= NOTIFICATIONS / KYC =================

  getKycRequests(): Observable<
    {
      id: string;
      customerName: string;
      phone: string;
      email: string;
      status: string;
    }[]
  > {
    return this.http.get<any[]>(`${this.BASE_URL}/kyc/requests`);
  }

  approveKyc(kycRequestId: string): Observable<any> {
    return this.http.post<any>(
      `${this.BASE_URL}/kyc/${kycRequestId}/approve`,
      {}
    );
  }

  declineKyc(kycRequestId: string): Observable<any> {
    return this.http.post<any>(
      `${this.BASE_URL}/kyc/${kycRequestId}/decline`,
      {}
    );
  }

  // ================= INVESTMENT PRODUCTS =================

  getInvestmentProducts(): Observable<
    {
      name: string;
      category: string;
      interestRate: string;
      minInvestment: string;
      totalReturn: string;
    }[]
  > {
    return this.http.get<any[]>(
      `${this.BASE_URL}/investment-products`
    );
  }
}
