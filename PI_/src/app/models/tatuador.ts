import { Usuario } from './usuario';

export interface Tatuador extends Usuario {
  especialidade: string;
  biografia?: string;
  anosExperiencia?: number;
  fotoPerfil?: string;
  instagram?: string;
  disponivel?: boolean;
}
