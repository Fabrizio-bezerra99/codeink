import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogoService } from '../../core/services/catalogo-service';
import { TattooCardComponent } from '../../shared/tattoo-card-component/tattoo-card-component';

@Component({
  selector: 'app-home-componente',
  imports: [RouterLink, TattooCardComponent],
  templateUrl: './home-componente.html',
  styleUrl: './home-componente.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponente {
  private readonly catalogoService = inject(CatalogoService);

  protected readonly trabalhosRecentes = this.catalogoService.listarTrabalhosPortfolio().slice(0, 4);
  protected readonly diferenciais = [
    {
      titulo: 'Tatuadores especializados',
      descricao: 'Artistas experientes em diferentes estilos.',
    },
    { titulo: 'Materiais premium', descricao: 'Tintas e materiais selecionados.' },
    { titulo: 'Higiene e segurança', descricao: 'Protocolos rígidos de esterilização.' },
    { titulo: 'Projeto personalizado', descricao: 'Criação exclusiva para cada cliente.' },
  ] as const;
}
