import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addBonds(data: any): Observable<any> {
    return this.http.post(`${this.api}/assets/bonds`, data);
  }

  addFixedDeposit(data: any): Observable<any> {
    return this.http.post(`${this.api}/assets/fd`, data);
  }

  addLoan(data: any): Observable<any> {
    return this.http.post(`${this.api}/assets/loans`, data);
  }

  getAssets(): Observable<any> {
    return this.http.get(`${this.api}/assets`);
  }
}