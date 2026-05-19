import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrinhoService } from '../../core/services/carrinho.service';
import { PedidoService } from '../../core/services/pedido.service';
import { Produto } from '../../core/interfaces/produto.model';
import { assetPath, imagemLocalPorProduto } from '../../core/data/produto-imagens';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})

export class CarrinhoComponent implements OnInit {

  carrinho: Produto[] = [];
  total: number = 0;
  private readonly apiUrl = environment.apiUrl.replace(/\/$/, '');

  nomeCliente: string = '';
  telefoneCliente: string = '';
  enderecoCliente: string = '';
  comentarioCliente: string = '';

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

  imagemProduto(produto: Produto): string {
    if (!produto.imageUrl) {
      return this.imagemLocal(produto);
    }

    if (produto.imageUrl.startsWith('http://') || produto.imageUrl.startsWith('https://') || produto.imageUrl.startsWith('data:') || produto.imageUrl.startsWith('assets/')) {
      return produto.imageUrl;
    }

    const imagem = produto.imageUrl.startsWith('/')
      ? produto.imageUrl.split('/').pop() ?? ''
      : produto.imageUrl;

    if (imagem.startsWith('cardapio-')) {
      return this.assetPath(imagem);
    }

    if (produto.imageUrl.startsWith('/')) {
      return `${this.apiUrl}${produto.imageUrl}`;
    }

    return `${this.apiUrl}/imagens/${produto.imageUrl}`;
  }

  usarImagemLocal(event: Event, produto: Produto) {
    const img = event.target as HTMLImageElement;

    img.src = this.imagemLocal(produto);
  }

  private imagemLocal(produto: Produto): string {
    return imagemLocalPorProduto(produto);
  }

  private assetPath(imagem: string): string {
    return assetPath(imagem);
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
      comentarioCliente: this.comentarioCliente,
      total: this.total,
      itens: this.carrinho.map((p: Produto) => ({
        nomeProduto: p.name,
        preco: p.price,
        quantidade: 1,
        subTotal: p.price
      }))
    };

    this.pedidoService.enviarPedido(pedido).subscribe({
   next: (res: any) => {

  console.log('Pedido salvo:', res);

  alert('Pedido enviado com sucesso!');

  this.abrirWhatsApp();

  this.carrinhoService.limpar();

},
     error: (err) => {

  console.error('Erro real:', err);

  alert('Erro ao enviar pedido.');

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
      `Endereço: ${this.enderecoCliente}%0A` +
      `Comentário: ${this.comentarioCliente || '-'}%0A%0A` +
      `Itens:%0A${itens}%0A%0A` +
      `Total: R$ ${this.total}`;

    window.open(`https://wa.me/${numeroConfeitaria}?text=${mensagem}`, "_blank");
  }
}
