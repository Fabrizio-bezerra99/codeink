import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoginComponente } from './login-componente';

describe('LoginComponente', () => {
  beforeEach(async () => {
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [LoginComponente],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('deve alternar a visibilidade da senha e seus atributos acessíveis', () => {
    const fixture = TestBed.createComponent(LoginComponente);
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
});
