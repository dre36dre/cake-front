import { Injectable, signal } from '@angular/core';
import { Produto } from '../models/produto';

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  itens = signal<{ produto: Produto, qtd: number }[]>([]);

  adicionar(produto: Produto) {
    const lista = this.itens();
    const existente = lista.find(i => i.produto.id === produto.id);

    if (existente) {
      existente.qtd++;
      this.itens.set([...lista]);
    } else {
      this.itens.set([...lista, { produto, qtd: 1 }]);
    }
  }

  remover(produtoId: number) {
    this.itens.set(this.itens().filter(i => i.produto.id !== produtoId));
  }

  alterarQtd(produtoId: number, qtd: number) {
    if (!Number.isInteger(qtd) || qtd < 1) {
      this.remover(produtoId);
      return;
    }

    this.itens.update(lista =>
      lista.map(i => i.produto.id === produtoId ? { ...i, qtd } : i)
    );
  }

  limpar() {
    this.itens.set([]);
  }

  total(): number {
    return this.itens().reduce((soma, i) => soma + i.produto.price * i.qtd, 0);
  }
}