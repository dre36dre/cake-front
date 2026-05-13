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
  reenviandoOffline = false;

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

        this.pedidos = [];
        return of([]);
      }),

      finalize(() => {
        this.carregando = false;
        this.carregarPedidosOffline();
      })

    ).subscribe((data: any[]) => {

      if (data.length > 0) {

        this.pedidos = data.map(p => {

          let dataAjustada = null;

          if (p.dataHora) {
            dataAjustada = new Date(p.dataHora);

            // Ajusta UTC -> São Paulo
            dataAjustada.setHours(dataAjustada.getHours() - 3);
          }

          return {
            ...p,
            dataHora: dataAjustada,
            status: p.status || 'CONFIRMED',
            itens: p.itens || []
          };
        });
      }
    });
  }

  carregarPedidosOffline() {

    const offline = this.pedidoService.getPedidosOffline();

    this.pedidosOffline = offline.map(p => {

      let dataAjustada = null;

      if (p.dataHora) {
        dataAjustada = new Date(p.dataHora);

        // Ajusta UTC -> São Paulo
        dataAjustada.setHours(dataAjustada.getHours() - 3);
      }

      return {
        ...p,
        dataHora: dataAjustada,
        status: p.status || 'OFFLINE',
        itens: p.itens || []
      };
    });
  }

  reenviarPedidosOffline() {

    if (this.pedidosOffline.length === 0) {
      alert('Não há pedidos offline para reenviar.');
      return;
    }

    this.reenviandoOffline = true;

    this.pedidoService.reenviarPedidosOffline().pipe(

      finalize(() => {
        this.reenviandoOffline = false;
        this.carregarPedidosOffline();
        this.carregarPedidos();
      })

    ).subscribe((results: any[]) => {

      const enviados = results.filter(r => r.success).length;
      const naoEnviados = results.length - enviados;

      alert(`Pedidos reenviados: ${enviados}. Não reenviados: ${naoEnviados}.`);
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