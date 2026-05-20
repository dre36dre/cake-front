import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-alterar-senha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.css']
})
export class AlterarSenhaComponent {

  senhaAtual = '';
  novaSenha = '';
  confirmarSenha = '';
  erro = '';
  sucesso = '';
  carregando = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  alterarSenha() {
    this.erro = '';
    this.sucesso = '';

    // Validações
    if (!this.senhaAtual || !this.novaSenha || !this.confirmarSenha) {
      this.erro = 'Todos os campos são obrigatórios';
      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {
      this.erro = 'A nova senha e a confirmação não coincidem';
      return;
    }

    if (this.novaSenha.length < 6) {
      this.erro = 'A nova senha deve ter pelo menos 6 caracteres';
      return;
    }

    this.carregando = true;

    this.authService.alterarSenha(this.senhaAtual, this.novaSenha).subscribe({
      next: () => {
        this.sucesso = 'Senha alterada com sucesso!';
        this.limparCampos();
        setTimeout(() => {
          this.router.navigate(['/admin/pedidos']);
        }, 2000);
      },
      error: (err) => {
        console.error('Erro ao alterar senha no backend:', err);
        this.erro = err?.error?.message || 'Não foi possível alterar a senha. Verifique a senha atual e tente novamente.';
      },
      complete: () => {
        this.carregando = false;
      }
    });
  }

  private limparCampos() {
    this.senhaAtual = '';
    this.novaSenha = '';
    this.confirmarSenha = '';
  }

  voltar() {
    this.router.navigate(['/admin/pedidos']);
  }
}
