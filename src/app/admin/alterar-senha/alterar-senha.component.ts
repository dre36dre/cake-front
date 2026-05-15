import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

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

    if (!this.authService.validarSenhaAdminLocal(this.senhaAtual)) {
      this.erro = 'Senha atual incorreta';
      return;
    }

    this.carregando = true;

    // Tentar alterar no backend primeiro
    this.authService.alterarSenha(this.senhaAtual, this.novaSenha).subscribe({
      next: () => {
        this.authService.salvarSenhaAdminLocal(this.novaSenha);
        this.sucesso = 'Senha alterada com sucesso!';
        this.limparCampos();
        setTimeout(() => {
          this.router.navigate(['/admin/pedidos']);
        }, 2000);
      },
      error: (err) => {
        console.error('Erro ao alterar senha no backend:', err);
        // Fallback: alterar localmente se backend falhar
        this.alterarSenhaLocal();
      },
      complete: () => {
        this.carregando = false;
      }
    });
  }

  private alterarSenhaLocal() {
    this.authService.salvarSenhaAdminLocal(this.novaSenha);
    this.sucesso = 'Senha alterada com sucesso! (modo offline)';
    this.limparCampos();
    setTimeout(() => {
      this.router.navigate(['/admin/pedidos']);
    }, 2000);
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
