import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Produto } from '../../models/produto.model';
import { ProdutoService } from '../../services/produto.service';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-produtos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './produtos-admin.component.html',
  styleUrls: ['./produtos-admin.component.css']
})
export class ProdutosAdminComponent implements OnInit {

  produtos: Produto[] = [];
  carregando = true;
  erro = '';
  mensagem = '';
  salvandoId: number | null = null;

  imagensDisponiveis = [
    'beijinho.JPG',
    'bolo-pote.JPG',
    'bolo.JPG',
    'brigadeiros-recheados.jpg',
    'brigadeiros-tradicional.jpg',
    'copo-surpresa.JPG',
    'mini-pudim.JPG',
    'mousse.jpg',
    'pudim-2.JPG',
    'pudim-compartilhar.JPG',
    'pudim.JPG',
    'trufas.JPG'
  ];

  private readonly apiUrl = environment.apiUrl.replace(/\/$/, '');

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.carregando = true;
    this.erro = '';
    this.mensagem = '';

    this.produtoService.listar().subscribe({
      next: (produtos) => {
        this.produtos = produtos.map((produto) => ({
          ...produto,
          imageUrl: this.nomeImagem(produto.imageUrl)
        }));
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.erro = 'Nao foi possivel carregar os produtos.';
        this.carregando = false;
      }
    });
  }

  salvar(produto: Produto) {
    this.salvandoId = produto.id;
    this.erro = '';
    this.mensagem = '';

    const produtoAtualizado: Produto = {
      ...produto,
      price: Number(produto.price),
      imageUrl: this.nomeImagem(produto.imageUrl)
    };

    this.produtoService.atualizar(produto.id, produtoAtualizado).subscribe({
      next: (atualizado) => {
        produto.description = atualizado.description;
        produto.price = atualizado.price;
        produto.imageUrl = this.nomeImagem(atualizado.imageUrl);
        produto.available = atualizado.available;
        this.mensagem = `${produto.name} atualizado com sucesso.`;
      },
      error: (err) => {
        console.error('Erro ao salvar produto:', err);
        this.erro = 'Nao foi possivel salvar o produto. Tente novamente.';
      },
      complete: () => {
        this.salvandoId = null;
      }
    });
  }

  imagemPreview(produto: Produto): string {
    const imagem = this.nomeImagem(produto.imageUrl);

    if (!imagem) {
      return 'assets/imagens/bolo.JPG';
    }

    if (imagem.startsWith('http://') || imagem.startsWith('https://') || imagem.startsWith('assets/')) {
      return imagem;
    }

    if (produto.imageUrl?.startsWith('/imagens/')) {
      return `${this.apiUrl}/imagens/${imagem}`;
    }

    return `assets/imagens/${imagem}`;
  }

  usarImagemLocal(event: Event, produto: Produto) {
    const img = event.target as HTMLImageElement;
    const imagem = this.nomeImagem(produto.imageUrl) || 'bolo.JPG';

    img.src = `assets/imagens/${imagem}`;
  }

  private nomeImagem(imageUrl: string): string {
    if (!imageUrl) {
      return '';
    }

    return imageUrl.split('/').pop() ?? imageUrl;
  }
}
