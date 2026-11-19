import { Injectable } from '@angular/core';
import { defer, from, map, Observable } from 'rxjs';
import { Produto } from '../models/produto';
import { SupabaseService } from './supabase.service';
import { Database } from '../models/database';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  constructor(private supabase: SupabaseService) {}

  getAll(): Observable<Produto[]> {
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
    return defer(() =>
      from(this.supabase.getClient().from('products').delete().eq('id', id))
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }

  uploadImage(file: File, folder: 'products' | 'home'): Promise<string> {
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

function productToRow(produto: Produto): Database['public']['Tables']['products']['Insert'] {
  return {
    name: produto.name.trim(),
    description: produto.description.trim(),
    price: Number(produto.price),
    available: produto.available,
    image_url: produto.imageUrl || null
  };
}