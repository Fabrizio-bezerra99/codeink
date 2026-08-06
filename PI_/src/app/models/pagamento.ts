import { Agendamento } from './agendamento';

export interface Pagamento {
  id?: number;
  agendamento: Agendamento;
  valor: number;
  formaPagamento: 'DINHEIRO' | 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO';
  status: 'PENDENTE' | 'PAGO' | 'CANCELADO' | 'REEMBOLSADO';
  dataPagamento?: Date;
}
