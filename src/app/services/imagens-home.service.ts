import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environments';

export interface ImagemHome {
  id?: number;
  arquivo: string;
  titulo: string;
  ordem?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ImagensHomeService {
  private readonly storageKey = 'imagensHome';
  private readonly apiUrl = this.getApiBase();
  private readonly imagensPadrao: ImagemHome[] = [
    { id: 1, arquivo: 'home.JPG', titulo: 'Home', ordem: 1 },
    { id: 2, arquivo: 'cardapio-doces.JPG', titulo: 'Cardapio Doces', ordem: 2 },
    { id: 3, arquivo: 'cardapio-festa.JPG', titulo: 'Cardapio Festa', ordem: 3 },
    { id: 4, arquivo: 'cardapio-pudim.JPG', titulo: 'Cardapio Pudim', ordem: 4 },
    { id: 5, arquivo: 'cardapio-pudim-editada.JPG', titulo: 'Cardapio Pudim Editado', ordem: 5 },
    { id: 6, arquivo: 'brigadeiro-home.JPG', titulo: 'Brigadeiro', ordem: 6 },
    { id: 7, arquivo: 'brigadeiro-home-2.JPG', titulo: 'Brigadeiro 2', ordem: 7 },
    { id: 8, arquivo: 'trufas.JPG', titulo: 'Trufas', ordem: 8 },
    { id: 9, arquivo: 'beijinho.JPG', titulo: 'Beijinho', ordem: 9 },
    { id: 10, arquivo: 'bolo.JPG', titulo: 'Bolo', ordem: 10 },
    { id: 11, arquivo: 'copo-surpresa.JPG', titulo: 'Copo Surpresa', ordem: 11 },
    { id: 12, arquivo: 'pudim.JPG', titulo: 'Pudim', ordem: 12 },
    { id: 13, arquivo: 'pudim-2.JPG', titulo: 'Pudim 2', ordem: 13 }
  ];

  constructor(private http: HttpClient) {}

  private getApiBase(): string {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname.toLowerCase();
      const isLocalhost =
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '[::1]';

      if (isLocalhost) {
        return '/api';
      }
    }

    return environment.apiUrl.replace(/\/$/, '');
  }

  listar(): Observable<ImagemHome[]> {
    const salvas = this.lerLocalStorage();
    return of(salvas.length > 0 ? salvas : this.imagensPadrao.map((imagem) => ({ ...imagem })));
  }

  salvar(imagens: ImagemHome[]): Observable<{ success: boolean }> {
    const normalizadas = imagens
      .filter((imagem) => imagem.arquivo?.trim() || imagem.titulo?.trim())
      .map((imagem, index) => ({
        ...imagem,
        id: imagem.id ?? Date.now() + index,
        arquivo: imagem.arquivo?.trim() ?? '',
        titulo: imagem.titulo?.trim() || imagem.arquivo?.trim() || `Imagem ${index + 1}`,
        ordem: index + 1
      }));

    localStorage.setItem(this.storageKey, JSON.stringify(normalizadas));
    return of({ success: true });
  }

  uploadImagem(file: File): Observable<{ arquivo: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/imagens/upload`, formData, {
      responseType: 'text'
    }).pipe(
      map((url) => ({ arquivo: url.trim() })),
      catchError(() => this.arquivoComoDataUrl(file))
    );
  }

  getImagemSrc(arquivo: string): string {
    if (!arquivo) {
      return 'assets/imagenshome/home.JPG';
    }

    if (arquivo.startsWith('http://') || arquivo.startsWith('https://') || arquivo.startsWith('data:') || arquivo.startsWith('assets/')) {
      return arquivo;
    }

    return `assets/imagenshome/${arquivo}`;
  }

  resetar(): Observable<{ success: boolean }> {
    localStorage.removeItem(this.storageKey);
    return of({ success: true });
  }

  private lerLocalStorage(): ImagemHome[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        return [];
      }

      const imagens = JSON.parse(raw);
      return Array.isArray(imagens) ? imagens : [];
    } catch {
      return [];
    }
  }

  private arquivoComoDataUrl(file: File): Observable<{ arquivo: string }> {
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.onload = () => {
        observer.next({ arquivo: reader.result as string });
        observer.complete();
      };
      reader.onerror = () => observer.error(reader.error);
      reader.readAsDataURL(file);
    });
  }
}
