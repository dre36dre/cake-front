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

}
