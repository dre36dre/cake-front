import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrinhoService } from '../../services/carrinho.service';
import { Produto } from '../../models/produto.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrinho.component.html'
})
export class CarrinhoComponent {

  carrinho: Produto[] = [];
  total = 0;

  nomeCliente = '';
  telefoneCliente = '';
  enderecoCliente='';

  constructor(private carrinhoService: CarrinhoService, private http: HttpClient) {
    this.carrinhoService.carrinho$.subscribe(itens => {
      this.carrinho = itens;
      this.total = this.carrinhoService.getTotal();
    });
  }

  remover(i: number) {
    this.carrinhoService.remover(i);
  }

  enviarWhatsApp() {
  const pedido = {
    nome: this.nomeCliente,
    telefone: this.telefoneCliente,
    endereco: this.enderecoCliente,
    total: this.total,
    itens: this.carrinho.map(p => ({
      produtoId: p.id,
      nome: p.name,
      preco: p.price
    }))
  };

  this.http.post('http://localhost:8080/api/pedidos/novo', pedido)
    .subscribe(() => {
      alert('Pedido enviado com sucesso!');
    });
}

} 