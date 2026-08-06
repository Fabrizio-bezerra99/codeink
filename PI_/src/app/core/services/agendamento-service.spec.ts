import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AGENDAMENTOS } from '../data/catalogo.mock';
import type { AgendamentoResumo } from '../../models/catalogo';
import { environment } from '../../../environments/environment';
import { AgendamentoService } from './agendamento-service';

const apiUrl = `${environment.apiBaseUrl}/api/agendamentos`;

describe('AgendamentoService', () => {
  let service: AgendamentoService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AgendamentoService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('deve criar o service', () => {
    expect(service).toBeTruthy();
  });

  it('deve listar agendamentos reais pela API', () => {
    let agendamentos: AgendamentoResumo[] | undefined;

    service.listarResumos().subscribe((resultado) => {
      agendamentos = resultado;
    });

    const request = httpTesting.expectOne(apiUrl);

    expect(request.request.method).toBe('GET');

    request.flush([
      {
        id: 1,
        cliente: 'Cliente Teste',
        artista: 'Artista Teste',
        data: '25/08/2026',
        horario: '14:00',
        status: 'Confirmado',
        projeto: 'Projeto Teste',
      },
    ]);

    expect(agendamentos).toEqual([
      {
        id: 1,
        cliente: 'Cliente Teste',
        artista: 'Artista Teste',
        data: '25/08/2026',
        horario: '14:00',
        status: 'Confirmado',
        projeto: 'Projeto Teste',
      },
    ]);
  });

  it('deve cadastrar um agendamento real pela API', () => {
    let agendamentoCriado: AgendamentoResumo | undefined;

    service
      .cadastrarAgendamento({
        cliente: 'Maria Souza',
        artista: 'Lucas Oliveira',
        data: '2026-08-30',
        horario: '16:00',
        status: 'Pendente',
        projeto: 'Tattoo floral',
      })
      .subscribe((resultado) => {
        agendamentoCriado = resultado;
      });

    const request = httpTesting.expectOne(apiUrl);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      cliente: 'Maria Souza',
      artista: 'Lucas Oliveira',
      data: '30/08/2026',
      horario: '16:00',
      status: 'Pendente',
      projeto: 'Tattoo floral',
    });

    request.flush({
      id: 5,
      cliente: 'Maria Souza',
      artista: 'Lucas Oliveira',
      data: '30/08/2026',
      horario: '16:00',
      status: 'Pendente',
      projeto: 'Tattoo floral',
    });

    expect(agendamentoCriado).toEqual({
      id: 5,
      cliente: 'Maria Souza',
      artista: 'Lucas Oliveira',
      data: '30/08/2026',
      horario: '16:00',
      status: 'Pendente',
      projeto: 'Tattoo floral',
    });
    expect(localStorage.getItem('codeInk.agendamentos')).toBeNull();
  });

  it('deve atualizar o status do agendamento pela API', () => {
    let agendamentoAtualizado: AgendamentoResumo | undefined;

    service.atualizarStatus(1, 'Confirmado').subscribe((resultado) => {
      agendamentoAtualizado = resultado;
    });

    const request = httpTesting.expectOne(`${apiUrl}/1/status`);

    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ status: 'Confirmado' });

    request.flush({
      id: 1,
      cliente: 'Maria Souza',
      artista: 'Lucas Oliveira',
      data: '30/08/2026',
      horario: '16:00',
      status: 'Confirmado',
      projeto: 'Tattoo floral',
    });

    expect(agendamentoAtualizado).toEqual({
      id: 1,
      cliente: 'Maria Souza',
      artista: 'Lucas Oliveira',
      data: '30/08/2026',
      horario: '16:00',
      status: 'Confirmado',
      projeto: 'Tattoo floral',
    });
  });

  it('deve listar os agendamentos mockados quando não existem dados salvos', () => {
    const agendamentos = service.listarResumosLocais();

    expect(agendamentos).toHaveLength(AGENDAMENTOS.length);
    expect(agendamentos.map((item) => item.id)).toEqual(AGENDAMENTOS.map((item) => item.id));
  });

  it('deve cadastrar um resumo com os dados formatados', () => {
    const agendamento = service.cadastrarResumo('  Ana Lima  ', {
      artista: 'Mariana Costa',
      data: '2026-09-10',
      horario: '14:00',
      projeto: 'Referência própria',
    });

    expect(agendamento).toEqual({
      id: Math.max(...AGENDAMENTOS.map((item) => item.id)) + 1,
      cliente: 'Ana Lima',
      artista: 'Mariana Costa',
      data: '10/09/2026',
      horario: '14:00',
      status: 'Pendente',
      projeto: 'Referência própria',
    });
  });

  it('deve salvar o novo agendamento no localStorage', () => {
    const agendamento = service.cadastrarResumo('Ana Lima', {
      artista: 'Mariana Costa',
      data: '2026-09-10',
      horario: '14:00',
      projeto: 'Referência própria',
    });

    const valorSalvo = localStorage.getItem('codeInk.agendamentos');
    const agendamentosSalvos = JSON.parse(valorSalvo ?? '[]') as unknown;

    expect(agendamentosSalvos).toEqual([agendamento]);
  });

  it('deve atualizar o status de um agendamento personalizado', () => {
    const agendamento = service.cadastrarResumo('Ana Lima', {
      artista: 'Mariana Costa',
      data: '2026-09-10',
      horario: '14:00',
      projeto: 'Referência própria',
    });

    const atualizou = service.atualizarStatusResumo(agendamento.id, 'Confirmado');

    const agendamentoAtualizado = service
      .listarResumosLocais()
      .find((item) => item.id === agendamento.id);

    expect(atualizou).toBe(true);
    expect(agendamentoAtualizado?.status).toBe('Confirmado');
  });

  it('deve atualizar um agendamento mockado sem duplicá-lo', () => {
    const agendamentoMock = AGENDAMENTOS.find((item) => item.status === 'Pendente');

    if (!agendamentoMock) {
      throw new Error('O teste precisa de um agendamento mockado pendente.');
    }

    const atualizou = service.atualizarStatusResumo(agendamentoMock.id, 'Confirmado');

    const ocorrencias = service
      .listarResumosLocais()
      .filter((item) => item.id === agendamentoMock.id);

    expect(atualizou).toBe(true);
    expect(ocorrencias).toHaveLength(1);
    expect(ocorrencias[0].status).toBe('Confirmado');
  });

  it('deve retornar false sem alterar a lista quando o ID não existe', () => {
    const listaAntes = service.listarResumosLocais();

    const atualizou = service.atualizarStatusResumo(999, 'Cancelado');

    const listaDepois = service.listarResumosLocais();

    expect(atualizou).toBe(false);
    expect(listaDepois).toEqual(listaAntes);
    expect(localStorage.getItem('codeInk.agendamentos')).toBeNull();
  });

  it('deve persistir o novo status de um agendamento mockado', () => {
    const agendamentoMock = AGENDAMENTOS.find((item) => item.status === 'Pendente');

    if (!agendamentoMock) {
      throw new Error('O teste precisa de um agendamento mockado pendente.');
    }

    service.atualizarStatusResumo(agendamentoMock.id, 'Confirmado');

    const valorSalvo = localStorage.getItem('codeInk.agendamentos');
    const agendamentosSalvos = JSON.parse(valorSalvo ?? '[]') as AgendamentoResumo[];

    const agendamentoSalvo = agendamentosSalvos.find((item) => item.id === agendamentoMock.id);

    expect(agendamentoSalvo?.status).toBe('Confirmado');
  });

  it('deve carregar o agendamento salvo na chave antiga', () => {
    TestBed.resetTestingModule();

    localStorage.setItem(
      'codeInk.ultimoAgendamento',
      JSON.stringify({
        artista: 'Lucas Oliveira',
        data: '2026-09-11',
        horario: '15:00',
        projeto: 'Inspiração do portfólio',
      }),
    );

    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    const serviceComDadoAntigo = TestBed.inject(AgendamentoService);
    const [agendamentoMigrado] = serviceComDadoAntigo.listarResumosLocais();

    expect(agendamentoMigrado).toEqual({
      id: Math.max(...AGENDAMENTOS.map((item) => item.id)) + 1,
      cliente: 'João Silva',
      artista: 'Lucas Oliveira',
      data: '11/09/2026',
      horario: '15:00',
      status: 'Pendente',
      projeto: 'Inspiração do portfólio',
    });
  });

  it('deve ignorar dados inválidos e manter os agendamentos mockados', () => {
    TestBed.resetTestingModule();

    localStorage.setItem('codeInk.agendamentos', 'conteúdo que não é um JSON válido');

    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    const serviceComDadoInvalido = TestBed.inject(AgendamentoService);
    const agendamentos = serviceComDadoInvalido.listarResumosLocais();

    expect(agendamentos).toHaveLength(AGENDAMENTOS.length);
    expect(agendamentos.map((item) => item.id)).toEqual(AGENDAMENTOS.map((item) => item.id));
  });
});
