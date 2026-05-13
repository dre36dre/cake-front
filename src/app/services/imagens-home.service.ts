import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ImagemHome {
  arquivo: string;
  titulo: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImagensHomeService {
  private apiUrl = 'https://cake-api-production.up.railway.app'; // ou local

  constructor(private http: HttpClient) {}

  listar(): Observable<ImagemHome[]> {
    // Por enquanto, simular com localStorage
    return new Observable(observer => {
      const imagens = JSON.parse(localStorage.getItem('imagensHome') || '[]');
      observer.next(imagens);
      observer.complete();
    });
  }

  salvar(imagens: ImagemHome[]): Observable<any> {
    // Salvar no localStorage por enquanto
    localStorage.setItem('imagensHome', JSON.stringify(imagens));
    return new Observable(observer => {
      observer.next({ success: true });
      observer.complete();
    });
  }

  uploadImagem(file: File): Observable<{ arquivo: string }> {
    const formData = new FormData();
    formData.append('file', file);
    // Assumir endpoint /upload-imagem ou algo
    return this.http.post<{ arquivo: string }>(`${this.apiUrl}/upload-imagem`, formData);
  }
}