import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {

  produtos: Produto[] = [];

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
}