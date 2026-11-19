import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email = '';
  password = '';
  erro = '';
  carregando = false;

  constructor(private authService: AuthService, private router: Router){}

  get supabaseConfigurado(): boolean {
    return this.authService.configured;
  }

  async onSubmit(): Promise<void> {
    this.erro = '';
    this.carregando = true;
    try {
      const admin = await this.authService.login(this.email, this.password);
      if (!admin) {
        this.erro = 'Esta conta não tem permissão para acessar a administração.';
        return;
      }
      await this.router.navigate(['/admin']);
    } catch (error) {
      console.error('Erro ao entrar na administração:', error);
      this.erro = 'Não foi possível entrar. Verifique o e-mail e a senha e tente novamente.';
    } finally {
      this.carregando = false;
    }
  }
}