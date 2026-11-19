import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!isPlatformBrowser(platformId)) return true;
  if (!authService.configured && !authService.localDemoAvailable) {
    return router.createUrlTree(['/login']);
  }

  return authService.isAdmin().then(isAdmin =>
    isAdmin ? true : router.createUrlTree(['/login'])
  );
};