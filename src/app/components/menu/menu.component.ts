import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produtos.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { Produto } from '../../models/produto.model';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  produtos: Produto[] = [];
  imagemCarregando = new Map<Produto, boolean>();
  private readonly apiUrl = environment.apiUrl.replace(/\/$/, '');
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
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit() {
    this.produtoService.listar().subscribe(res => {
      this.produtos = res;
    });
  }

  adicionar(p: Produto) {
    this.carrinhoService.adicionar(p);
  }

  onImagemLoad(produto: Produto) {
    this.imagemCarregando.set(produto, false);
  }

  onImagemError(produto: Produto) {
    this.imagemCarregando.set(produto, false);
  }

  isImagemCarregando(produto: Produto): boolean {
    return this.imagemCarregando.get(produto) ?? true;
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

  usarImagemLocal(event: Event, produto: Produto) {
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
}
