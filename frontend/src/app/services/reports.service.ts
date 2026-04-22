import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getReports(customerId: string): Observable<any> {
    return this.http.get(`${this.api}/reports/${customerId}`);
  }
}