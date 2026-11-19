import { Injectable } from '@angular/core';
import {
  ADMIN_DEMO_PASSWORD,
  ADMIN_DEMO_USERNAME
} from '../config/admin-demo.config';
import { SupabaseService } from './supabase.service';
import { isLocalDemoMode } from './local-demo-mode';

const DEMO_SESSION_KEY = 'cake-web-local-demo-admin';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private supabase: SupabaseService) {}

  get configured(): boolean {
    return this.supabase.configured;
  }

  get localDemoAvailable(): boolean {
    return !this.configured && isLocalDemoMode();
  }

  async login(email: string, password: string): Promise<boolean> {
    if (this.localDemoAvailable) {
      const valid = email.trim() === ADMIN_DEMO_USERNAME && password === ADMIN_DEMO_PASSWORD;
      if (valid) localStorage.setItem(DEMO_SESSION_KEY, 'true');
      return valid;
    }

    const { data, error } = await this.supabase.getClient().auth.signInWithPassword({ email, password });
    if (error) throw error;

    if (!await this.isAuthorizedAdmin(data.user.id)) {
      await this.supabase.getClient().auth.signOut();
      return false;
    }

    return true;
  }

  async isAdmin(): Promise<boolean> {
    if (this.localDemoAvailable) {
      return localStorage.getItem(DEMO_SESSION_KEY) === 'true';
    }

    const { data, error } = await this.supabase.getClient().auth.getUser();
    if (error) throw error;
    return data.user ? this.isAuthorizedAdmin(data.user.id) : false;
  }

  async logout(): Promise<void> {
    if (this.localDemoAvailable) {
      localStorage.removeItem(DEMO_SESSION_KEY);
      return;
    }

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
