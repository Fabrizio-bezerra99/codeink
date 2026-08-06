import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from '../core/services/auth-service';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const apiBaseUrl = `${environment.apiBaseUrl}/api/`;
  const isApiRequest = req.url.startsWith(apiBaseUrl);
  const isPublicAuthRequest =
    req.url.endsWith('/api/auth/login') || req.url.endsWith('/api/auth/cadastro');

  if (!isApiRequest || isPublicAuthRequest) {
    return next(req);
  }

  const token = authService.tokenAtual();
  const request = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !req.url.endsWith('/api/auth/me')
      ) {
        authService.logout();
        void router.navigate(['/login'], {
          queryParams: { redirect: router.url },
        });
      }

      return throwError(() => error);
    }),
  );
};
