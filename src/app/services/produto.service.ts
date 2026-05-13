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

  constructor(private http: HttpClient) {
    console.log('ProdutoService inicializado com base de API:', this.apiUrl);
  }

  private getApiBase(): string {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname.toLowerCase();
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
      if (isLocalhost) {
        return '/api';
      }
    }
    return environment.apiUrl.replace(/\/$/, '');
  }

  listar(): Observable<Produto[]> {
    console.log('ProdutoService listando produtos em:', this.apiUrl);
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

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      timeout(10000)
    );
  }

  uploadImagem(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${this.apiUrl}/upload`, formData).pipe(
      timeout(30000)
    );
  }
}
