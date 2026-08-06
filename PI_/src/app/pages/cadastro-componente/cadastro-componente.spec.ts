import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { CadastroComponente } from './cadastro-componente';

describe('CadastroComponente', () => {
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [CadastroComponente],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    sessionStorage.clear();
  });

  it('deve iniciar com a senha oculta e o botão acessível', () => {
    const fixture = TestBed.createComponent(CadastroComponente);
    fixture.detectChanges();

    const campoSenha = fixture.nativeElement.querySelector(
      'input[formControlName="senha"]',
    ) as HTMLInputElement;

    const botaoSenha = fixture.nativeElement.querySelector(
      '.password-field button',
    ) as HTMLButtonElement;

    expect(campoSenha.type).toBe('password');
    expect(botaoSenha.getAttribute('aria-label')).toBe('Mostrar senha');
    expect(botaoSenha.getAttribute('aria-pressed')).toBe('false');

    botaoSenha.click();
    fixture.detectChanges();

    expect(campoSenha.type).toBe('text');
    expect(botaoSenha.getAttribute('aria-label')).toBe('Ocultar senha');
    expect(botaoSenha.getAttribute('aria-pressed')).toBe('true');
  });

  it('deve alternar a visibilidade da confirmação de senha e seus atributos acessíveis', () => {
    const fixture = TestBed.createComponent(CadastroComponente);
    fixture.detectChanges();

    const campoConfirmacao = fixture.nativeElement.querySelector(
      'input[formControlName="confirmacaoSenha"]',
    ) as HTMLInputElement;

    const botoesSenha = fixture.nativeElement.querySelectorAll(
      '.password-field button',
    ) as NodeListOf<HTMLButtonElement>;
    const botaoConfirmacao = botoesSenha[1];

    expect(campoConfirmacao.type).toBe('password');
    expect(botaoConfirmacao.getAttribute('aria-label')).toBe('Mostrar confirmação de senha');
    expect(botaoConfirmacao.getAttribute('aria-pressed')).toBe('false');

    botaoConfirmacao.click();
    fixture.detectChanges();

    expect(campoConfirmacao.type).toBe('text');
    expect(botaoConfirmacao.getAttribute('aria-label')).toBe('Ocultar confirmação de senha');
    expect(botaoConfirmacao.getAttribute('aria-pressed')).toBe('true');
  });

  it('deve sincronizar valores preenchidos pelo navegador antes de validar o cadastro', () => {
    const fixture = TestBed.createComponent(CadastroComponente);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const campoNome = fixture.nativeElement.querySelector(
      'input[formControlName="nome"]',
    ) as HTMLInputElement;
    campoNome.value = 'Ana Lima';

    const campoEmail = fixture.nativeElement.querySelector(
      'input[formControlName="email"]',
    ) as HTMLInputElement;

    campoEmail.value = 'ana.lima@email.com';

    const campoTelefone = fixture.nativeElement.querySelector(
      'input[formControlName="telefone"]',
    ) as HTMLInputElement;

    campoTelefone.value = '(21) 99999-9999';

    const campoSenha = fixture.nativeElement.querySelector(
      'input[formControlName="senha"]',
    ) as HTMLInputElement;

    campoSenha.value = 'senha1234';

    const campoConfirmacaoSenha = fixture.nativeElement.querySelector(
      'input[formControlName="confirmacaoSenha"]',
    ) as HTMLInputElement;

    campoConfirmacaoSenha.value = 'senha1234';

    const botaoCadastrar = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    botaoCadastrar.click();
    fixture.detectChanges();
    const request = httpTesting.expectOne(
      'http://localhost:8080/api/auth/cadastro',
    );
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      nome: 'Ana Lima',
      email: 'ana.lima@email.com',
      telefone: '(21) 99999-9999',
      senha: 'senha1234',
    });
    request.flush({
      id: 1,
      nome: 'Ana Lima',
      email: 'ana.lima@email.com',
      telefone: '(21) 99999-9999',
      perfil: 'CLIENTE',
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.form-error')).toBeNull();
  });
});
