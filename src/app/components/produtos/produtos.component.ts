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

  usarImagemLocal(event: any, imageUrl: string) {
    event.target.src = 'assets/imagens/placeholder.jpg';
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
