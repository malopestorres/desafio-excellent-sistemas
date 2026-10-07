import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { OrdersFormComponent } from './orders-form.component';

describe('OrdersFormComponent', () => {
  let component: OrdersFormComponent;
  let fixture: ComponentFixture<OrdersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersFormComponent],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });
});