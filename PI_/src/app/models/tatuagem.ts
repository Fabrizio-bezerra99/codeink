import { Agendamento } from './agendamento';

export interface Tatuagem {
  id?: number;
  agendamento: Agendamento;
  nome?: string;
  descricao: string;
  estilo: string;
  localCorpo: string;
  tamanhoCm?: number;
  imagemReferencia?: string;
  dataRealizacao?: Date;
}
