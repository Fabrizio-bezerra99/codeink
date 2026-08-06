import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../shared/header-component/header-component';

@Component({
  selector: 'app-contato-componente',
  imports: [ReactiveFormsModule, HeaderComponent],
  templateUrl: './contato-componente.html',
  styleUrl: './contato-componente.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContatoComponente {
  private readonly fb = inject(FormBuilder);
  protected readonly enviado = signal(false);
  protected readonly formulario = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    assunto: ['', Validators.required],
    mensagem: ['', [Validators.required, Validators.minLength(10)]],
  });

  protected enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enviado.set(true);
    this.formulario.reset();
  }

  protected novaMensagem(): void {
    this.enviado.set(false);
  }
}
