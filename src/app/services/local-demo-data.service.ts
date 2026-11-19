import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface LocalProduct {
  id?: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image_url: string | null;
  created_at: string;
}

export interface LocalHomeImage {
  id?: number;
  title: string;
  image_url: string;
  position: number;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class LocalDemoDataService {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private database?: Promise<IDBDatabase>;

  listProducts(): Promise<LocalProduct[]> {
    return this.request('products', 'readonly', store => store.getAll());
  }

  getProduct(id: number): Promise<LocalProduct | undefined> {
    return this.request('products', 'readonly', store => store.get(id));
  }

  saveProduct(product: LocalProduct): Promise<LocalProduct> {
    const record = { ...product, created_at: product.created_at || new Date().toISOString() };
    return this.request('products', 'readwrite', store => product.id ? store.put(record) : store.add(record))
      .then(id => ({ ...record, id: Number(id) }));
  }

  deleteProduct(id: number): Promise<void> {
    return this.request('products', 'readwrite', store => store.delete(id)).then(() => undefined);
  }

  listHomeImages(): Promise<LocalHomeImage[]> {
    return this.request('home_images', 'readonly', store => store.getAll())
      .then(images => images.sort((a, b) => a.position - b.position || a.created_at.localeCompare(b.created_at)));
  }

  saveHomeImage(image: LocalHomeImage): Promise<LocalHomeImage> {
    const record = { ...image, created_at: new Date().toISOString() };
    return this.request('home_images', 'readwrite', store => store.add(record))
      .then(id => ({ ...record, id: Number(id) }));
  }

  deleteHomeImage(id: number): Promise<void> {
    return this.request('home_images', 'readwrite', store => store.delete(id)).then(() => undefined);
  }

  fileAsDataUrl(file: File): Promise<string> {
    if (!this.browser) return Promise.reject(new Error('O modo de teste funciona somente no navegador local.'));

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject(new Error('Não foi possível ler o arquivo de imagem.'));
      };
      reader.onerror = () => reject(reader.error ?? new Error('Não foi possível ler o arquivo de imagem.'));
      reader.readAsDataURL(file);
    });
  }

  private request<T>(
    storeName: 'products' | 'home_images',
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    if (!this.browser) {
      return Promise.reject(new Error('O modo de teste funciona somente no navegador local.'));
    }

    return this.openDatabase().then(database => new Promise<T>((resolve, reject) => {
      const transaction = database.transaction(storeName, mode);
      let result: T;
      let requestSucceeded = false;
      const request = operation(transaction.objectStore(storeName));

      request.onsuccess = () => {
        result = request.result;
        requestSucceeded = true;
      };
      request.onerror = () => reject(request.error ?? new Error('Falha ao salvar dados de teste.'));
      transaction.oncomplete = () => {
        if (requestSucceeded) resolve(result);
        else reject(new Error('A operação local não foi concluída.'));
      };
      transaction.onerror = () => reject(transaction.error ?? new Error('Falha ao salvar dados de teste.'));
      transaction.onabort = () => reject(transaction.error ?? new Error('A gravação de teste foi cancelada.'));
    }));
  }

  private openDatabase(): Promise<IDBDatabase> {
    if (!this.browser) return Promise.reject(new Error('O modo de teste funciona somente no navegador local.'));
    if (!('indexedDB' in window)) {
      return Promise.reject(new Error('Este navegador não oferece armazenamento local para o modo de teste.'));
    }
    if (!this.database) {
      const database = new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('cake-web-local-demo', 1);
        request.onupgradeneeded = () => {
          const database = request.result;
          database.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
          database.createObjectStore('home_images', { keyPath: 'id', autoIncrement: true });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('Não foi possível abrir o armazenamento local.'));
      });
      this.database = database.catch(error => {
        this.database = undefined;
        throw error;
      });
    }
    return this.database;
  }
}
