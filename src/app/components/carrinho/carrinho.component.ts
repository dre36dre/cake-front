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
  const numeroConfeitaria = "5511973309997"; // coloque o número da dona aqui

  // Monta a lista de produtos
  const itens = this.carrinho
    .map((p: any) => `• ${p.name} - R$ ${p.price}`)
    .join("%0A");

  // Monta a mensagem completa
  const mensagem = 
    `Novo pedido:%0A%0A` +
    `Cliente: ${this.nomeCliente}%0A` +
    ` Telefone: ${this.telefoneCliente}%0A` +
    ` Endereço: ${this.enderecoCliente}%0A%0A` +
    ` Itens:%0A${itens}%0A%0A` +
    ` Total: R$ ${this.total}`;

  // Abre o WhatsApp Web ou App
  window.open(`https://wa.me/${numeroConfeitaria}?text=${mensagem}`, "_blank");
}


} 