import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRefMock: { close: ReturnType<typeof vi.fn> };

  const data: ConfirmDialogData = {
    title: 'Excluir pedido',
    message: 'Deseja realmente excluir?',
    confirmLabel: 'Excluir',
    cancelLabel: 'Cancelar',
  };

  beforeEach(async () => {
    dialogRefMock = { close: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: dialogRefMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  it('mostra titulo, mensagem e rotulo de acao', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Excluir pedido');
    expect(text).toContain('Deseja realmente excluir?');
    expect(text).toContain('Excluir');
    expect(text).toContain('Cancelar');
  });

  it('fecha retornando true ao confirmar', () => {
    component.confirm();
    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('fecha retornando false ao cancelar', () => {
    component.cancel();
    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });

  it('oculta botão de cancelar no modo alerta', async () => {
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { ...data, confirmLabel: 'OK', showCancel: false },
        },
        { provide: MatDialogRef, useValue: dialogRefMock },
      ],
    }).compileComponents();

    const alertFixture = TestBed.createComponent(ConfirmDialogComponent);
    alertFixture.detectChanges();

    const cancelButton = alertFixture.nativeElement.querySelector('.btn-cancel');
    const text = alertFixture.nativeElement.textContent as string;

    expect(cancelButton).toBeNull();
    expect(text).toContain('OK');
    expect(text).not.toContain('Cancelar');
  });
});