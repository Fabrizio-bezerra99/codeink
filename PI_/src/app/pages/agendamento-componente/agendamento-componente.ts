import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header-component/header-component';
import { AgendamentoService } from '../../core/services/agendamento-service';
import { AuthService } from '../../core/services/auth-service';
import { CatalogoService } from '../../core/services/catalogo-service';
import type {
  NovoAgendamentoPayload,
  TrabalhoPortfolio,
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
export class AgendamentoComponente implements OnDestroy {
  protected readonly etapas = [
    'Opção',
    'Detalhes do projeto',
    'Tatuador',
    'Data e horário',
    'Confirmação',
  ] as const;
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
  private referenciaObjectUrl: string | null = null;
  private readonly tamanhoMaximoArquivo = 5 * 1024 * 1024;

  protected readonly artistas = this.catalogoService.listarArtistas();
  protected readonly trabalhosPortfolio = this.catalogoService.listarTrabalhosPortfolio();

  protected readonly etapa = signal(0);
  protected readonly opcao = signal<OpcaoAgendamento | null>(null);
  private readonly portfolioSelecionadoState = signal<TrabalhoPortfolio | null>(null);
  protected readonly portfolioSelecionado = this.portfolioSelecionadoState.asReadonly();
  protected readonly descricaoReferencia = signal('');
  protected readonly nomeArquivoReferencia = signal('');
  protected readonly previewReferenciaUrl = signal<string | null>(null);
  protected readonly erroDetalhesProjeto = signal('');
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
      projeto: this.descricaoProjeto(),
    };
  });

  protected podeAvancar(): boolean {
    if (this.etapa() === 0) return this.opcao() !== null;
    if (this.etapa() === 1) return this.detalhesProjetoValidos();
    if (this.etapa() === 2) return this.artistaId() !== null;
    if (this.etapa() === 3) return Boolean(this.data() && this.horario());
    return true;
  }

  protected avancar(): void {
    if (!this.podeAvancar()) return;

    if (this.etapa() === 3 && !this.agendamentoSalvo) {
      this.salvarAgendamento();
      return;
    }

    this.etapa.update((valor) => Math.min(4, valor + 1));
  }

  protected voltar(): void {
    this.etapa.update((valor) => Math.max(0, valor - 1));
  }

  protected novoAgendamento(): void {
    this.limparReferencia();
    this.etapa.set(0);
    this.opcao.set(null);
    this.portfolioSelecionadoState.set(null);
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

  protected selecionarOpcao(opcao: OpcaoAgendamento): void {
    if (this.opcao() !== opcao) {
      if (opcao === 'portfolio') {
        this.limparReferencia();
      } else {
        this.portfolioSelecionadoState.set(null);
      }
    }

    this.opcao.set(opcao);
    this.erroDetalhesProjeto.set('');
  }

  protected selecionarTrabalhoPortfolio(trabalho: TrabalhoPortfolio): void {
    this.portfolioSelecionadoState.set(trabalho);
    this.erroDetalhesProjeto.set('');
  }

  protected atualizarDescricaoReferencia(event: Event): void {
    this.descricaoReferencia.set((event.target as HTMLTextAreaElement).value);
  }

  protected atualizarArquivoReferencia(event: Event): void {
    const campoArquivo = event.target as HTMLInputElement;
    const arquivo = campoArquivo.files?.[0];

    if (!arquivo) return;

    this.liberarPreviewReferencia();
    this.nomeArquivoReferencia.set('');

    if (arquivo.size > this.tamanhoMaximoArquivo) {
      campoArquivo.value = '';
      this.erroDetalhesProjeto.set('A imagem deve ter no máximo 5 MB.');
      return;
    }

    if (!this.tipoImagemValido(arquivo)) {
      campoArquivo.value = '';
      this.erroDetalhesProjeto.set('Selecione uma imagem PNG, JPG, JPEG ou WEBP.');
      return;
    }

    this.nomeArquivoReferencia.set(arquivo.name);

    if (typeof URL.createObjectURL === 'function') {
      this.referenciaObjectUrl = URL.createObjectURL(arquivo);
      this.previewReferenciaUrl.set(this.referenciaObjectUrl);
    }
  }

  ngOnDestroy(): void {
    this.liberarPreviewReferencia();
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
        this.etapa.set(4);
      },
      error: () => {
        this.salvandoAgendamento = false;
        this.erroAgendamento.set('Não foi possível enviar o agendamento. Tente novamente.');
      },
    });
  }

  private detalhesProjetoValidos(): boolean {
    return this.opcao() === 'portfolio'
      ? this.portfolioSelecionado() !== null
      : this.descricaoReferencia().trim().length > 0;
  }

  private descricaoProjeto(): string {
    if (this.opcao() === 'portfolio') {
      const trabalho = this.portfolioSelecionado();

      return trabalho ? `Portfólio: ${trabalho.titulo} — ${trabalho.artista}` : '';
    }

    const descricao = this.descricaoReferencia().trim();

    return descricao ? `Referência própria: ${descricao}` : '';
  }

  private tipoImagemValido(arquivo: File): boolean {
    const tiposAceitos = new Set(['image/png', 'image/jpeg', 'image/webp']);
    const extensoesAceitas = new Set(['png', 'jpg', 'jpeg', 'webp']);
    const extensao = arquivo.name.split('.').pop()?.toLowerCase();

    return (tiposAceitos.has(arquivo.type) || arquivo.type === '')
      && extensao !== undefined
      && extensoesAceitas.has(extensao);
  }

  private limparReferencia(): void {
    this.liberarPreviewReferencia();
    this.descricaoReferencia.set('');
    this.nomeArquivoReferencia.set('');
    this.erroDetalhesProjeto.set('');
  }

  private liberarPreviewReferencia(): void {
    if (this.referenciaObjectUrl && typeof URL.revokeObjectURL === 'function') {
      URL.revokeObjectURL(this.referenciaObjectUrl);
    }

    this.referenciaObjectUrl = null;
    this.previewReferenciaUrl.set(null);
  }

  private formatarData(data: string): string {
    const resultado = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data);

    return resultado
      ? `${resultado[3]}/${resultado[2]}/${resultado[1]}`
      : data;
  }
}
