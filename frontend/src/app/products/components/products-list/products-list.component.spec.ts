import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Product, ProductsService } from '../../services/products.service';
import { ProductsListComponent } from './products-list.component';

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;
  let productsServiceMock: {
    findAll: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };
  let dialogMock: { open: ReturnType<typeof vi.fn> };

  const product: Product = {
    id: 1,
    description: 'Notebook',
    salePrice: 5000,
    stock: 10,
    images: [],
  };

  beforeEach(async () => {
    productsServiceMock = {
      findAll: vi.fn(() => of([product])),
      remove: vi.fn(() => of(undefined)),
    };
    dialogMock = {
      open: vi.fn(() => ({ afterClosed: () => of(true) })),
    };

    await TestBed.configureTestingModule({
      imports: [ProductsListComponent, MatDialogModule],
      providers: [
        provideRouter([]),
        { provide: ProductsService, useValue: productsServiceMock },
      ],
    })
      .overrideComponent(ProductsListComponent, {
        set: { providers: [{ provide: MatDialog, useValue: dialogMock }] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  it('mostra  linhas skeleton durante  carregamento', () => {
    component.isLoading.set(true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll('.skeleton-line').length,
    ).toBeGreaterThan(0);
  });

  it('remove  linhas  skeleton apos carregamento', () => {
    expect(component.isLoading()).toBe(false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.skeleton-line')).toBeNull();
  });

  it('abre modal de confirmação antes de excluir produto', () => {
    component.deleteProduct(product);

    expect(dialogMock.open).toHaveBeenCalledWith(
      ConfirmDialogComponent,
      expect.objectContaining({
        data: expect.objectContaining({ title: 'Excluir produto' }),
      }),
    );
  });

  it('remove  produto da lista quando  exclusão se confirma', () => {
    component.deleteProduct(product);

    expect(productsServiceMock.remove).toHaveBeenCalledWith(product.id);
    expect(component.products()).toEqual([]);
  });

  it('não exclui  produto quando modal cancela', () => {
    dialogMock.open.mockReturnValue({ afterClosed: () => of(false) });

    component.deleteProduct(product);

    expect(productsServiceMock.remove).not.toHaveBeenCalled();
    expect(component.products()).toEqual([product]);
  });

  it('mantem produto e exibe  mensagem de erro quando  exclusao falha', () => {
    productsServiceMock.remove.mockReturnValue(
      throwError(() => ({
        error: {
          message: 'Não é possível excluir um produto que está vinculado a um pedido',
        },
      })),
    );

    component.deleteProduct(product);

    expect(productsServiceMock.remove).toHaveBeenCalledWith(product.id);
    expect(component.products()).toEqual([product]);
    expect(component.errorMessage()).toBe(
      'Não é possível excluir um produto que está vinculado a um pedido',
    );
  });

  it('apaga  mensagem com erro anterior depois de confirmar uma exclusao', () => {
    component.errorMessage.set('Erro anterior');
    productsServiceMock.remove.mockReturnValue(
      throwError(() => ({ error: { message: 'Novo erro' } })),
    );

    component.deleteProduct(product);

    expect(component.errorMessage()).toBe('Novo erro');
  });
});