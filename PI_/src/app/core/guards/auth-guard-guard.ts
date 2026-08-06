import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth-service';

export const authGuardGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.aguardarRestauracao().pipe(
    map(() =>
      authService.estaAutenticado()
        ? true
        : router.createUrlTree(['/login'], {
            queryParams: { redirect: state.url },
          }),
    ),
  );
};
