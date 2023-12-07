import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieComponent } from './pie.component';
import { HttpClientModule } from '@angular/common/http';

describe('PieComponent', () => {
  let component: PieComponent;
  let fixture: ComponentFixture<PieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PieComponent],
      imports: [HttpClientModule]
    });
    fixture = TestBed.createComponent(PieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
