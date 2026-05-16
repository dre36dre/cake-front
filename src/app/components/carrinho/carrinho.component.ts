import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrinhoService } from '../../services/carrinho.service';
import { PedidoService } from '../../services/pedido.service';
import { Produto } from '../../models/produto.model';
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
  private readonly imagensPorProduto: Record<string, string> = {
    'bolo de coco': 'bolo.JPG',
    'brigadeiro': 'brigadeiros-tradicional.jpg',
    'brigadeiro recheado': 'brigadeiros-recheados.jpg',
    'mousse': 'mousse.jpg',
    'trufas': 'trufas.JPG',
    'bolo de pote': 'bolo-pote.JPG',
    'copo surpresa': 'copo-surpresa.JPG',
    'mini pudim': 'mini-pudim.JPG',
    'pudim para compartilhar': 'pudim-compartilhar.JPG',
    'pudim familia': 'pudim.JPG',
    'pudim família': 'pudim.JPG'
  };

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
    const nome = produto.name?.trim().toLowerCase() ?? '';
    const imagem = this.imagensPorProduto[nome] ?? 'bolo.JPG';

    return this.assetPath(imagem);
  }

  private assetPath(imagem: string): string {
    if (imagem.startsWith('cardapio-')) {
      return `assets/imagenshome/${imagem}`;
    }
    return `assets/imagens/${imagem}`;
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
      next: () => {
        this.abrirWhatsApp();
        this.carrinhoService.limpar();
      },
      error: (err) => {
        console.error('Falha ao enviar pedido para a API:', err);
        this.pedidoService.salvarPedidoOffline(pedido);
        alert('Não foi possível salvar o pedido na API. Pedido armazenado localmente e aberto no WhatsApp.');
        this.abrirWhatsApp();
        this.carrinhoService.limpar();
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
