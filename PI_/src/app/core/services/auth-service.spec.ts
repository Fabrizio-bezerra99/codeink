import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import {
  AuthService,
  CadastroClienteResponse,
  LoginResponse,
  UsuarioAutenticado,
} from './auth-service';

const authUrl = `${environment.apiBaseUrl}/api/auth`;

describe('AuthService', () => {
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    sessionStorage.clear();
    localStorage.clear();
  });

  it('deve fazer login no backend e salvar somente a sessão em sessionStorage', () => {
    const service = TestBed.inject(AuthService);
    let resposta: LoginResponse | undefined;

    service
      .login({ email: ' CLIENTE@EXEMPLO.COM ', senha: 'SenhaSegura123' })
      .subscribe((valor) => (resposta = valor));

    const request = httpTesting.expectOne(`${authUrl}/login`);
    expect(request.request.body).toEqual({
      email: 'cliente@exemplo.com',
      senha: 'SenhaSegura123',
    });

    request.flush({
      token: 'token-de-teste',
      tipo: 'Bearer',
      usuarioId: 7,
      nome: 'Cliente',
      email: 'cliente@exemplo.com',
      perfil: 'CLIENTE',
    });

    expect(resposta?.perfil).toBe('CLIENTE');
    expect(sessionStorage.getItem('codeInk.accessToken')).toBe('token-de-teste');
    expect(JSON.parse(sessionStorage.getItem('codeInk.usuario') ?? '{}')).toEqual({
      id: 7,
      nome: 'Cliente',
      email: 'cliente@exemplo.com',
      telefone: '',
      perfil: 'CLIENTE',
    });
    expect(localStorage.getItem('codeInk.usuario')).toBeNull();
  });

  it('deve enviar o cadastro real sem fazer login automático', () => {
    const service = TestBed.inject(AuthService);
    let resposta: CadastroClienteResponse | undefined;

    service
      .cadastrar({
        nome: 'Maria Silva',
        email: ' MARIA@EXEMPLO.COM ',
        telefone: '21999999999',
        senha: 'SenhaSegura123',
      })
      .subscribe((valor) => (resposta = valor));

    const request = httpTesting.expectOne(`${authUrl}/cadastro`);
    expect(request.request.body).toEqual({
      nome: 'Maria Silva',
      email: 'maria@exemplo.com',
      telefone: '21999999999',
      senha: 'SenhaSegura123',
    });

    request.flush({
      id: 8,
      nome: 'Maria Silva',
      email: 'maria@exemplo.com',
      telefone: '21999999999',
      perfil: 'CLIENTE',
    });

    expect(resposta?.perfil).toBe('CLIENTE');
    expect(sessionStorage.getItem('codeInk.accessToken')).toBeNull();
  });

  it('deve restaurar a sessão consultando /me e limpar a sessão ao sair', () => {
    sessionStorage.setItem('codeInk.accessToken', 'token-antigo');

    const service = TestBed.inject(AuthService);
    service.inicializarSessao().subscribe();
    const request = httpTesting.expectOne(`${authUrl}/me`);
    expect(request.request.method).toBe('GET');

    const usuario: UsuarioAutenticado = {
      id: 9,
      nome: 'Cliente Restaurado',
      email: 'restaurado@exemplo.com',
      telefone: '21999999999',
      perfil: 'CLIENTE',
    };
    request.flush(usuario);

    expect(service.usuarioAtual()).toEqual(usuario);
    expect(service.estaAutenticado()).toBe(true);

    service.logout();
    expect(service.usuarioAtual()).toBeNull();
    expect(sessionStorage.getItem('codeInk.accessToken')).toBeNull();
    expect(sessionStorage.getItem('codeInk.usuario')).toBeNull();
  });
});
