import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  private api = environment.apiUrl;  // Example: http://localhost:5167/api

  constructor(private http: HttpClient) {}

  register(data: any) {
    // FIXED — Correct backend endpoint
    return this.http.post(`${this.api}/auth/register`, data);
  }
}