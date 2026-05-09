import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrinhoService } from '../../services/carrinho.service';
import { PedidoService } from '../../services/pedido.service';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrinho.component.html'
})
export class CarrinhoComponent implements OnInit {

  carrinho: Produto[] = [];
  total: number = 0;

  nomeCliente: string = '';
  telefoneCliente: string = '';
  enderecoCliente: string = '';

  constructor(
    private carrinhoService: CarrinhoService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit() {
    this.carrinhoService.carrinho$.subscribe(lista => {
      this.carrinho = lista;
      this.total = lista.reduce((t, p) => t + p.price, 0);
    });
  }

  remover(i: number) {
    this.carrinhoService.remover(i);
  }

  usarImagemLocal(event: Event, imageUrl: string) {
    const img = event.target as HTMLImageElement;
    img.src = `assets/produto/${imageUrl}`;
  }

  enviarWhatsApp() {
    if (!this.nomeCliente || !this.telefoneCliente || !this.enderecoCliente || this.carrinho.length === 0) {
      alert('Preencha os dados do cliente e adicione pelo menos um produto.');
      return;
    }

    const pedido = {
      nomeCliente: this.nomeCliente,
      telefoneCliente: this.telefoneCliente,
      enderecoCliente: this.enderecoCliente,
      total: this.total,
      dataHora: new Date().toISOString(),
      itens: this.carrinho.map((p: Produto) => ({
        nomeProduto: p.name,
        preco: p.price,
        quantidade: 1,
        subTotal: p.price
      }))
    };

    this.pedidoService.enviarPedido(pedido).subscribe({
      next: () => {
        this.abrirWhatsApp();
        this.carrinhoService.limpar();
      },
      error: () => {
        alert('Não foi possível salvar o pedido na API. Verifique se o backend está online e se /pedidos está liberado.');
      }
    });
  }

  private abrirWhatsApp() {
    const numeroConfeitaria = "5511954203620";

    const itens = this.carrinho
      .map((p: Produto) => `• ${p.name} - R$ ${p.price}`)
      .join("%0A");

    const mensagem =
      `Novo pedido:%0A%0A` +
      `Cliente: ${this.nomeCliente}%0A` +
      `Telefone: ${this.telefoneCliente}%0A` +
      `Endereço: ${this.enderecoCliente}%0A%0A` +
      `Itens:%0A${itens}%0A%0A` +
      `Total: R$ ${this.total}`;

    window.open(`https://wa.me/${numeroConfeitaria}?text=${mensagem}`, "_blank");
  }
}
