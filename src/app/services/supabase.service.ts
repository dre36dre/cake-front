import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../models/database';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../config/supabase.config';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly client: SupabaseClient<Database> | null =
    SUPABASE_URL && SUPABASE_ANON_KEY
      ? createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
      : null;

  get configured(): boolean {
    return this.client !== null;
  }

  getClient(): SupabaseClient<Database> {
    if (!this.client) {
      throw new Error('Configure SUPABASE_URL e SUPABASE_ANON_KEY em src/app/config/supabase.config.ts.');
    }

    return this.client;
  }

  async uploadImage(file: File, folder: 'products' | 'home'): Promise<string> {
    const extensions: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp'
    };
    const extension = extensions[file.type];

    if (!extension) {
      throw new Error('Use uma imagem JPG, PNG ou WebP.');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('A imagem deve ter no máximo 5 MB.');
    }

    const path = `${folder}/${crypto.randomUUID()}.${extension}`;
    const { data, error } = await this.getClient()
      .storage
      .from('site-images')
      .upload(path, file, { contentType: file.type, upsert: false });

    if (error) throw error;
    return this.getClient().storage.from('site-images').getPublicUrl(data.path).data.publicUrl;
  }
}
