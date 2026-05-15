import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {

  usuario = 'admin';
  senha = '';
  erro = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  entrar() {
    this.erro = '';

    if (this.usuario === 'admin' && this.authService.existeSenhaAdminAlterada()) {
      if (this.authService.validarSenhaAdminLocal(this.senha)) {
        this.entrarComoAdmin();
        return;
      }

      this.erro = 'Usuario ou senha incorretos';
      return;
    }

    this.authService.login(this.usuario, this.senha).subscribe({
      next: (res) => {
        this.authService.salvarToken(res.token);
        this.authService.salvarRole('admin');
        this.entrarComoAdmin();
      },
      error: () => {
        if (this.usuario === 'admin' && this.authService.validarSenhaAdminLocal(this.senha)) {
          this.entrarComoAdmin();
          return;
        }

        this.erro = 'Usuario ou senha incorretos';
      }
    });
  }

  private entrarComoAdmin() {
    localStorage.setItem('adminLogado', 'true');
    this.router.navigate(['/admin/pedidos']);
  }
}
