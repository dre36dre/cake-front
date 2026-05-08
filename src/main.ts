import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
<<<<<<< HEAD
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
=======
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptors/auth-interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
>>>>>>> aaf0b90 (Chamando endpoint /produtos do backend)
    provideRouter(routes)
  ]
});
