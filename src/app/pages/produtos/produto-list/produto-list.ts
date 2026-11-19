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

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.produtoService.getAll().subscribe({
      next: (data: Produto[]) => this.produtos = data,
      error: (err: any) => console.error('Erro ao carregar produtos', err)
    });
  }
}