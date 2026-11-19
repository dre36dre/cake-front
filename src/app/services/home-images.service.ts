import { Injectable } from '@angular/core';
import { defer, from, map, Observable } from 'rxjs';
import { HomeImage } from '../models/home-image';
import { SupabaseService } from './supabase.service';
import { isLocalDemoMode } from './local-demo-mode';
import { LocalDemoDataService } from './local-demo-data.service';

@Injectable({ providedIn: 'root' })
export class HomeImagesService {
  constructor(
    private supabase: SupabaseService,
    private localData: LocalDemoDataService
  ) {}

  listar(): Observable<HomeImage[]> {
    if (!this.supabase.configured && isLocalDemoMode()) {
      return defer(() => from(this.localData.listHomeImages())).pipe(
        map(images => images.map(image => ({
          id: image.id!,
          title: image.title,
          imageUrl: image.image_url,
          position: image.position
        })))
      );
    }

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
    if (!this.supabase.configured && isLocalDemoMode()) {
      return defer(() => from(this.localData.saveHomeImage({
        title: title.trim(),
        image_url: imageUrl,
        position: 0,
        created_at: new Date().toISOString()
      }))).pipe(
        map(image => ({
          id: image.id!,
          title: image.title,
          imageUrl: image.image_url,
          position: image.position
        }))
      );
    }

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
    if (!this.supabase.configured && isLocalDemoMode()) {
      return defer(() => from(this.localData.deleteHomeImage(id)));
    }

    return defer(() =>
      from(this.supabase.getClient().from('home_images').delete().eq('id', id))
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }

  upload(file: File): Promise<string> {
    if (!this.supabase.configured && isLocalDemoMode()) {
      return this.localData.fileAsDataUrl(file);
    }

    return this.supabase.uploadImage(file, 'home');
  }
}
