import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import { CatalogoService } from '../../core/services/catalogo-service';
import { ArtistCardComponent } from '../../shared/artist-card-component/artist-card-component';
import { HeaderComponent } from '../../shared/header-component/header-component';

@Component({
  selector: 'app-tatuadores-componente',
  imports: [HeaderComponent, ArtistCardComponent],
  templateUrl: './tatuadores-componente.html',
  styleUrl: './tatuadores-componente.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TatuadoresComponente {
  private readonly catalogoService = inject(CatalogoService);

  protected readonly artistas = this.catalogoService.listarArtistas();
    
}