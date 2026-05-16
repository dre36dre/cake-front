import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = `${this.getApiBase()}/auth`;
  private readonly adminPasswordKey = 'adminPassword';
  private readonly senhasPadrao = ['confeitaria123', 'confeitaria123#'];

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

  validarSenhaAdminLocal(senha: string): boolean {
    const senhaSalva = this.getSenhaAdminLocal();

    if (senhaSalva) {
      return senha === senhaSalva;
    }

    return this.senhasPadrao.includes(senha);
  }

  existeSenhaAdminAlterada(): boolean {
    return !!this.getSenhaAdminLocal();
  }

  salvarSenhaAdminLocal(senha: string) {
    localStorage.setItem(this.adminPasswordKey, senha);
  }

  getSenhaAdminLocal(): string | null {
    return localStorage.getItem(this.adminPasswordKey);
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
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('adminLogado');
  }
}
