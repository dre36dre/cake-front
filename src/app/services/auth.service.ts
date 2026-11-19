import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private supabase: SupabaseService) {}

  get configured(): boolean {
    return this.supabase.configured;
  }

  async login(email: string, password: string): Promise<boolean> {
    const { data, error } = await this.supabase.getClient().auth.signInWithPassword({ email, password });
    if (error) throw error;

    if (!await this.isAuthorizedAdmin(data.user.id)) {
      await this.supabase.getClient().auth.signOut();
      return false;
    }

    return true;
  }

  async isAdmin(): Promise<boolean> {
    const { data, error } = await this.supabase.getClient().auth.getUser();
    if (error) throw error;
    return data.user ? this.isAuthorizedAdmin(data.user.id) : false;
  }

  async logout(): Promise<void> {
    const { error } = await this.supabase.getClient().auth.signOut();
    if (error) throw error;
  }

  private async isAuthorizedAdmin(userId: string): Promise<boolean> {
    const { data, error } = await this.supabase.getClient()
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data !== null;
  }
}
