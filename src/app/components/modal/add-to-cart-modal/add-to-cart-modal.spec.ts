import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCartModal } from './add-to-cart-modal';

describe('AddToCartModal', () => {
  let component: AddToCartModal;
  let fixture: ComponentFixture<AddToCartModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToCartModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddToCartModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
