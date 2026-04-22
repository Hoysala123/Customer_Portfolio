import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAnalysis(customerId: string): Observable<any> {
    return this.http.get(`${this.api}/analysis/${customerId}`);
  }
}