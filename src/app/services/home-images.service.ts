import { Injectable } from '@angular/core';
import { defer, from, map, Observable } from 'rxjs';
import { HomeImage } from '../models/home-image';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class HomeImagesService {
  constructor(private supabase: SupabaseService) {}

  listar(): Observable<HomeImage[]> {
    return defer(() =>
      from(this.supabase.getClient().from('home_images').select('*').order('position').order('created_at'))
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []).map(image => ({
          id: image.id,
          title: image.title,
          imageUrl: image.image_url,
          position: image.position
        }));
      })
    );
  }

  criar(title: string, imageUrl: string): Observable<HomeImage> {
    return defer(() =>
      from(
        this.supabase.getClient()
          .from('home_images')
          .insert({ title: title.trim(), image_url: imageUrl })
          .select()
          .single()
      )
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return {
          id: data.id,
          title: data.title,
          imageUrl: data.image_url,
          position: data.position
        };
      })
    );
  }

  excluir(id: number): Observable<void> {
    return defer(() =>
      from(this.supabase.getClient().from('home_images').delete().eq('id', id))
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }

  upload(file: File): Promise<string> {
    return this.supabase.uploadImage(file, 'home');
  }
}
