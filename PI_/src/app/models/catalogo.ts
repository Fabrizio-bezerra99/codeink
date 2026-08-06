export interface ArtistaCatalogo {
  id: number;
  nome: string;
  especialidade: string;
  cidade: string;
  avaliacao: number;
  totalAvaliacoes: number;
  anosExperiencia: number;
  tatuagensRealizadas: number;
  clientesAtendidos: number;
  fotoUrl: string;
  biografia: string;
  trabalhos: readonly string[];
}

export interface TrabalhoPortfolio {
  id: number;
  titulo: string;
  artista: string;
  estilo: string;
  imagemUrl: string;
  descricao: string;
  duracao: string;
  sessoes: number;
  local: string;
}

export interface FlashTattoo {
  id: number;
  titulo: string;
  preco: number;
  tamanho: 'Pequeno' | 'Médio' | 'Grande';
  imagemUrl: string;
}

export type StatusAgendamento = 'Confirmado' | 'Pendente' | 'Finalizado' | 'Cancelado';

export interface AgendamentoResumo {
  id: number;
  cliente: string;
  artista: string;
  data: string;
  horario: string;
  status: StatusAgendamento;
  projeto?: string;
}

export interface NovoAgendamentoPayload {
  cliente: string;
  artista: string;
  data: string;
  horario: string;
  status: StatusAgendamento;
  projeto: string;
}

export interface UltimoAgendamentoResumo {
  artista: string;
  data: string;
  horario: string;
  projeto: string;
}

export interface AvaliacaoArtista {
  id: number;
  autor: string;
  data: string;
  nota: number;
  comentario: string;
}
