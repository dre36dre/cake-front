import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProdutoService } from '../../../services/produtos.service';
import { Produto } from '../../../models/produto';

@Component({
  standalone: true,
  selector: 'app-produto-detail',
  templateUrl: './produto-detail.html',
  styleUrls: ['./produto-detail.css'],
  imports: [CommonModule]
})
export class ProdutoDetail implements OnInit {
  produto?: Produto;

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.produtoService.getAll().subscribe({
        next: (produtos: Produto[]) => {
          this.produto = produtos.find((p: Produto) => p.id === +id);
        },
        error: (err: any) => console.error('Erro ao carregar produto', err)
      });
    }
  }
}