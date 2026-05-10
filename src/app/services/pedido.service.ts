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
}
