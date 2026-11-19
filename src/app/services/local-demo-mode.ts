import { ADMIN_DEMO_ENABLED } from '../config/admin-demo.config';

export function isLocalDemoMode(): boolean {
  return ADMIN_DEMO_ENABLED
    && typeof window !== 'undefined'
    && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
}
