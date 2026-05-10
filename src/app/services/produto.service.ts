import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto.model';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private apiUrl = `${environment.apiUrl}/produtos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  create(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  // 🔹 Aqui entra o método de upload
  uploadImagem(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(`${this.apiUrl}/upload`, formData);
  }
}
