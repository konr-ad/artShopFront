import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintingDetailComponent } from './painting-detail.component';

describe('PaintingDetailComponent', () => {
  let component: PaintingDetailComponent;
  let fixture: ComponentFixture<PaintingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaintingDetailComponent]
    });
    fixture = TestBed.createComponent(PaintingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
