import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SubmittedErrorStateMatcher } from '../../../shared/utils/submitted-error-state-matcher';
import { ClientsService } from '../../services/clients.service';

export const CNPJ_MASK_PATTERN = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

export function maskCnpj(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 5) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  }
  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  }
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  }
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(
    5,
    8,
  )}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

@Component({
  selector: 'app-clients-form',
  imports: [
    CommonModule,
    HeaderComponent,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './clients-form.component.html',
  styleUrl: './clients-form.component.scss',
})
export class ClientsFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly clientsService = inject(ClientsService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  readonly errorMatcher = new SubmittedErrorStateMatcher();

  duplicateIdError = signal('');

  form = this.fb.group({
    id: [
      null as number | null,
      [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)],
    ],
    cnpj: ['', [Validators.required, Validators.pattern(CNPJ_MASK_PATTERN)]],
    companyName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  onCnpjInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.form.controls.cnpj.setValue(maskCnpj(input.value));
  }

  searchCnpj(): void {
    const cnpj = (this.form.controls.cnpj.value ?? '').replace(/\D/g, '');
    if (cnpj.length === 14) {
      this.clientsService.findByCnpj(cnpj).subscribe({
        next: (client) => {
          if (client.companyName) {
            this.form.controls.companyName.setValue(client.companyName);
          }
          if (client.email) {
            this.form.controls.email.setValue(client.email);
          }
        },
        error: () => this.showCnpjNotFoundDialog(),
      });
    }
  }

  private showCnpjNotFoundDialog(): void {
    const data: ConfirmDialogData = {
      title: 'CNPJ não encontrado',
      message:
        'Não encontramos dados para o CNPJ informado. Verifique o número informado e tente novamente.',
      confirmLabel: 'OK',
      cancelLabel: 'Cancelar',
      showCancel: false,
    };

    this.dialog
      .open(ConfirmDialogComponent, { data, width: '420px', maxWidth: '95vw' })
      .afterClosed()
      .subscribe(() => {
        this.form.reset();
      });
  }

  save(): void {
    if (this.form.invalid) {
      this.errorMatcher.submitted = true;
      this.form.markAllAsTouched();
      return;
    }

    const { id, cnpj, companyName, email } = this.form.getRawValue();
    this.clientsService
      .create({
        id: Number(id),
        cnpj: (cnpj ?? '').replace(/\D/g, ''),
        companyName: companyName ?? '',
        email: email ?? '',
      })
      .subscribe({
        next: () => this.router.navigate(['/clientes']),
        error: (err) => {
          const message = err?.error?.message;
          this.duplicateIdError.set(
            Array.isArray(message) ? message[0] : (message ?? ''),
          );
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/clientes']);
  }
}
