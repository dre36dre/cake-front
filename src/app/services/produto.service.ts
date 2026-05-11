import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { Produto } from '../models/produto.model';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private apiUrl = `${this.getApiBase()}/produtos`;

  constructor(private http: HttpClient) {}

  private getApiBase(): string {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return '/api';
    }
    return environment.apiUrl.replace(/\/$/, '');
  }

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl).pipe(
      timeout(10000)
    );
  }

  create(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  atualizar(id: number, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto).pipe(
      timeout(10000)
    );
  }
}
