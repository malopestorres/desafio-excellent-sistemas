import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'clientes', loadComponent: () => import('./clients/components/clients-list/clients-list.component').then(m => m.ClientsListComponent) },
  { path: 'clientes/cadastro', loadComponent: () => import('./clients/components/clients-form/clients-form.component').then(m => m.ClientsFormComponent) },
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  { path: '**', redirectTo: 'clientes' },
];
