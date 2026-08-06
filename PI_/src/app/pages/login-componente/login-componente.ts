import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-login-componente',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-componente.html',
  styleUrl: './login-componente.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponente {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly mostrarSenha = signal(false);
  protected readonly mensagemErro = signal('');
  protected readonly formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(8)]],
    lembrar: [true],
  });

  protected entrar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { email, senha } = this.formulario.getRawValue();
    this.mensagemErro.set('');
    this.authService.login({ email, senha }).subscribe({
      next: (resposta) => {
        const redirect = this.route.snapshot.queryParamMap.get('redirect');
        void this.router.navigateByUrl(
          redirect || this.rotaInicial(resposta.perfil),
        );
      },
      error: (erro: HttpErrorResponse) =>
        this.mensagemErro.set(
          erro.error?.message ?? 'Não foi possível entrar. Verifique seus dados.',
        ),
    });
  }

  private rotaInicial(perfil: string): string {
    if (perfil === 'ADMIN') return '/dashboard';
    if (perfil === 'TATUADOR') return '/tatuadores';
    return '/perfil';
  }
}
