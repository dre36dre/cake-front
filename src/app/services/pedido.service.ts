import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, concatMap, from, map, of, tap, toArray } from 'rxjs';
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

  salvarPedidoOffline(pedido: any): void {
    const pedidos = this.getPedidosOffline();
    pedidos.push({
      ...pedido,
      dataHora: new Date().toISOString(),
      offline: true
    });
    localStorage.setItem('pedidosOffline', JSON.stringify(pedidos));
  }

  getPedidosOffline(): any[] {
    const data = localStorage.getItem('pedidosOffline');
    return data ? JSON.parse(data) : [];
  }

  reenviarPedidosOffline() {
    const pedidos = this.getPedidosOffline();
    if (pedidos.length === 0) {
      return of([]);
    }

    return from(pedidos).pipe(
      concatMap((pedido: any) =>
        this.enviarPedido(pedido).pipe(
          map((res: any) => ({ success: true, pedido, res })),
          catchError((err) => of({ success: false, pedido, err }))
        )
      ),
      toArray(),
      tap((results: any[]) => {
        const remaining = results.filter(result => !result.success).map(result => result.pedido);
        localStorage.setItem('pedidosOffline', JSON.stringify(remaining));
      })
    );
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
