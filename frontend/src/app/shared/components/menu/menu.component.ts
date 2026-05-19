import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../../core/services/produtos.service';
import { CarrinhoService } from '../../../core/services/carrinho.service';
import { Produto } from '../../../core/interfaces/produto.model';
import { assetPath, imagemLocalPorProduto } from '../../../core/data/produto-imagens';
import { environment } from '../../../../environments/environments';

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
    return imagemLocalPorProduto(produto);
  }

  private assetPath(imagem: string): string {
    return assetPath(imagem);
  }
}
