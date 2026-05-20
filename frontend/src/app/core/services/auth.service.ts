import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = `${this.getApiBase()}/auth`;

  constructor(private http: HttpClient) {}

  private getApiBase(): string {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname.toLowerCase();
      const isLocalhost =
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '[::1]';

      if (isLocalhost) {
        return '/api';
      }
    }

    return environment.apiUrl.replace(/\/$/, '');
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.api}/login`, { username, password });
  }

  alterarSenha(senhaAtual: string, novaSenha: string) {
    return this.http.post<any>(`${this.api}/change-password`, {
      currentPassword: senhaAtual,
      newPassword: novaSenha
    });
  }

  salvarToken(token: string) {
    localStorage.setItem('token', token);
    localStorage.removeItem('adminPassword');
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
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('adminLogado');
  }
}
