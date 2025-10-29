import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCustomersListComponent } from './admin-customers-list.component';

describe('AdminCustomersListComponent', () => {
  let component: AdminCustomersListComponent;
  let fixture: ComponentFixture<AdminCustomersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCustomersListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCustomersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
