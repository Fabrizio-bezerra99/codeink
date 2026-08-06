import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-componente',
  imports: [RouterLink],
  template: `<section class="not-found">
    <p class="eyebrow">Erro 404</p>
    <h1>Página não encontrada</h1>
    <p>O endereço acessado não existe ou foi movido.</p>
    <a class="button" routerLink="/">Voltar ao início</a>
  </section>`,
  styles: [
    `
      .not-found {
        min-height: 65dvh;
        display: grid;
        place-content: center;
        justify-items: center;
        padding: 2rem;
        text-align: center;
      }
      .not-found h1 {
        margin: 0.5rem 0;
        font-size: clamp(2rem, 6vw, 4rem);
      }
      .not-found > p:not(.eyebrow) {
        margin: 0 0 1.5rem;
        color: var(--text-muted);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponente {}
