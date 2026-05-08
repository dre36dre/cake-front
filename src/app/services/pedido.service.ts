import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private api = 'http://localhost:8080/pedidos';

  constructor(private http: HttpClient) {}

  enviarPedido(pedido: any) {
    return this.http.post(this.api, pedido);
  }

  listarPedidos() {
    return this.http.get<any[]>(this.api);
  }
}
