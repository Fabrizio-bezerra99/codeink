import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { AgendamentosAdminComponente } from './agendamentos-admin-componente';

const apiUrl = `${environment.apiBaseUrl}/api/agendamentos`;

describe('AgendamentosAdminComponente', () => {
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [AgendamentosAdminComponente],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('deve mostrar o novo status quando o administrador confirma um agendamento pendente', () => {
    const fixture = TestBed.createComponent(AgendamentosAdminComponente);
    httpTesting.expectOne(apiUrl).flush([
      {
        id: 2,
        cliente: 'Maria Santos',
        artista: 'Mariana Costa',
        data: '26/08/2026',
        horario: '10:00',
        status: 'Pendente',
      },
    ]);
    fixture.detectChanges();

    const botoesConfirmar = Array.from(
      fixture.nativeElement.querySelectorAll('.action-button--confirm'),
    ) as HTMLButtonElement[];

    const botaoConfirmar = botoesConfirmar.find((botao) => !botao.disabled);

    if (!botaoConfirmar) {
      throw new Error('O teste precisa de um agendamento pendente.');
    }

    const linhaDoAgendamento = botaoConfirmar.closest('tr');

    botaoConfirmar.click();
    fixture.detectChanges();

    const request = httpTesting.expectOne(`${apiUrl}/2/status`);

    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ status: 'Confirmado' });
    expect(linhaDoAgendamento?.textContent).toContain('Pendente');
    expect(botaoConfirmar.disabled).toBe(true);

    request.flush({
      id: 2,
      cliente: 'Maria Santos',
      artista: 'Mariana Costa',
      data: '26/08/2026',
      horario: '10:00',
      status: 'Confirmado',
    });
    fixture.detectChanges();

    expect(linhaDoAgendamento?.textContent).toContain('Confirmado');
    expect(botaoConfirmar.disabled).toBe(true);
  });

  it('deve mostrar o novo status quando o administrador cancela um agendamento', () => {
    const fixture = TestBed.createComponent(AgendamentosAdminComponente);
    httpTesting.expectOne(apiUrl).flush([
      {
        id: 2,
        cliente: 'Maria Santos',
        artista: 'Mariana Costa',
        data: '26/08/2026',
        horario: '10:00',
        status: 'Pendente',
      },
    ]);
    fixture.detectChanges();

    const botoesCancelar = Array.from(
      fixture.nativeElement.querySelectorAll('.action-button--cancel'),
    ) as HTMLButtonElement[];

    const botaoCancelar = botoesCancelar.find((botao) => !botao.disabled);

    if (!botaoCancelar) {
      throw new Error('O teste precisa de um agendamento que possa ser cancelado.');
    }

    const linhaDoAgendamento = botaoCancelar.closest('tr');

    botaoCancelar.click();
    fixture.detectChanges();

    const request = httpTesting.expectOne(`${apiUrl}/2/status`);

    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ status: 'Cancelado' });
    expect(linhaDoAgendamento?.textContent).toContain('Pendente');
    expect(botaoCancelar.disabled).toBe(true);

    request.flush({
      id: 2,
      cliente: 'Maria Santos',
      artista: 'Mariana Costa',
      data: '26/08/2026',
      horario: '10:00',
      status: 'Cancelado',
    });
    fixture.detectChanges();

    expect(linhaDoAgendamento?.textContent).toContain('Cancelado');
    expect(botaoCancelar.disabled).toBe(true);
  });

  it('deve manter o status anterior quando o backend retornar erro', () => {
    const fixture = TestBed.createComponent(AgendamentosAdminComponente);
    httpTesting.expectOne(apiUrl).flush([
      {
        id: 2,
        cliente: 'Maria Santos',
        artista: 'Mariana Costa',
        data: '26/08/2026',
        horario: '10:00',
        status: 'Pendente',
      },
    ]);
    fixture.detectChanges();

    const botaoConfirmar = fixture.nativeElement.querySelector(
      '.action-button--confirm',
    ) as HTMLButtonElement;

    botaoConfirmar.click();

    const request = httpTesting.expectOne(`${apiUrl}/2/status`);

    request.flush(
      { message: 'Erro ao atualizar o status.' },
      { status: 500, statusText: 'Internal Server Error' },
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('tbody tr')?.textContent).toContain('Pendente');
    expect(fixture.nativeElement.textContent).toContain(
      'Não foi possível atualizar o status do agendamento. Tente novamente.',
    );
    expect(botaoConfirmar.disabled).toBe(false);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });
});
