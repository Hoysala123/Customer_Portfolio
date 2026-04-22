import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdvisorApiService {

  //Base URL for advisor APIs
  private readonly BASE_URL = environment.apiUrl + '/advisor';

  constructor(private http: HttpClient) {}

  // ================= DASHBOARD =================

  getDashboardSummary(): Observable<{
    totalCustomers: number;
    totalAssets: string;
    riskAlerts: number;
  }> {
    return this.http.get<{
      totalCustomers: number;
      totalAssets: string;
      riskAlerts: number;
    }>(`${this.BASE_URL}/dashboard/summary`);
  }

  /**
   * Advisor-specific audit logs
   * (Only logs related to assigned customers)
   */
  getAuditLogs(): Observable<
    {
      customerName: string;
      action: string;
      status: 'Success' | 'Failed';
    }[]
  > {
    return this.http.get<
      {
        customerName: string;
        action: string;
        status: 'Success' | 'Failed';
      }[]
    >(`${this.BASE_URL}/dashboard/audit-logs`);
  }

  /**
   * Customers who do NOT have portfolios
   * Used in "Create Portfolio" section
   */
  getCustomersWithoutPortfolio(): Observable<
    {
      id: string;
      name: string;
    }[]
  > {
    return this.http.get<
      {
        id: string;
        name: string;
      }[]
    >(`${this.BASE_URL}/dashboard/customers-without-portfolio`);
  }

  // ================= CUSTOMERS =================

  /**
   * Customers assigned to this advisor
   */
  getAssignedCustomers(): Observable<
    {
      id: string;
      name: string;
      username: string;
      email: string;
      phone: string;
      assets: string;
      liabilities: string;
      risk: 'High' | 'Medium' | 'Low';
      kycStatus: string;
      alert: boolean;
      portfolioCreated: boolean;
    }[]
  > {
    return this.http.get<any[]>(
      `${this.BASE_URL}/customers`
    );
  }

  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/customers`);
  }

  setCustomerRisk(customerId: string, riskLevel: 'High' | 'Medium' | 'Low'): Observable<void> {
    return this.http.post<void>(
      `${this.BASE_URL}/customers/${customerId}/risk`,
      { riskLevel }
    );
  }

  // ================= PORTFOLIO BUILDER =================

  /**
   * Get customer details for portfolio creation
   */
  getCustomerForPortfolio(customerId: string): Observable<{
    customerId: string;
    name: string;
    email: string;
    kycStatus: string;
    totalAssets: number;
    portfolioCreated: boolean;
  }> {
    return this.http.get<{
      customerId: string;
      name: string;
      email: string;
      kycStatus: string;
      totalAssets: number;
      portfolioCreated: boolean;
    }>(`${this.BASE_URL}/portfolio/${customerId}`);
  }

  /**
   * Submit created portfolio
   * (Backend validates allocation, calculates returns, saves)
   */
  createPortfolio(
    customerId: string,
    allocation: any[] = []
  ): Observable<void> {
    return this.http.post<void>(
      `${this.BASE_URL}/portfolio/${customerId}`,
      { allocation }
    );
  }

  /**
   * Send alert notification to the customer
   */
  sendCustomerAlert(customerId: string): Observable<void> {
    return this.http.post<void>(
      `${this.BASE_URL}/customers/${customerId}/alert`,
      {}
    );
  }

  // ================= REPORTS =================

  /**
   * Portfolio performance (line chart)
   */
  getPortfolioPerformance(): Observable<
    {
      month: string;
      value: number;
    }[]
  > {
    return this.http.get<
      {
        month: string;
        value: number;
      }[]
    >(`${this.BASE_URL}/reports/portfolio-performance`);
  }

  /**
   * Overall asset allocation (pie / donut chart)
   */
  getOverallAnalysis(): Observable<
    {
      label: string;
      value: number;
    }[]
  > {
    return this.http.get<
      {
        label: string;
        value: number;
      }[]
    >(`${this.BASE_URL}/reports/overall-analysis`);
  }

  /**
   * Customer-wise report summary
   */
  getCustomerReports(): Observable<
    {
      id: string;
      name: string;
      assets: string;
      liabilities: string;
      risk: 'High' | 'Medium' | 'Low';
    }[]
  > {
    return this.http.get<any[]>(
      `${this.BASE_URL}/reports/customers`
    );
  }

  /**
   * Download customer report (CSV)
   */
  downloadCustomerReport(customerId: string): Observable<Blob> {
    return this.http.get(
      `${this.BASE_URL}/customers/${customerId}/report`,
      { responseType: 'blob' }
    );
  }

  getAssetAllocation(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/asset-allocation`);
  }
}