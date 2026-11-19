import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminPage {
  titulo = 'Área da Dona da Loja';
  erro = '';

  constructor(private authService: AuthService, private router: Router) {}

  async sair(): Promise<void> {
    try {
      await this.authService.logout();
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erro ao encerrar sessão:', error);
      this.erro = 'Não foi possível encerrar a sessão. Tente novamente.';
    }
  }
}
