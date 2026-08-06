import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrabalhoPortfolio } from '../../models/catalogo';

@Component({
  selector: 'app-tattoo-card',
  imports: [RouterLink],
  templateUrl: './tattoo-card-component.html',
  styleUrl: './tattoo-card-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TattooCardComponent {
  readonly trabalho = input.required<TrabalhoPortfolio>();
  readonly mostrarEstilo = input(true);
}
