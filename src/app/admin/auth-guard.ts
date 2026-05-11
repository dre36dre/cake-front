import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const logado = localStorage.getItem('adminLogado');
    console.log('AuthGuard: Verificando autenticação, adminLogado =', logado);

    if (logado === 'true') {
      console.log('AuthGuard: Acesso permitido');
      return true;
    }

    console.log('AuthGuard: Acesso negado, redirecionando para login');
    this.router.navigate(['/admin/login']);
    return false;
  }
}
