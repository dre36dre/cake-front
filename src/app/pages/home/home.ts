import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Produto } from '../../models/produto';
import { ProdutoService } from '../../services/produtos.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomePage implements OnInit {
  categoriasFallback = [
    { titulo: 'Doces artesanais', icone: '🍬', estilo: 'doces' },
    { titulo: 'Cardápio para festas', icone: '🎉', estilo: 'festas' },
    { titulo: 'Pudins', icone: '🍮', estilo: 'pudins' },
    { titulo: 'Bolos e sobremesas', icone: '🧁', estilo: 'bolos' }
  ];
  produtos: Produto[] = [];
  erro = '';

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.produtoService.listar().subscribe({
      next: (produtos) => {
        this.produtos = produtos.filter((produto) => produto.available).slice(0, 4);
      },
      error: (error) => {
        console.error('Erro ao carregar produtos da vitrine:', error);
        this.erro = 'Não foi possível carregar os produtos agora.';
      }
    });
  }

  imagemFalhou(event: Event): void {
    const imagem = event.target as HTMLImageElement;
    imagem.hidden = true;
    imagem.parentElement?.classList.add('sem-imagem');
  }
}
