import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalElementsComponent } from './additional-elements.component';

describe('AdditionalElementsComponent', () => {
  let component: AdditionalElementsComponent;
  let fixture: ComponentFixture<AdditionalElementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdditionalElementsComponent]
    });
    fixture = TestBed.createComponent(AdditionalElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
