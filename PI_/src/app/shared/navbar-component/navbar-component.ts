import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

interface LinkNavegacao {
  rota: string;
  rotulo: string;
  exata?: boolean;
}

@Component({
  selector: 'app-navbar-component',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  protected readonly menuAberto = signal(false);
  protected readonly links: readonly LinkNavegacao[] = [
    { rota: '/', rotulo: 'Home', exata: true },
    { rota: '/portfolio', rotulo: 'Portfólio' },
    { rota: '/tatuadores', rotulo: 'Tatuadores' },
    { rota: '/agendamento', rotulo: 'Agendamentos' },
    { rota: '/flash', rotulo: 'Flash' },
    { rota: '/contato', rotulo: 'Contato' },
  ];

  constructor(protected readonly authService: AuthService) {}

  protected alternarMenu(): void {
    this.menuAberto.update((aberto) => !aberto);
  }

  protected fecharMenu(): void {
    this.menuAberto.set(false);
  }

  protected rotaDaConta(): string {
    const perfil = this.authService.usuarioAtual()?.perfil;

    if (perfil === 'ADMIN') return '/dashboard';
    if (perfil === 'TATUADOR') return '/tatuadores';
    return '/perfil';
  }
}
