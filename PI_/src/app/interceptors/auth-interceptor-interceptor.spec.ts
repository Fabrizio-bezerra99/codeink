import {
  HttpErrorResponse,
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { environment } from '../../environments/environment';
import { AuthService } from '../core/services/auth-service';
import { authInterceptorInterceptor } from './auth-interceptor-interceptor';

describe('authInterceptorInterceptor', () => {
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptorInterceptor])),
        provideHttpClientTesting(),
        provideRouter([{ path: 'login', redirectTo: '' }]),
      ],
    });

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    sessionStorage.clear();
  });

  it('deve adicionar Bearer somente nas chamadas da API', () => {
    const authService = TestBed.inject(AuthService);

    authService
      .login({ email: 'cliente@exemplo.com', senha: 'SenhaSegura123' })
      .subscribe();

    httpTesting
      .expectOne(`${environment.apiBaseUrl}/api/auth/login`)
      .flush({
        token: 'token-de-teste',
        tipo: 'Bearer',
        usuarioId: 1,
        nome: 'Cliente',
        email: 'cliente@exemplo.com',
        perfil: 'CLIENTE',
      });

    TestBed.inject(HttpClient).get(`${environment.apiBaseUrl}/api/usuarios`).subscribe();
    const request = httpTesting.expectOne(
      `${environment.apiBaseUrl}/api/usuarios`,
    );
    expect(request.request.headers.get('Authorization')).toBe('Bearer token-de-teste');
    request.flush([]);

    TestBed.inject(HttpClient).get('https://example.com/recurso').subscribe();
    const externalRequest = httpTesting.expectOne('https://example.com/recurso');
    expect(externalRequest.request.headers.has('Authorization')).toBe(false);
    externalRequest.flush({});
  });

  it('deve limpar a sessão quando uma rota protegida responder 401', () => {
    const authService = TestBed.inject(AuthService);
    authService
      .login({ email: 'cliente@exemplo.com', senha: 'SenhaSegura123' })
      .subscribe();

    httpTesting
      .expectOne(`${environment.apiBaseUrl}/api/auth/login`)
      .flush({
        token: 'token-de-teste',
        tipo: 'Bearer',
        usuarioId: 1,
        nome: 'Cliente',
        email: 'cliente@exemplo.com',
        perfil: 'CLIENTE',
      });

    TestBed.inject(HttpClient)
      .get(`${environment.apiBaseUrl}/api/usuarios`)
      .subscribe({ error: (erro: HttpErrorResponse) => expect(erro.status).toBe(401) });

    const request = httpTesting.expectOne(
      `${environment.apiBaseUrl}/api/usuarios`,
    );
    request.flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(authService.tokenAtual()).toBeNull();
  });
});
