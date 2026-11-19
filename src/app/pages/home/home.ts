import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Produto } from '../../models/produto';
import { HomeImage } from '../../models/home-image';
import { ProdutoService } from '../../services/produtos.service';
import { HomeImagesService } from '../../services/home-images.service';

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
  imagensHome: HomeImage[] = [];
  erro = '';

  constructor(
    private produtoService: ProdutoService,
    private imagensService: HomeImagesService
  ) {}

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
    this.imagensService.listar().subscribe({
      next: imagens => this.imagensHome = imagens,
      error: error => {
        console.error('Erro ao carregar imagens da Home:', error);
        this.erro = 'Não foi possível carregar todas as imagens da vitrine.';
      }
    });
  }

  imagemFalhou(event: Event): void {
    const imagem = event.target as HTMLImageElement;
    imagem.hidden = true;
    imagem.parentElement?.classList.add('sem-imagem');
  }
}
