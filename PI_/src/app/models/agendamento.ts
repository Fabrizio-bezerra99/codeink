import { Cliente } from './cliente';
import { Tatuador } from './tatuador';

export interface Agendamento {
  id?: number;
  cliente: Cliente;
  tatuador: Tatuador;
  dataHora: Date;
  descricao: string;
  status: 'PENDENTE' | 'CONFIRMADO' | 'CONCLUIDO' | 'CANCELADO';
  valorEstimado?: number;
  observacoes?: string;
}
