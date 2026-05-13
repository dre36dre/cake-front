import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout, catchError, map } from 'rxjs/operators';
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
    console.log('Enviando imagem:', file.name, 'Tamanho:', file.size, 'Type:', file.type);
    return this.http.post(`${this.apiUrl}/upload`, formData, {
      responseType: 'text'
    }).pipe(
      timeout(30000),
      map(response => {
        console.log('Resposta do upload (raw):', response);
        const url = typeof response === 'string' ? response.trim() : String(response).trim();
        console.log('URL do upload (processada):', url);
        return url;
      }),
      catchError((err: HttpErrorResponse) => {
        console.error('Erro no upload:', {
          status: err.status,
          statusText: err.statusText,
          ok: err.ok,
          message: err.message,
          error: err.error,
          url: err.url
        });
        throw err;
      })
    );
  }
}
