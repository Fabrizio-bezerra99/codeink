import { Injectable } from '@angular/core';

import {
  ARTISTAS,
  AVALIACOES_ARTISTA,
  FLASH_TATTOOS,
  TRABALHOS_PORTFOLIO,
} from '../data/catalogo.mock';

import {
  ArtistaCatalogo,
  AvaliacaoArtista,
  FlashTattoo,
  TrabalhoPortfolio,
} from '../../models/catalogo';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  listar() {
    throw new Error('Method not implemented.');
  }

  listarArtistas(): readonly ArtistaCatalogo[] {
    return ARTISTAS;
  }

  listarFlashTattoos(): readonly FlashTattoo[] {
    return FLASH_TATTOOS;
  }

  listarTamanhos(): readonly string[] {
    return ['Todos', 'Pequeno', 'Médio', 'Grande'];
  }

  listarTrabalhosPortfolio(): readonly TrabalhoPortfolio[] {
    return TRABALHOS_PORTFOLIO;
  }

  listarAvaliacoesArtista(): readonly AvaliacaoArtista[] {
    return AVALIACOES_ARTISTA;
  }

  buscarTrabalhoPortfolioPorId(
    id: number
  ): TrabalhoPortfolio | undefined {
    return TRABALHOS_PORTFOLIO.find(
      (trabalho) => trabalho.id === id
    );
  }

  listarEstilosPortfolio(): readonly string[] {
    return [
      'Todos',
      ...new Set(
        TRABALHOS_PORTFOLIO.map(
          (trabalho) => trabalho.estilo
        )
      )
    ];
  }
}