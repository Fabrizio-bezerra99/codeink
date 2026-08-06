import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AgendamentoComponente } from './agendamento-componente';

describe('AgendamentoComponente', () => {
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [AgendamentoComponente],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('deve exigir e enviar um trabalho do portfólio', () => {
    const fixture = TestBed.createComponent(AgendamentoComponente);
    fixture.detectChanges();

    clicarOpcao(fixture, 0);
    clicarProximo(fixture);

    expect(fixture.nativeElement.querySelectorAll('.portfolio-card')).not.toHaveLength(0);
    expect(botaoProximo(fixture).disabled).toBe(true);

    (fixture.nativeElement.querySelector('.portfolio-card') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(botaoProximo(fixture).disabled).toBe(false);

    avancarAteEnvio(fixture);

    const request = httpTesting.expectOne('http://localhost:8080/api/agendamentos');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toMatchObject({
      cliente: 'Cliente',
      artista: 'Lucas Oliveira',
      data: '30/08/2026',
      horario: '09:00',
      status: 'Pendente',
    });
    expect(request.request.body.projeto).toMatch(/^Portfólio: .+ — .+$/);
    expect(request.request.body.projeto).toContain('Lucas Oliveira');

    request.flush({
      id: 5,
      cliente: 'Cliente',
      artista: 'Lucas Oliveira',
      data: '30/08/2026',
      horario: '09:00',
      status: 'Pendente',
      projeto: request.request.body.projeto,
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.confirmation')).not.toBeNull();
  });

  it('deve validar a referência e enviar a descrição do projeto', () => {
    const fixture = TestBed.createComponent(AgendamentoComponente);
    fixture.detectChanges();

    clicarOpcao(fixture, 1);
    clicarProximo(fixture);

    expect(botaoProximo(fixture).disabled).toBe(true);

    const descricao = fixture.nativeElement.querySelector(
      '#descricao-referencia',
    ) as HTMLTextAreaElement;
    descricao.value = '  Uma lua no antebraço  ';
    descricao.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(botaoProximo(fixture).disabled).toBe(false);

    selecionarArquivo(
      fixture,
      new File(['conteúdo'], 'referencia.gif', { type: 'image/gif' }),
    );
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'PNG, JPG, JPEG ou WEBP',
    );

    selecionarArquivo(
      fixture,
      new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'referencia.png', {
        type: 'image/png',
      }),
    );
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      '5 MB',
    );

    selecionarArquivo(
      fixture,
      new File(['imagem'], 'referencia.webp', { type: 'image/webp' }),
    );
    expect(fixture.nativeElement.querySelector('.selected-file').textContent).toContain(
      'referencia.webp',
    );

    avancarAteEnvio(fixture);

    const request = httpTesting.expectOne('http://localhost:8080/api/agendamentos');

    expect(request.request.body.projeto).toBe('Referência própria: Uma lua no antebraço');
    expect(request.request.body).not.toHaveProperty('arquivo');

    request.flush({
      id: 6,
      cliente: 'Cliente',
      artista: 'Lucas Oliveira',
      data: '30/08/2026',
      horario: '09:00',
      status: 'Pendente',
      projeto: request.request.body.projeto,
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.confirmation')).not.toBeNull();
  });
});

function clicarOpcao(
  fixture: ComponentFixture<AgendamentoComponente>,
  indice: number,
): void {
  const opcoes = fixture.nativeElement.querySelectorAll('.option-grid button') as NodeListOf<HTMLButtonElement>;
  opcoes[indice].click();
  fixture.detectChanges();
}

function botaoProximo(fixture: ComponentFixture<AgendamentoComponente>): HTMLButtonElement {
  return fixture.nativeElement.querySelector(
    '.booking-navigation button:not(.button--ghost)',
  ) as HTMLButtonElement;
}

function clicarProximo(fixture: ComponentFixture<AgendamentoComponente>): void {
  botaoProximo(fixture).click();
  fixture.detectChanges();
}

function avancarAteEnvio(fixture: ComponentFixture<AgendamentoComponente>): void {
  clicarProximo(fixture);

  (fixture.nativeElement.querySelector('.artist-options button') as HTMLButtonElement).click();
  fixture.detectChanges();
  clicarProximo(fixture);

  const campoData = fixture.nativeElement.querySelector('input[type="date"]') as HTMLInputElement;
  campoData.value = '2026-08-30';
  campoData.dispatchEvent(new Event('input', { bubbles: true }));
  (fixture.nativeElement.querySelector('.time-grid button') as HTMLButtonElement).click();
  fixture.detectChanges();
  clicarProximo(fixture);
}

function selecionarArquivo(
  fixture: ComponentFixture<AgendamentoComponente>,
  arquivo: File,
): void {
  const campoArquivo = fixture.nativeElement.querySelector(
    '#arquivo-referencia',
  ) as HTMLInputElement;

  Object.defineProperty(campoArquivo, 'files', {
    configurable: true,
    value: [arquivo],
  });
  campoArquivo.dispatchEvent(new Event('change', { bubbles: true }));
  fixture.detectChanges();
}
