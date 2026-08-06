import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { CatalogoService } from '../../core/services/catalogo-service';
import { HeaderComponent } from '../../shared/header-component/header-component';

@Component({
  selector: 'app-flash-tattoos-componente',
  imports: [RouterLink, HeaderComponent, CurrencyPipe],
  templateUrl: './flash-tattoos-componente.html',
  styleUrl: './flash-tattoos-componente.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlashTattoosComponente {
  private readonly catalogoService = inject(CatalogoService);

  protected readonly tamanhos =
    this.catalogoService.listarTamanhos();

  protected readonly tamanhoAtivo = signal('Todos');

  protected readonly tattoos = computed(() =>
    this.catalogoService
      .listarFlashTattoos()
      .filter(
        (item) =>
          this.tamanhoAtivo() === 'Todos' ||
          item.tamanho === this.tamanhoAtivo()
      )
  );
}