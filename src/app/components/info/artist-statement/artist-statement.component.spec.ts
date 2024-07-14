import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistStatementComponent } from './artist-statement.component';

describe('ArtistStatementComponent', () => {
  let component: ArtistStatementComponent;
  let fixture: ComponentFixture<ArtistStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistStatementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
