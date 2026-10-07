import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { OrderResponse, OrdersService } from '../../services/orders.service';
import { OrdersListComponent } from './orders-list.component';

describe('OrdersListComponent', () => {
  let component: OrdersListComponent;
  let fixture: ComponentFixture<OrdersListComponent>;
  let ordersServiceMock: {
    findAll: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };
  let dialogMock: { open: ReturnType<typeof vi.fn> };

  const order: OrderResponse = {
    id: 1,
    client: { id: 1, companyName: 'Aurora Comércio de Alimentos Ltda.' },
    items: [],
    totalAmount: '150.00',
    createdAt: '2026-10-07T00:00:00.000Z',
  };

  beforeEach(async () => {
    ordersServiceMock = {
      findAll: vi.fn(() => of([order])),
      remove: vi.fn(() => of(undefined)),
    };
    dialogMock = {
      open: vi.fn(() => ({ afterClosed: () => of(true) })),
    };

    await TestBed.configureTestingModule({
      imports: [OrdersListComponent, MatDialogModule],
      providers: [
        provideRouter([]),
        { provide: OrdersService, useValue: ordersServiceMock },
      ],
    })
      .overrideComponent(OrdersListComponent, {
        set: { providers: [{ provide: MatDialog, useValue: dialogMock }] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(OrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  it('abre modal antes de excluir pedido', () => {
    component.deleteOrder(order);

    expect(dialogMock.open).toHaveBeenCalledWith(
      ConfirmDialogComponent,
      expect.objectContaining({
        data: expect.objectContaining({ title: 'Excluir pedido' }),
      }),
    );
  });

  it('remove  pedido da lista quando a exclusão foi confirmada', () => {
    component.deleteOrder(order);

    expect(ordersServiceMock.remove).toHaveBeenCalledWith(order.id);
    expect(component.orders()).toEqual([]);
  });

  it('não exclui  pedido quando modal cancela', () => {
    dialogMock.open.mockReturnValue({ afterClosed: () => of(false) });

    component.deleteOrder(order);

    expect(ordersServiceMock.remove).not.toHaveBeenCalled();
    expect(component.orders()).toEqual([order]);
  });
});