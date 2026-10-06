import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ProductsFormComponent } from './products-form.component';

describe('ProductsFormComponent', () => {
  let component: ProductsFormComponent;
  let fixture: ComponentFixture<ProductsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsFormComponent],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  it('mostra o campo  ID como input number', () => {
    const input = fixture.nativeElement.querySelector('#id') as HTMLInputElement;
    expect(input?.type).toBe('number');
  });

  it('rejeita string no campo  ID', () => {
    component.form.controls.id.setValue('nao-e-um-numero' as unknown as number);

    expect(component.form.controls.id.invalid).toBe(true);
  });

  it('aceita ID numérico valido', () => {
    component.form.controls.id.setValue(3);

    expect(component.form.controls.id.valid).toBe(true);
  });
});