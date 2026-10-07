import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ClientsService } from '../../services/clients.service';
import { ClientsFormComponent, maskCnpj } from './clients-form.component';

describe('ClientsFormComponent', () => {
  let component: ClientsFormComponent;
  let fixture: ComponentFixture<ClientsFormComponent>;
  let clientsServiceMock: {
    findByCnpj: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
  let dialogMock: { open: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    clientsServiceMock = {
      findByCnpj: vi.fn(() => of({})),
      create: vi.fn(() => of({})),
    };
    dialogMock = {
      open: vi.fn(() => ({ afterClosed: () => of(true) })),
    };

    await TestBed.configureTestingModule({
      imports: [ClientsFormComponent, MatDialogModule],
      providers: [
        provideRouter([{ path: 'clientes', component: ClientsFormComponent }]),
        { provide: ClientsService, useValue: clientsServiceMock },
      ],
    })
      .overrideComponent(ClientsFormComponent, {
        set: { providers: [{ provide: MatDialog, useValue: dialogMock }] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ClientsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  it('marca os campos obrigatórios com asterisco', () => {
    const cnpjLabel = fixture.nativeElement.querySelector(
      'label[for="cnpj"]',
    ) as HTMLLabelElement;

    expect(cnpjLabel.classList.contains('is-required')).toBe(true);
  });

  it('ativa a borda de erro somente após tentar salvar', () => {
    expect(component.errorMatcher.submitted).toBe(false);

    component.save();

    expect(component.errorMatcher.submitted).toBe(true);
    expect(component.form.controls.cnpj.touched).toBe(true);
  });

  it('formata CNPJ bruto com máscara', () => {
    expect(maskCnpj('12345678000190')).toBe('12.345.678/0001-90');
  });

  it('aplica a máscara enquanto usuário digita', () => {
    component.onCnpjInput({
      target: { value: '1234567800019' },
    } as unknown as Event);

    expect(component.form.controls.cnpj.value).toBe('12.345.678/0001-9');
  });

  it('mantém  formulário inválido para  CNPJ incompleto', () => {
    component.form.controls.cnpj.setValue('12.345.678/0001');

    expect(component.form.controls.cnpj.invalid).toBe(true);
  });

  it('envia CNPJ sem pontuação', () => {
    component.form.setValue({
      id: 1,
      cnpj: '12.345.678/0001-90',
      companyName: 'Empresa Teste Ltda.',
      email: 'teste@exemplo.com',
    });

    component.save();

    expect(clientsServiceMock.create).toHaveBeenCalledWith({
      id: 1,
      cnpj: '12345678000190',
      companyName: 'Empresa Teste Ltda.',
      email: 'teste@exemplo.com',
    });
  });

  it('busca cliente usando apenas dígitos do CNPJ', () => {
    component.form.controls.cnpj.setValue('12.345.678/0001-90');

    component.searchCnpj();

    expect(clientsServiceMock.findByCnpj).toHaveBeenCalledWith(
      '12345678000190',
    );
  });

  it('abre um modal de alerta quando CNPJ não foi encontrado', () => {
    component.form.controls.cnpj.setValue('12.345.678/0001-90');
    clientsServiceMock.findByCnpj.mockReturnValue(
      throwError(() => new Error('404')),
    );

    component.searchCnpj();

    expect(dialogMock.open).toHaveBeenCalledWith(
      ConfirmDialogComponent,
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'CNPJ não encontrado',
          showCancel: false,
        }),
      }),
    );
  });

  it('reseta  formulário após o fechamento do modal de info nao encontrada', () => {
    clientsServiceMock.findByCnpj.mockReturnValue(
      throwError(() => new Error('404')),
    );
    component.form.setValue({
      id: 1,
      cnpj: '12.345.678/0001-90',
      companyName: 'Empresa Teste Ltda.',
      email: 'teste@exemplo.com',
    });

    component.searchCnpj();

    expect(component.form.getRawValue()).toEqual({
      id: null,
      cnpj: null,
      companyName: null,
      email: null,
    });
  });
});