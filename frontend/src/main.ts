import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth-interceptor';

registerLocaleData(localePt);

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes)
  ]
});
