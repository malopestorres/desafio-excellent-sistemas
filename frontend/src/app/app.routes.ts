import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'clientes', loadComponent: () => import('./clients/components/clients-list/clients-list.component').then(m => m.ClientsListComponent) },
  { path: 'clientes/cadastro', loadComponent: () => import('./clients/components/clients-form/clients-form.component').then(m => m.ClientsFormComponent) },
  { path: 'produtos', loadComponent: () => import('./products/components/products-list/products-list.component').then(m => m.ProductsListComponent) },
  { path: 'produtos/novo', loadComponent: () => import('./products/components/products-form/products-form.component').then(m => m.ProductsFormComponent) },
  { path: 'produtos/editar/:id', loadComponent: () => import('./products/components/products-form/products-form.component').then(m => m.ProductsFormComponent) },
  { path: 'pedidos', loadComponent: () => import('./orders/components/orders-list/orders-list.component').then(m => m.OrdersListComponent) },
  { path: 'pedidos/novo', loadComponent: () => import('./orders/components/orders-form/orders-form.component').then(m => m.OrdersFormComponent) },
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  { path: '**', redirectTo: 'clientes' },
];
