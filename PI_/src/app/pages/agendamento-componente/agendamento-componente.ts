import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header-component/header-component';
import { AgendamentoService } from '../../core/services/agendamento-service';
import { AuthService } from '../../core/services/auth-service';
import { CatalogoService } from '../../core/services/catalogo-service';
import type {
  NovoAgendamentoPayload,
  UltimoAgendamentoResumo,
} from '../../models/catalogo';

type OpcaoAgendamento = 'portfolio' | 'referencia';

@Component({
  selector: 'app-agendamento-componente',
  imports: [RouterLink, HeaderComponent],
  templateUrl: './agendamento-componente.html',
  styleUrl: './agendamento-componente.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgendamentoComponente {
  protected readonly etapas = ['Opção', 'Tatuador', 'Data e horário', 'Confirmação'] as const;
  protected readonly horarios = [
    '09:00',
    '10:00',
    '11:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ] as const;

  private readonly catalogoService = inject(CatalogoService);
  private readonly agendamentoService = inject(AgendamentoService);
  private readonly authService = inject(AuthService);
  private agendamentoSalvo = false;
  private salvandoAgendamento = false;

  protected readonly artistas = this.catalogoService.listarArtistas();

  protected readonly etapa = signal(0);
  protected readonly opcao = signal<OpcaoAgendamento | null>(null);
  protected readonly artistaId = signal<number | null>(null);
  protected readonly data = signal('');
  protected readonly horario = signal('');
  protected readonly erroAgendamento = signal('');
  protected readonly dataMinima = new Date().toISOString().slice(0, 10);
  protected readonly artistaSelecionado = computed(() =>
    this.artistas.find((artista) => artista.id === this.artistaId()),
  );
  protected readonly resumoAgendamento = computed<UltimoAgendamentoResumo>(() => {
    const artista = this.artistaSelecionado();

    return {
      artista: artista?.nome ?? '',
      data: this.formatarData(this.data()),
      horario: this.horario(),
      projeto: this.opcao() === 'portfolio' ? 'Inspiração do portfólio' : 'Referência própria',
    };
  });

  protected podeAvancar(): boolean {
    if (this.etapa() === 0) return this.opcao() !== null;
    if (this.etapa() === 1) return this.artistaId() !== null;
    if (this.etapa() === 2) return Boolean(this.data() && this.horario());
    return true;
  }

  protected avancar(): void {
    if (!this.podeAvancar()) return;

    if (this.etapa() === 2 && !this.agendamentoSalvo) {
      this.salvarAgendamento();
      return;
    }

    this.etapa.update((valor) => Math.min(3, valor + 1));
  }

  protected voltar(): void {
    this.etapa.update((valor) => Math.max(0, valor - 1));
  }

  private salvarAgendamento(): void {
    if (this.salvandoAgendamento) return;

    const resumo = this.resumoAgendamento();
    const payload: NovoAgendamentoPayload = {
      cliente: this.authService.usuarioAtual()?.nome ?? 'Cliente',
      artista: resumo.artista,
      data: resumo.data,
      horario: resumo.horario,
      status: 'Pendente',
      projeto: resumo.projeto,
    };

    this.salvandoAgendamento = true;
    this.erroAgendamento.set('');

    this.agendamentoService.cadastrarAgendamento(payload).subscribe({
      next: () => {
        this.agendamentoSalvo = true;
        this.salvandoAgendamento = false;
        this.etapa.set(3);
      },
      error: () => {
        this.salvandoAgendamento = false;
        this.erroAgendamento.set('Não foi possível enviar o agendamento. Tente novamente.');
      },
    });
  }

  protected novoAgendamento(): void {
    this.etapa.set(0);
    this.opcao.set(null);
    this.artistaId.set(null);
    this.data.set('');
    this.horario.set('');
    this.agendamentoSalvo = false;
    this.salvandoAgendamento = false;
    this.erroAgendamento.set('');
  }

  protected atualizarData(event: Event): void {
    this.data.set((event.target as HTMLInputElement).value);
  }

  private formatarData(data: string): string {
    const resultado = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data);

    return resultado
      ? `${resultado[3]}/${resultado[2]}/${resultado[1]}`
      : data;
  }
}
