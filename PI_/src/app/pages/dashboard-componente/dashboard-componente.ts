import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { AgendamentoService } from '../../core/services/agendamento-service';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-dashboard-componente',
  imports: [RouterLink],
  templateUrl: './dashboard-componente.html',
  styleUrl: './dashboard-componente.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponente {
  private readonly agendamentoService = inject(AgendamentoService);

  protected readonly agendamentos = toSignal(
    this.agendamentoService.listarResumos(),
    { initialValue: [] },
  );

  private readonly totalPendentes = computed(
    () => this.agendamentos().filter((item) => item.status === 'Pendente').length,
  );

  private readonly totalConfirmados = computed(
    () => this.agendamentos().filter((item) => item.status === 'Confirmado').length,
  );

  private readonly totalClientes = computed(
    () => new Set(this.agendamentos().map((item) => item.cliente)).size,
  );

  protected readonly indicadores = computed(() => [
    {
      rotulo: 'Agendamentos',
      valor: String(this.agendamentos().length),
      detalhe: `${this.totalConfirmados()} confirmados, ${this.totalPendentes()} pendentes`,
    },
    {
      rotulo: 'Clientes',
      valor: String(this.totalClientes()),
      detalhe: 'clientes com agendamento',
    },
    { rotulo: 'Tatuagens', valor: '18', detalhe: 'este mês' },
    { rotulo: 'Avaliações', valor: '35', detalhe: '4,8 de média' },
  ] as const);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected sair(): void {
    this.authService.logout();
    void this.router.navigate(['/']);
  }
}
