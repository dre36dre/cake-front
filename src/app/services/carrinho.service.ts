import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  private carrinho: Produto[] = [];
  private carrinhoSubject = new BehaviorSubject<Produto[]>([]);

  carrinho$ = this.carrinhoSubject.asObservable();

  adicionar(produto: Produto) {
    this.carrinho.push(produto);
    this.carrinhoSubject.next(this.carrinho);
  }

  remover(index: number) {
    this.carrinho.splice(index, 1);
    this.carrinhoSubject.next(this.carrinho);
  }

  getTotal(): number {
    return this.carrinho.reduce((total, p) => total + p.price, 0);
  }

  limpar() {
    this.carrinho = [];
    this.carrinhoSubject.next(this.carrinho);
  }
}