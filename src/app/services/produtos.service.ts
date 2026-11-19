import { Injectable } from '@angular/core';
import { defer, from, map, Observable } from 'rxjs';
import { Produto } from '../models/produto';
import { SupabaseService } from './supabase.service';
import { Database } from '../models/database';
import { isLocalDemoMode } from './local-demo-mode';
import { LocalDemoDataService, LocalProduct } from './local-demo-data.service';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  constructor(
    private supabase: SupabaseService,
    private localData: LocalDemoDataService
  ) {}

  getAll(): Observable<Produto[]> {
    if (!this.supabase.configured && isLocalDemoMode()) {
      return defer(() => from(this.localData.listProducts())).pipe(
        map(products => products.map(productFromLocalRow))
      );
    }

    return defer(() =>
      from(this.supabase.getClient().from('products').select('*').order('created_at', { ascending: false }))
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []).map(productFromRow);
      })
    );
  }

  create(produto: Produto): Observable<Produto> {
    if (!this.supabase.configured && isLocalDemoMode()) {
      return defer(() => from(this.localData.saveProduct(productToLocalRow(produto)))).pipe(
        map(productFromLocalRow)
      );
    }

    return defer(() =>
      from(this.supabase.getClient().from('products').insert(productToRow(produto)).select().single())
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return productFromRow(data);
      })
    );
  }

  listar(): Observable<Produto[]> {
    return this.getAll().pipe(map(produtos => produtos.filter(produto => produto.available)));
  }

  getById(id: number): Observable<Produto | null> {
    if (!this.supabase.configured && isLocalDemoMode()) {
      return defer(() => from(this.localData.getProduct(id))).pipe(
        map(row => row ? productFromLocalRow(row) : null)
      );
    }

    return defer(() =>
      from(this.supabase.getClient().from('products').select('*').eq('id', id).maybeSingle())
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data ? productFromRow(data) : null;
      })
    );
  }

  salvar(produto: Produto): Observable<Produto> {
    if (!this.supabase.configured && isLocalDemoMode()) {
      return defer(() => from(this.localData.saveProduct(productToLocalRow(produto)))).pipe(
        map(productFromLocalRow)
      );
    }

    if (produto.id) {
      return defer(() =>
        from(
          this.supabase.getClient()
            .from('products')
            .update(productToRow(produto))
            .eq('id', produto.id!)
            .select()
            .single()
        )
      ).pipe(
        map(({ data, error }) => {
          if (error) throw error;
          return productFromRow(data);
        })
      );
    }
    return this.create(produto);
  }

  excluir(id: number): Observable<void> {
    if (!this.supabase.configured && isLocalDemoMode()) {
      return defer(() => from(this.localData.deleteProduct(id)));
    }

    return defer(() =>
      from(this.supabase.getClient().from('products').delete().eq('id', id))
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }

  uploadImage(file: File, folder: 'products' | 'home'): Promise<string> {
    if (!this.supabase.configured && isLocalDemoMode()) {
      return this.localData.fileAsDataUrl(file);
    }

    return this.supabase.uploadImage(file, folder);
  }
}

function productFromRow(row: Database['public']['Tables']['products']['Row']): Produto {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    available: row.available,
    imageUrl: row.image_url
  };
}

function productFromLocalRow(row: LocalProduct): Produto {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    available: row.available,
    imageUrl: row.image_url
  };
}

function productToRow(produto: Produto): Database['public']['Tables']['products']['Insert'] {
  return {
    name: produto.name.trim(),
    description: produto.description.trim(),
    price: Number(produto.price),
    available: produto.available,
    image_url: produto.imageUrl || null
  };
}

function productToLocalRow(produto: Produto): LocalProduct {
  return {
    id: produto.id,
    name: produto.name.trim(),
    description: produto.description.trim(),
    price: Number(produto.price),
    available: produto.available,
    image_url: produto.imageUrl || null,
    created_at: new Date().toISOString()
  };
}