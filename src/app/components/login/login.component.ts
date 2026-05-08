import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private auth: AuthService) {}

  login() {
    if (!this.email || !this.password) {
      alert('Preencha email e senha');
      return;
    }

    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        console.log('Resposta:', res);

        // 🔐 salva token e role
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);

        alert('Login realizado com sucesso!');

        // 🚀 redirecionamento
        if (res.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      },
      error: (err) => {
        console.error(err);
        alert('Email ou senha inválidos');
      }
    });
  }
}