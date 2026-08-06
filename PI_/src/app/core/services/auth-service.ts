import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, defer, finalize, map, Observable, of, shareReplay, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

export type PerfilUsuario = 'CLIENTE' | 'TATUADOR' | 'ADMIN';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  usuarioId: number;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
}

export interface CadastroClienteRequest {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
}

export interface CadastroClienteResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  perfil: 'CLIENTE';
}

export interface UsuarioAutenticado {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  perfil: PerfilUsuario;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/auth`;
  private readonly tokenKey = 'codeInk.accessToken';
  private readonly userKey = 'codeInk.usuario';
  private readonly usuarioSignal = signal<UsuarioAutenticado | null>(null);
  private readonly restauracaoConcluidaSignal = signal(false);
  private readonly restauracao$ = defer(() => this.restaurarSessao()).pipe(
    finalize(() => this.restauracaoConcluidaSignal.set(true)),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  readonly usuarioAtual = this.usuarioSignal.asReadonly();
  readonly estaAutenticado = computed(() => this.usuarioSignal() !== null);
  readonly sessaoRestaurada = this.restauracaoConcluidaSignal.asReadonly();

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, {
        email: request.email.trim().toLowerCase(),
        senha: request.senha,
      })
      .pipe(tap((response) => this.salvarSessao(response)));
  }

  cadastrar(request: CadastroClienteRequest): Observable<CadastroClienteResponse> {
    return this.http.post<CadastroClienteResponse>(`${this.apiUrl}/cadastro`, {
      nome: request.nome.trim(),
      email: request.email.trim().toLowerCase(),
      telefone: request.telefone.trim(),
      senha: request.senha,
    });
  }

  aguardarRestauracao(): Observable<boolean> {
    return this.restauracao$.pipe(map(() => true));
  }

  inicializarSessao(): Observable<UsuarioAutenticado | null> {
    return this.restauracao$;
  }

  tokenAtual(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  logout(): void {
    this.limparSessao();
  }

  private restaurarSessao(): Observable<UsuarioAutenticado | null> {
    const token = sessionStorage.getItem(this.tokenKey);

    if (!token) {
      this.limparSessao();
      return of(null);
    }

    return this.http.get<UsuarioAutenticado>(`${this.apiUrl}/me`).pipe(
      tap((usuario) => this.salvarUsuario(usuario)),
      catchError(() => {
        this.limparSessao();
        return of(null);
      }),
    );
  }

  private salvarSessao(response: LoginResponse): void {
    sessionStorage.setItem(this.tokenKey, response.token);
    this.salvarUsuario({
      id: response.usuarioId,
      nome: response.nome,
      email: response.email,
      telefone: '',
      perfil: response.perfil,
    });
  }

  private salvarUsuario(usuario: UsuarioAutenticado): void {
    const usuarioSeguro: UsuarioAutenticado = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      perfil: usuario.perfil,
    };

    this.usuarioSignal.set(usuarioSeguro);
    sessionStorage.setItem(this.userKey, JSON.stringify(usuarioSeguro));
  }

  private limparSessao(): void {
    this.usuarioSignal.set(null);
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
  }
}
