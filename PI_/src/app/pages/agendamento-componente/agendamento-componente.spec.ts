import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
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

  it('deve enviar o agendamento e mostrar a confirmacao apos o sucesso', () => {
    const fixture = TestBed.createComponent(AgendamentoComponente);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.option-grid button') as HTMLButtonElement).click();
    fixture.detectChanges();
    (
      fixture.nativeElement.querySelector(
        '.booking-navigation button:not(.button--ghost)',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.artist-options button') as HTMLButtonElement).click();
    fixture.detectChanges();
    (
      fixture.nativeElement.querySelector(
        '.booking-navigation button:not(.button--ghost)',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();

    const campoData = fixture.nativeElement.querySelector('input[type="date"]') as HTMLInputElement;
    campoData.value = '2026-08-30';
    campoData.dispatchEvent(new Event('input', { bubbles: true }));

    (fixture.nativeElement.querySelector('.time-grid button') as HTMLButtonElement).click();
    fixture.detectChanges();

    const botoesNavegacao = fixture.nativeElement.querySelectorAll(
      '.booking-navigation button',
    ) as NodeListOf<HTMLButtonElement>;
    botoesNavegacao[1].click();

    const request = httpTesting.expectOne('http://localhost:8080/api/agendamentos');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toMatchObject({
      cliente: 'Cliente',
      artista: 'Lucas Oliveira',
      data: '30/08/2026',
      horario: '09:00',
      status: 'Pendente',
    });
    expect(request.request.body.projeto).toEqual(expect.any(String));
    expect(fixture.nativeElement.querySelector('.confirmation')).toBeNull();

    request.flush({
      id: 5,
      cliente: 'Cliente',
      artista: 'Lucas Oliveira',
      data: '30/08/2026',
      horario: '09:00',
      status: 'Pendente',
      projeto: 'Tattoo floral',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.confirmation')).not.toBeNull();
  });
});
