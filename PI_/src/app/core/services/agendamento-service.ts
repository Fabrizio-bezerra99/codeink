import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Agendamento } from '../../models/agendamento';
import {
  AgendamentoResumo,
  NovoAgendamentoPayload,
  StatusAgendamento,
  UltimoAgendamentoResumo,
} from '../../models/catalogo';
import { environment } from '../../../environments/environment';
import { AGENDAMENTOS } from '../data/catalogo.mock';

@Injectable({
  providedIn: 'root',
})
export class AgendamentoService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/agendamentos`;
  private readonly storageKey = 'codeInk.agendamentos';
  private readonly legacyStorageKey = 'codeInk.ultimoAgendamento';

  private readonly agendamentosPersonalizados =
    this.carregarAgendamentos();

  constructor(private readonly http: HttpClient) {}

  listarResumos(): Observable<AgendamentoResumo[]> {
    return this.listar();
  }

  listarResumosLocais(): readonly AgendamentoResumo[] {
    const idsPersonalizados = new Set(
      this.agendamentosPersonalizados.map((item) => item.id),
    );

    return [
      ...this.agendamentosPersonalizados,
      ...AGENDAMENTOS.filter(
        (item) => !idsPersonalizados.has(item.id),
      ),
    ];
  }

  cadastrarResumo(
    cliente: string,
    resumo: UltimoAgendamentoResumo,
  ): AgendamentoResumo {
    const agendamento: AgendamentoResumo = {
      id: this.proximoId(),
      cliente: cliente.trim() || 'Cliente',
      artista: resumo.artista,
      data: this.formatarData(resumo.data),
      horario: resumo.horario,
      status: 'Pendente',
      projeto: resumo.projeto,
    };

    this.agendamentosPersonalizados.unshift(agendamento);
    this.salvarAgendamentos();

    localStorage.setItem(
      this.legacyStorageKey,
      JSON.stringify(resumo),
    );

    return agendamento;
  }

  atualizarStatusResumo(
    id: number,
    status: StatusAgendamento,
  ): boolean {
    const agendamentoPersonalizado =
      this.agendamentosPersonalizados.find(
        (item) => item.id === id,
      );

    if (agendamentoPersonalizado) {
      agendamentoPersonalizado.status = status;
    } else {
      const agendamentoMock = AGENDAMENTOS.find(
        (item) => item.id === id,
      );

      if (!agendamentoMock) {
        return false;
      }

      this.agendamentosPersonalizados.push({
        ...agendamentoMock,
        status,
      });
    }

    this.salvarAgendamentos();

    return true;
  }

  listar(): Observable<AgendamentoResumo[]> {
    return this.http.get<AgendamentoResumo[]>(this.apiUrl);
  }

  cadastrarAgendamento(
    payload: NovoAgendamentoPayload,
  ): Observable<AgendamentoResumo> {
    return this.http.post<AgendamentoResumo>(
      this.apiUrl,
      {
        ...payload,
        data: this.formatarData(payload.data),
      },
    );
  }

  atualizarStatus(
    id: number,
    status: StatusAgendamento,
  ): Observable<AgendamentoResumo> {
    return this.http.patch<AgendamentoResumo>(
      `${this.apiUrl}/${id}/status`,
      { status },
    );
  }

  buscarPorId(id: number): Observable<Agendamento> {
    return this.http.get<Agendamento>(
      `${this.apiUrl}/${id}`,
    );
  }

  cadastrar(
    agendamento: Agendamento,
  ): Observable<Agendamento> {
    return this.http.post<Agendamento>(
      this.apiUrl,
      agendamento,
    );
  }

  atualizar(
    id: number,
    agendamento: Agendamento,
  ): Observable<Agendamento> {
    return this.http.put<Agendamento>(
      `${this.apiUrl}/${id}`,
      agendamento,
    );
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
    );
  }

  private salvarAgendamentos(): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.agendamentosPersonalizados),
    );
  }

  private carregarAgendamentos(): AgendamentoResumo[] {
    const agendamentosSalvos = this.lerListaSalva();

    if (agendamentosSalvos.length > 0) {
      return agendamentosSalvos;
    }

    const ultimoAgendamento =
      this.lerUltimoAgendamentoLegado();

    if (!ultimoAgendamento) {
      return [];
    }

    return [
      {
        id: this.maiorIdMock() + 1,
        cliente: 'João Silva',
        artista: ultimoAgendamento.artista,
        data: this.formatarData(ultimoAgendamento.data),
        horario: ultimoAgendamento.horario,
        status: 'Pendente',
        projeto: ultimoAgendamento.projeto,
      },
    ];
  }

  private lerListaSalva(): AgendamentoResumo[] {
    try {
      const valorSalvo = localStorage.getItem(
        this.storageKey,
      );

      if (!valorSalvo) {
        return [];
      }

      const itens = JSON.parse(valorSalvo) as unknown;

      if (!Array.isArray(itens)) {
        return [];
      }

      return itens.filter(
        (item): item is AgendamentoResumo =>
          this.agendamentoValido(item),
      );
    } catch {
      return [];
    }
  }

  private lerUltimoAgendamentoLegado():
    | UltimoAgendamentoResumo
    | null {
    try {
      const valorSalvo = localStorage.getItem(
        this.legacyStorageKey,
      );

      if (!valorSalvo) {
        return null;
      }

      const item = JSON.parse(
        valorSalvo,
      ) as Partial<UltimoAgendamentoResumo>;

      if (
        typeof item.artista !== 'string' ||
        typeof item.data !== 'string' ||
        typeof item.horario !== 'string' ||
        typeof item.projeto !== 'string'
      ) {
        return null;
      }

      return {
        artista: item.artista,
        data: item.data,
        horario: item.horario,
        projeto: item.projeto,
      };
    } catch {
      return null;
    }
  }

  private agendamentoValido(
    item: unknown,
  ): item is AgendamentoResumo {
    if (!item || typeof item !== 'object') {
      return false;
    }

    const agendamento =
      item as Partial<AgendamentoResumo>;

    return (
      typeof agendamento.id === 'number' &&
      typeof agendamento.cliente === 'string' &&
      typeof agendamento.artista === 'string' &&
      typeof agendamento.data === 'string' &&
      typeof agendamento.horario === 'string' &&
      this.statusValido(agendamento.status)
    );
  }

  private statusValido(
    status: unknown,
  ): status is StatusAgendamento {
    return (
      status === 'Confirmado' ||
      status === 'Pendente' ||
      status === 'Finalizado' ||
      status === 'Cancelado'
    );
  }

  private proximoId(): number {
    const ids = [
      ...AGENDAMENTOS.map((item) => item.id),
      ...this.agendamentosPersonalizados.map(
        (item) => item.id,
      ),
    ];

    return Math.max(0, ...ids) + 1;
  }

  private maiorIdMock(): number {
    return Math.max(
      0,
      ...AGENDAMENTOS.map((item) => item.id),
    );
  }

  private formatarData(data: string): string {
    const resultado =
      /^(\d{4})-(\d{2})-(\d{2})$/.exec(data);

    return resultado
      ? `${resultado[3]}/${resultado[2]}/${resultado[1]}`
      : data;
  }
}
