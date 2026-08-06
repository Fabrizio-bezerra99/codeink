import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AuthService } from './core/services/auth-service';
import { routes } from './app.routes';
import { authInterceptorInterceptor } from './interceptors/auth-interceptor-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(() => inject(AuthService).inicializarSessao()),
    provideHttpClient(withInterceptors([authInterceptorInterceptor])),
    provideRouter(routes),
  ],
};
