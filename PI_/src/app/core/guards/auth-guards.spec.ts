import { computed, signal } from '@angular/core';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { TestBed } from '@angular/core/testing';

import { adminGuard } from './admin-guard';
import { authGuardGuard } from './auth-guard-guard';
import { clienteGuard } from './cliente-guard';
import { tatuadorGuard } from './tatuador-guard';
import {
  AuthService,
  UsuarioAutenticado,
} from '../services/auth-service';

describe('guards de autenticação', () => {
  const rota = {} as never;
  const estado = { url: '/rota-protegida' } as never;

  async function avaliar(
    guard: typeof authGuardGuard | typeof adminGuard | typeof clienteGuard | typeof tatuadorGuard,
    usuario: UsuarioAutenticado | null,
  ): Promise<boolean | UrlTree> {
    const usuarioSignal = signal<UsuarioAutenticado | null>(usuario);
    const authService = {
      usuarioAtual: usuarioSignal.asReadonly(),
      estaAutenticado: computed(() => usuarioSignal() !== null),
      aguardarRestauracao: () => of(true),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    });

    return firstValueFrom(
      TestBed.runInInjectionContext(() => guard(rota, estado) as never),
    );
  }

  it('deve aceitar somente CLIENTE na rota do cliente', async () => {
    const resultado = await avaliar(clienteGuard, {
      id: 1,
      nome: 'Cliente',
      email: 'cliente@exemplo.com',
      telefone: '21999999999',
      perfil: 'CLIENTE',
    });

    expect(resultado).toBe(true);
  });

  it('deve rejeitar ADMIN na rota exclusiva do cliente', async () => {
    const resultado = await avaliar(clienteGuard, {
      id: 1,
      nome: 'Admin',
      email: 'admin@exemplo.com',
      telefone: '21999999999',
      perfil: 'ADMIN',
    });

    expect(TestBed.inject(Router).serializeUrl(resultado as UrlTree)).toContain('/login');
  });

  it('deve aceitar somente ADMIN na rota administrativa', async () => {
    const resultado = await avaliar(adminGuard, {
      id: 1,
      nome: 'Admin',
      email: 'admin@exemplo.com',
      telefone: '21999999999',
      perfil: 'ADMIN',
    });

    expect(resultado).toBe(true);
  });

  it('deve aceitar somente TATUADOR na rota do tatuador', async () => {
    const resultado = await avaliar(tatuadorGuard, {
      id: 1,
      nome: 'Tatuador',
      email: 'tatuador@exemplo.com',
      telefone: '21999999999',
      perfil: 'TATUADOR',
    });

    expect(resultado).toBe(true);
  });

  it('deve redirecionar usuário não autenticado preservando o destino', async () => {
    const resultado = await avaliar(authGuardGuard, null);

    expect(TestBed.inject(Router).serializeUrl(resultado as UrlTree)).toBe(
      '/login?redirect=%2Frota-protegida',
    );
  });
});
