import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  standalone: true,
  selector: 'app-carrinho',
  templateUrl: './carrinho.html',
  styleUrls: ['./carrinho.css'],
  imports: [CommonModule, FormsModule, RouterLink]
})
export class Carrinho {
  nome = '';
  telefone = '';
  endereco = '';
  observacoes = '';
  revisando = false;

  constructor(readonly carrinho: CarrinhoService) {}

  alterarQtd(produtoId: number | undefined, event: Event): void {
    if (produtoId === undefined) {
      return;
    }

    const input = event.target as HTMLInputElement;
    this.carrinho.alterarQtd(produtoId, input.valueAsNumber);
  }

  remover(produtoId: number | undefined): void {
    if (produtoId !== undefined) {
      this.carrinho.remover(produtoId);
    }
  }

  confirmarPedido(): void {
    const itens = this.carrinho.itens();
    if (!itens.length || typeof window === 'undefined') {
      return;
    }

    const linhasItens = itens
      .map(({ produto, qtd }) => `- ${qtd} x ${produto.name} — ${(produto.price * qtd).toFixed(2)}`)
      .join('\n');
    const mensagem = [
      'Olá! Gostaria de fazer um pedido:',
      '',
      `Nome: ${this.nome}`,
      `Telefone: ${this.telefone}`,
      `Endereço: ${this.endereco}`,
      `Observações: ${this.observacoes || '-'}`,
      '',
      'Itens:',
      linhasItens,
      '',
      `Total: ${this.carrinho.total().toFixed(2)}`
    ].join('\n');

    window.open(
      `https://wa.me/5511954203620?text=${encodeURIComponent(mensagem)}`,
      '_blank',
      'noopener,noreferrer'
    );
    this.revisando = false;
  }
}
