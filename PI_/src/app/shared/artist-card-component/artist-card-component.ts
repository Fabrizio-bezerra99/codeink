import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArtistaCatalogo } from '../../models/catalogo';

@Component({
  selector: 'app-artist-card',
  imports: [RouterLink],
  templateUrl: './artist-card-component.html',
  styleUrl: './artist-card-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistCardComponent {
  readonly artista = input.required<ArtistaCatalogo>();
}
