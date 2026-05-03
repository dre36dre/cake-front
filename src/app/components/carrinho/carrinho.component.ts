import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrinhoService } from '../../services/carrinho.service';
import { Produto } from '../../models/produto.model';

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

  constructor(private carrinhoService: CarrinhoService) {
    this.carrinhoService.carrinho$.subscribe(itens => {
      this.carrinho = itens;
      this.total = this.carrinhoService.getTotal();
    });
  }

  remover(i: number) {
    this.carrinhoService.remover(i);
  }

  enviarWhatsApp() {

    const itens = this.carrinho
      .map(p => `• ${p.name} - R$${p.price}`)
      .join('\n');

    const texto = `
🧾 Pedido

👤 ${this.nomeCliente}
📞 ${this.telefoneCliente}
    ${this.enderecoCliente}
${itens}

💰 Total: R$${this.total}
`;

    const url = `https://wa.me/5511NUMERO_DA_DONA?text=${encodeURIComponent(texto)}`;

    window.location.href = url;
  }
}