import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarrinhoService } from '../../services/carrinho.service';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrinho.component.html'
})
export class CarrinhoComponent {

  carrinho: Produto[] = [];
  total = 0;

  constructor(private carrinhoService: CarrinhoService) {
    this.carrinhoService.carrinho$.subscribe(itens => {
      this.carrinho = itens;
      this.total = this.carrinhoService.getTotal();
    });
  }

  remover(index: number) {
    this.carrinhoService.remover(index);
  }

  enviarWhatsApp() {

    const mensagem = this.carrinho
      .map(p => `• ${p.name} - R$${p.price}`)
      .join('\n');

    const texto = `Pedido:\n${mensagem}\n\nTotal: R$${this.total}`;

    const url = `https://wa.me/5511973309997?text=${encodeURIComponent(texto)}`;

    window.open(url, '_blank');
  }
}