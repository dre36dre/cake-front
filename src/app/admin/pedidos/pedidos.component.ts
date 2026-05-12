import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { CommonModule, DatePipe } from '@angular/common';
import { catchError, finalize, of, timeout } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pedidos',
   standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  pedidos: any[] = [];
  pedidosOffline: any[] = [];
  carregando = true;
  erro = '';
  salvandoStatus: number | null = null;

  constructor(private pedidoService: PedidoService) {}

 ngOnInit() {
  console.log('PedidosComponent inicializado');
  this.carregarPedidosOffline();
  this.carregarPedidos();
}

carregarPedidos() {
  this.carregando = true;
  this.erro = '';

  this.pedidoService.listarPedidos().pipe(
    timeout(7000),
    catchError((err) => {
      console.error('Erro ao carregar pedidos:', err);
      this.erro = 'Não foi possível carregar os pedidos. Verifique se o backend está online e tente atualizar.';
      this.pedidos = [];
      return of([]);
    }),
    finalize(() => {
      this.carregando = false;
      this.carregarPedidosOffline();
    })
  ).subscribe((data: any[]) => {
    if (data.length > 0) {
      this.pedidos = data.map(p => ({
        ...p,
        dataHora: p.dataHora ? new Date(p.dataHora) : null,
        status: p.status || 'CONFIRMED',
        itens: p.itens || []
      }));
    }
  });
}

carregarPedidosOffline() {
  const offline = this.pedidoService.getPedidosOffline();
  this.pedidosOffline = offline.map(p => ({
    ...p,
    dataHora: p.dataHora ? new Date(p.dataHora) : null,
    status: p.status || 'OFFLINE',
    itens: p.itens || []
  }));
}

concluirPedido(pedido: any) {
  const pedidoId = pedido?.id || pedido?._id;
  if (!pedidoId) {
    return;
  }

  this.salvandoStatus = pedidoId;

  this.pedidoService.atualizarStatus(pedidoId, 'COMPLETED').subscribe({
    next: (pedidoAtualizado: any) => {
      pedido.status = pedidoAtualizado?.status || 'COMPLETED';
    },
    error: (err) => {
      console.error('Erro ao concluir pedido:', err);
      alert('Não foi possível concluir o pedido. Tente novamente.');
    },
    complete: () => {
      this.salvandoStatus = null;
    }
  });
}

cancelarPedido(pedido: any) {
  const pedidoId = pedido?.id || pedido?._id;
  if (!pedidoId) {
    return;
  }

  this.salvandoStatus = pedidoId;

  this.pedidoService.atualizarStatus(pedidoId, 'CANCELLED').subscribe({
    next: (pedidoAtualizado: any) => {
      pedido.status = pedidoAtualizado?.status || 'CANCELLED';
    },
    error: (err) => {
      console.error('Erro ao cancelar pedido:', err);
      alert('Não foi possível cancelar o pedido. Tente novamente.');
    },
    complete: () => {
      this.salvandoStatus = null;
    }
  });
}

getStatusLabel(status: string) {
  switch (status) {
    case 'CONFIRMED':
      return 'Confirmado';
    case 'COMPLETED':
      return 'Concluído';
    case 'CANCELED':
    case 'CANCELLED':
      return 'Cancelado';
    default:
      return status;
  }
}

}
