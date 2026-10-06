import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'clientes', loadComponent: () => import('./clients/components/clients-list/clients-list.component').then(m => m.ClientsListComponent) },
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  { path: '**', redirectTo: 'clientes' },
];
