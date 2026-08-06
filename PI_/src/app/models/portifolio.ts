import { Tatuador } from './tatuador';
import { Tatuagem } from './tatuagem';

export interface Portfolio {
  id?: number;
  tatuador: Tatuador;
  tatuagem?: Tatuagem;
  titulo: string;
  descricao?: string;
  imagemUrl: string;
  estilo: string;
  dataPublicacao?: Date;
  destaque?: boolean;
}
