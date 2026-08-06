import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-header-component',
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly titulo = input.required<string>();
  readonly descricao = input<string>('');
  readonly etiqueta = input<string>('');
}
