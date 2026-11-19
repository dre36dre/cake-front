// src/app/pages/produtos/produto-list/produto-list.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProdutoService } from '../../../services/produtos.service';
import { Produto } from '../../../models/produto';

@Component({
  standalone: true,
  selector: 'app-produto-list',
  templateUrl: './produto-list.html',
  styleUrls: ['./produto-list.css'],
  imports: [CommonModule, RouterLink]
})
export class ProdutoList implements OnInit {
  produtos: Produto[] = [];
  carregando = true;
  erro = '';

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.produtoService.getAll().subscribe({
      next: data => {
        this.produtos = data;
        this.erro = '';
        this.carregando = false;
      },
      error: error => {
        console.error('Erro ao carregar produtos:', error);
        this.erro = error instanceof Error ? error.message : 'Não foi possível carregar os produtos.';
        this.carregando = false;
      }
    });
  }

  excluir(produto: Produto): void {
    if (!produto.id || !confirm(`Excluir "${produto.name}"?`)) return;
    this.produtoService.excluir(produto.id).subscribe({
      next: () => this.carregar(),
      error: error => {
        console.error('Erro ao excluir produto:', error);
        this.erro = error instanceof Error ? error.message : 'Não foi possível excluir o produto.';
      }
    });
  }
}