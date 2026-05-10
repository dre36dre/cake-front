import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {

  produtos: Produto[] = [];
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

  constructor(private produtoService: ProdutoService) {}

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

  imagemProduto(produto: Produto): string {
    if (!produto.imageUrl) {
      return this.imagemLocal(produto);
    }

    if (produto.imageUrl.startsWith('http://') || produto.imageUrl.startsWith('https://') || produto.imageUrl.startsWith('assets/')) {
      return produto.imageUrl;
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

    return `assets/imagens/${imagem}`;
  }

  adicionar(produto: Produto) {
    console.log('Produto adicionado:', produto);
  }

  // 🔹 Novo método para upload
  onFileSelected(event: any, produto: Produto) {
    const file = event.target.files[0];
    if (file) {
      this.produtoService.uploadImagem(file).subscribe({
        next: (url) => {
          produto.imageUrl = url; // Atualiza a URL no produto
          console.log('Imagem enviada, URL:', url);
        },
        error: (err) => console.error('Erro no upload:', err)
      });
    }
  }
}
