import { Component, OnInit } from '@angular/core'
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-orders',
  template: ''
})
export class OrdersComponent implements OnInit {

  pedidos: any[] = []
  carregando = true

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadPedidos()
  }

  loadPedidos() {
    this.carregando = true
    this.orderService.listar().subscribe({
      next: (data: any) => {
        this.pedidos = data
        this.carregando = false
      },
      error: () => {
        this.carregando = false
      }
    })
  }

  atualizarStatus(pedido: any, novoStatus: string) {
    this.orderService.atualizar(pedido.id, { status: novoStatus })
      .subscribe(() => this.loadPedidos())
  }

  deletarPedido(id: number) {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) return

    this.orderService.deletar(id)
      .subscribe(() => this.loadPedidos())
  }
}
