import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Produto } from '../models/produto.model';

@Injectable({ providedIn: 'root' })
export class CarrinhoService {

  private itens: Produto[] = [];
  private subject = new BehaviorSubject<Produto[]>([]);

  carrinho$ = this.subject.asObservable();

  adicionar(produto: Produto) {
    this.itens.push(produto);
    this.subject.next(this.itens);
  }

  remover(index: number) {
    this.itens.splice(index, 1);
    this.subject.next(this.itens);
  }

  limpar() {
    this.itens = [];
    this.subject.next(this.itens);
  }

  getTotal() {
    return this.itens.reduce((t, p) => t + p.price, 0);
  }
}
//