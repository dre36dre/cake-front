import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${this.api}/login`, { username, password });
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
