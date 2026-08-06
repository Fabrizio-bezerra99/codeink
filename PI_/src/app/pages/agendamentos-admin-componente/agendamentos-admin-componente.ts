import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { AgendamentoService } from '../../core/services/agendamento-service';
import type { AgendamentoResumo, StatusAgendamento } from '../../models/catalogo';

@Component({
  selector: 'app-agendamentos-admin-componente',
  imports: [],
  templateUrl: './agendamentos-admin-componente.html',
  styleUrl: './agendamentos-admin-componente.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgendamentosAdminComponente {
  private readonly agendamentoService = inject(AgendamentoService);

  private readonly agendamentosState = signal<readonly AgendamentoResumo[]>([]);
  private readonly idsAtualizandoState = signal<readonly number[]>([]);
  private readonly mensagemErroState = signal<string | null>(null);

  protected readonly agendamentos = this.agendamentosState.asReadonly();
  protected readonly idsAtualizando = this.idsAtualizandoState.asReadonly();
  protected readonly mensagemErro = this.mensagemErroState.asReadonly();

  constructor() {
    this.agendamentoService.listarResumos().subscribe({
      next: (agendamentos) => this.agendamentosState.set(agendamentos),
      error: () => this.agendamentosState.set([]),
    });
  }

  protected atualizarStatus(id: number, status: StatusAgendamento): void {
    if (this.idsAtualizandoState().includes(id)) {
      return;
    }

    this.mensagemErroState.set(null);
    this.idsAtualizandoState.update((ids) => [...ids, id]);

    this.agendamentoService.atualizarStatus(id, status).subscribe({
      next: (agendamentoAtualizado) => {
        this.agendamentosState.update((agendamentos) =>
          agendamentos.map((agendamento) =>
            agendamento.id === id
              ? agendamentoAtualizado
              : agendamento,
          ),
        );
        this.finalizarAtualizacao(id);
      },
      error: () => {
        this.mensagemErroState.set(
          'Não foi possível atualizar o status do agendamento. Tente novamente.',
        );
        this.finalizarAtualizacao(id);
      },
    });
  }

  protected estaAtualizando(id: number): boolean {
    return this.idsAtualizando().includes(id);
  }

  private finalizarAtualizacao(id: number): void {
    this.idsAtualizandoState.update((ids) =>
      ids.filter((itemId) => itemId !== id),
    );
  }
}
