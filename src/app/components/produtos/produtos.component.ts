import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {

  produtos: Produto[] = [];

  constructor(private produtoService: ProdutoService) {}

  usarImagemLocal(event: any, imageUrl: string) {
    event.target.src = 'assets/imagens/placeholder.jpg';
  }

  adicionar(produto: Produto) {
    console.log('Produto adicionado:', produto);
  }

  ngOnInit(): void {
    this.produtoService.listar().subscribe({
      next: (data) => {
        this.produtos = data;
        console.log('Produtos carregados:', data);
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
      }
    });
  }
}
