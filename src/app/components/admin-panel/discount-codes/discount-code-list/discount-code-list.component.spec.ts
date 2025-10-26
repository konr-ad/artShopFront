import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountCodeListComponent } from './discount-code-list.component';

describe('DiscountCodeListComponent', () => {
  let component: DiscountCodeListComponent;
  let fixture: ComponentFixture<DiscountCodeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountCodeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountCodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
