import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { ProdutoService } from '../../services/produtos.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { Produto } from '../../models/produto.model';
import { DEFAULT_PRODUCTS } from '../../data/default-products';
import { environment } from '../../../environments/environments';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit, OnDestroy {

  produtos: Produto[] = [];
  total = 0;
  carregando = false;
  erro = '';
  private readonly apiUrl = environment.apiUrl.replace(/\/$/, '');
  private pollingSubscription: Subscription | null = null;
  private imagemCarregando = new WeakMap<Produto, boolean>();
  private readonly imagensPorProduto: Record<string, string> = {
    'bolo de coco': 'bolo.JPG',
    'brigadeiro': 'brigadeiros-tradicional.jpg',
    'brigadeiro recheado': 'brigadeiros-recheados.jpg',
    'mousse': 'mousse.jpg',
    'trufas': 'trufas.JPG',
    'bolo de pote': 'bolo-pote.JPG',
    'copo surpresa': 'copo-surpresa.JPG',
    'mini pudim': 'mini-pudim.JPG',
    'pudim para compartilhar': 'pudim-compartilhar.JPG',
    'pudim familia': 'pudim.JPG',
    'pudim família': 'pudim.JPG'
  };

  constructor(
    private produtoService: ProdutoService,
    private carrinhoService: CarrinhoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();

   

    this.carrinhoService.carrinho$.subscribe((itens) => {
      this.total = itens.reduce((soma, produto) => soma + produto.price, 0);
    });
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }

  private carregarProdutos(): void {
    this.carregando = true;
    this.erro = '';

    this.produtoService.listar().subscribe({
      next: (data) => {
        this.produtos = Array.isArray(data) && data.length > 0 ? data : DEFAULT_PRODUCTS;
        console.log('Produtos carregados:', data);
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.produtos = DEFAULT_PRODUCTS;
        this.carregando = false;
        this.erro = '';
      },
      complete: () => {
        this.carregando = false;
      }
    });
  }

  imagemProduto(produto: Produto): string {
    if (!produto.imageUrl) {
      return this.imagemLocal(produto);
    }

    if (produto.imageUrl.startsWith('http://') || produto.imageUrl.startsWith('https://') || produto.imageUrl.startsWith('data:') || produto.imageUrl.startsWith('assets/')) {
      return produto.imageUrl;
    }

    const imagem = produto.imageUrl.startsWith('/')
      ? produto.imageUrl.split('/').pop() ?? ''
      : produto.imageUrl;

    if (imagem.startsWith('cardapio-')) {
      return this.assetPath(imagem);
    }

    if (produto.imageUrl.startsWith('/')) {
      return `${this.apiUrl}${produto.imageUrl}`;
    }

    return `${this.apiUrl}/imagens/${produto.imageUrl}`;
  }

  usarImagemLocal(event: Event, produto: Produto): void {
    const img = event.target as HTMLImageElement;
    img.src = this.imagemLocal(produto);
  }

  private imagemLocal(produto: Produto): string {
    const nome = produto.name?.trim().toLowerCase() ?? '';
    const imagem = this.imagensPorProduto[nome] ?? 'bolo.JPG';

    return this.assetPath(imagem);
  }

  private assetPath(imagem: string): string {
    if (imagem.startsWith('cardapio-')) {
      return `assets/imagenshome/${imagem}`;
    }
    return `assets/imagens/${imagem}`;
  }

  adicionar(produto: Produto): void {
    this.carrinhoService.adicionar(produto);
  }

/*  onImagemLoad(produto: Produto): void {
    this.imagemCarregando.set(produto, false);
  }

  onImagemError(produto: Produto): void {
    this.imagemCarregando.set(produto, false);
  }
*/
  isImagemCarregando(produto: Produto): boolean {
    return this.imagemCarregando.get(produto) ?? true;
  }

  finalizarCompra(): void {
    this.router.navigate(['/carrinho']);
  }
}
