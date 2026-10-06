import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-clients-form',
  imports: [
    CommonModule,
    HeaderComponent,
    MatButtonModule,
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

  form = this.fb.nonNullable.group({
    cnpj: ['', [Validators.required, Validators.minLength(14)]],
    companyName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  searchCnpj(): void {
    const cnpj = this.form.controls.cnpj.value;
    if (cnpj.length >= 14) {
      this.clientsService.findByCnpj(cnpj).subscribe({
        next: (client) => {
          if (client.companyName) {
            this.form.controls.companyName.setValue(client.companyName);
          }
          if (client.email) {
            this.form.controls.email.setValue(client.email);
          }
        },
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { cnpj, companyName, email } = this.form.getRawValue();
    this.clientsService.create({ cnpj, companyName, email }).subscribe({
      next: () => this.router.navigate(['/clientes']),
    });
  }

  cancel(): void {
    this.router.navigate(['/clientes']);
  }
}