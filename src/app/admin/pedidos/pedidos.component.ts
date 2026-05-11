import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { CommonModule, DatePipe } from '@angular/common';
import { finalize, timeout } from 'rxjs';

@Component({
  selector: 'app-pedidos',
   standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  pedidos: any[] = [];
  carregando = true;
  erro = '';
  salvandoStatus: number | null = null;

  constructor(private pedidoService: PedidoService) {}

 ngOnInit() {
  this.carregarPedidos();
}

carregarPedidos() {
  this.carregando = true;
  this.erro = '';

  this.pedidoService.listarPedidos().pipe(
    timeout(15000),
    finalize(() => {
      this.carregando = false;
    })
  ).subscribe({
    next: (data) => {
      this.pedidos = data.map(p => ({
        ...p,
        dataHora: p.dataHora ? new Date(p.dataHora) : null,
        status: p.status || 'CONFIRMED',
        itens: p.itens || []
      }));
    },
    error: (err) => {
      console.error('Erro ao carregar pedidos:', err);
      this.erro = 'Nao foi possivel carregar os pedidos. Verifique se o backend do Railway esta online e tente atualizar.';
    }
  });
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
