import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvestmentsService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getInvestments(customerId: string): Observable<any> {
    return this.http.get(`${this.api}/investments/${customerId}`);
  }

  addInvestment(customerId: string, data: any): Observable<any> {
    return this.http.post(`${this.api}/investments/${customerId}`, data);
  }
}