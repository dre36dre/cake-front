import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<any>(`${this.api}/login`, { email, password });
  }

  salvarToken(token: string) {
    localStorage.setItem('token', token);
  }

  salvarRole(role: string) {
    localStorage.setItem('role', role);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAdmin() {
    return localStorage.getItem('role') === 'admin';
  }

  logout() {
    localStorage.clear();
  }
}