import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private api = `${this.getApiBase()}/pedidos`;

  private getApiBase(): string {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return '/api';
    }
    return environment.apiUrl.replace(/\/$/, '');
  }

  constructor(private http: HttpClient) {}

  enviarPedido(pedido: any) {
    return this.http.post(this.api, pedido);
  }

  listarPedidos() {
    return this.http.get<any[]>(this.api);
  }

  atualizarPedido(id: string | number, dados: any) {
    return this.http.patch(`${this.api}/${id}`, dados).pipe(
      catchError((err) => {
        if (err?.status === 405 || err?.status === 404 || err?.status === 400) {
          return this.http.put(`${this.api}/${id}`, dados);
        }
        throw err;
      })
    );
  }

  atualizarStatus(id: string | number, status: string) {
    return this.atualizarPedido(id, { status });
  }
}
