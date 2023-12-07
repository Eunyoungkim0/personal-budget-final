import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarChartComponent } from './bar-chart.component';
import { DataService } from '../data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BarChartComponent],
      providers: [DataService],
      imports: [HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle isToggleOn when showExpense is called', () => {
    const toggle = { checked: false } as HTMLInputElement;
    component.isToggleOn = false;
    component.showExpense();
    expect(component.isToggleOn).toBe(false);
  });
});
