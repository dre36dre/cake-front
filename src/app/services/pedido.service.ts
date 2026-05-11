import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private api = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  enviarPedido(pedido: any) {
    return this.http.post(this.api, pedido);
  }

  listarPedidos() {
    return this.http.get<any[]>(this.api);
  }

  atualizarPedido(id: string | number, dados: any) {
    return this.http.patch(`${this.api}/${id}`, dados);
  }

  atualizarStatus(id: string | number, status: string) {
    return this.atualizarPedido(id, { status });
  }
}
