import { Usuario } from './usuario';

export interface Cliente extends Usuario {
  endereco?: string;
  dataNascimento?: Date;
}
