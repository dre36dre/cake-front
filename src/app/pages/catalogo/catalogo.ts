import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ProdutoService } from '../../services/produtos.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { Produto } from '../../models/produto';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css']
})
export class Catalogo {
  produtos = signal<Produto[]>([]);
  filtro = signal('');
  carregando = true;
  erro = '';

  constructor(
    private service: ProdutoService,
    readonly carrinho: CarrinhoService
  ) {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.service.listar().subscribe({
      next: (lista: Produto[]) => {
        this.produtos.set(lista);
        this.carregando = false;
        this.erro = '';
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.erro = 'Não foi possível carregar o cardápio. Tente novamente mais tarde.';
        this.carregando = false;
      }
    });
  }

  adicionar(produto: Produto) {
    this.carrinho.adicionar(produto);
  }

  imagemFalhou(event: Event): void {
    const imagem = event.target as HTMLImageElement;
    imagem.hidden = true;
    imagem.parentElement?.classList.add('sem-imagem');
  }

  get produtosFiltrados(): Produto[] {
    const termo = this.filtro().toLowerCase();
    return this.produtos().filter(p =>
      p.name.toLowerCase().includes(termo)
    );
  }
}